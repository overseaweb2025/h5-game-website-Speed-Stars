import { NextRequest, NextResponse } from 'next/server';

// WebSocket上传博客接口
export async function POST(
  request: NextRequest,
  { params }: { params: { blog_slug: string } }
) {
  try {
    const { blog_slug } = params;
    
    if (!blog_slug) {
      return NextResponse.json(
        { success: false, error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // 验证认证和权限
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      );
    }

    // 获取上传的博客数据
    const blogData = await request.json();
    
    // 验证博客数据
    const validationResult = validateBlogData(blogData);
    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      );
    }

    console.log(`收到上传博客请求: ${blog_slug}`);

    // 处理博客上传
    const uploadResult = await uploadBlogAndRelatedData(blog_slug, blogData, {
      requestId: generateRequestId(),
      overwrite: blogData.overwrite || false
    });

    // 通过WebSocket广播上传事件
    await broadcastBlogUploadEvent({
      type: 'blog_uploaded',
      blogSlug: blog_slug,
      success: uploadResult.success,
      uploadedItems: uploadResult.uploadedItems,
      blogData: {
        title: blogData.title,
        author: blogData.author,
        category: blogData.category,
        tags: blogData.tags
      },
      timestamp: new Date().toISOString(),
      requestId: uploadResult.requestId
    });

    return NextResponse.json({
      success: true,
      message: `Blog ${blog_slug} uploaded successfully`,
      data: {
        blogSlug: blog_slug,
        uploadedItems: uploadResult.uploadedItems,
        timestamp: new Date().toISOString(),
        requestId: uploadResult.requestId,
        url: `/blog/${blog_slug}`
      }
    });

  } catch (error) {
    console.error('上传博客时发生错误:', error);
    
    // 广播上传失败事件
    await broadcastBlogUploadEvent({
      type: 'blog_upload_failed',
      blogSlug: params.blog_slug,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        blogSlug: params.blog_slug
      },
      { status: 500 }
    );
  }
}

// WebSocket连接管理
export async function GET(
  request: NextRequest,
  { params }: { params: { blog_slug: string } }
) {
  try {
    const upgradeHeader = request.headers.get('upgrade');
    
    if (upgradeHeader !== 'websocket') {
      return NextResponse.json(
        { success: false, error: 'Expected WebSocket upgrade' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'WebSocket connection info',
      endpoint: `/api/websocket/blog/upload/${params.blog_slug}`,
      protocols: ['blog-upload-v1']
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'WebSocket connection failed' },
      { status: 500 }
    );
  }
}

// 验证博客数据
function validateBlogData(blogData: any) {
  const required = ['title', 'content', 'author', 'category'];
  
  for (const field of required) {
    if (!blogData[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  if (blogData.title.length < 5 || blogData.title.length > 200) {
    return { valid: false, error: 'Title must be between 5 and 200 characters' };
  }

  if (blogData.content.length < 50) {
    return { valid: false, error: 'Content must be at least 50 characters' };
  }

  return { valid: true };
}

// 上传博客及相关数据的核心逻辑
async function uploadBlogAndRelatedData(
  blogSlug: string, 
  blogData: any,
  options: {
    requestId: string;
    overwrite: boolean;
  }
) {
  const uploadedItems: string[] = [];
  
  try {
    // 1. 检查博客是否已存在
    const exists = await checkBlogExists(blogSlug);
    if (exists && !options.overwrite) {
      throw new Error('Blog already exists. Use overwrite=true to replace.');
    }

    // 2. 上传博客文章数据
    console.log(`正在上传博客文章: ${blogSlug}`);
    await uploadBlogPost(blogSlug, {
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt || generateExcerpt(blogData.content),
      author: blogData.author,
      category: blogData.category,
      tags: blogData.tags || [],
      featured: blogData.featured || false,
      published: blogData.published !== false,
      publishDate: blogData.publishDate || new Date().toISOString(),
      meta: blogData.meta || {}
    });
    uploadedItems.push('blog_post');

    // 3. 生成和上传SEO数据
    console.log(`正在生成SEO数据: ${blogSlug}`);
    await uploadSEOData(blogSlug, {
      title: blogData.seo?.title || blogData.title,
      description: blogData.seo?.description || blogData.excerpt,
      keywords: blogData.seo?.keywords || blogData.tags?.join(', '),
      ogImage: blogData.seo?.ogImage || blogData.image,
      canonicalUrl: `/blog/${blogSlug}`
    });
    uploadedItems.push('seo_data');

    // 4. 添加到搜索索引
    console.log(`正在添加到搜索索引: ${blogSlug}`);
    await addToSearchIndex(blogSlug, {
      type: 'blog',
      title: blogData.title,
      content: blogData.content,
      author: blogData.author,
      category: blogData.category,
      tags: blogData.tags,
      publishDate: blogData.publishDate
    });
    uploadedItems.push('search_index');

    // 5. 生成缓存数据
    console.log(`正在生成缓存数据: ${blogSlug}`);
    await generateCacheData(blogSlug, 'blog');
    uploadedItems.push('cache_data');

    // 6. 更新分类统计
    console.log(`正在更新分类统计: ${blogData.category}`);
    await updateCategoryStats(blogData.category, 'increment');
    uploadedItems.push('category_stats');

    // 7. 更新网站地图
    console.log(`正在更新网站地图`);
    await updateSitemap('blog', blogSlug);
    uploadedItems.push('sitemap');

    // 8. 生成RSS feed
    console.log(`正在更新RSS feed`);
    await updateRSSFeed();
    uploadedItems.push('rss_feed');

    console.log(`博客 ${blogSlug} 上传完成，上传项目: ${uploadedItems.join(', ')}`);

    return {
      success: true,
      uploadedItems,
      requestId: options.requestId
    };

  } catch (error) {
    console.error(`上传博客 ${blogSlug} 时发生错误:`, error);
    throw new Error(`上传博客失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 通过WebSocket广播上传事件
async function broadcastBlogUploadEvent(event: any) {
  try {
    console.log('广播博客上传事件:', event);
    
    // 如果有WebSocket服务器实例，发送事件
    // if (global.wsServer) {
    //   global.wsServer.clients.forEach((client: any) => {
    //     if (client.readyState === WebSocket.OPEN) {
    //       client.send(JSON.stringify(event));
    //     }
    //   });
    // }
    
  } catch (error) {
    console.error('广播事件失败:', error);
  }
}

// 辅助函数实现（模拟）
async function checkBlogExists(blogSlug: string): Promise<boolean> {
  // 模拟检查博客是否存在
  return false;
}

async function uploadBlogPost(blogSlug: string, postData: any): Promise<void> {
  // 模拟上传博客文章到数据库
  console.log(`上传博客文章: ${blogSlug}`, postData);
}

async function uploadSEOData(blogSlug: string, seoData: any): Promise<void> {
  // 模拟上传SEO数据
  console.log(`上传SEO数据: ${blogSlug}`, seoData);
}

async function addToSearchIndex(blogSlug: string, indexData: any): Promise<void> {
  // 模拟添加到搜索索引
  console.log(`添加到搜索索引: ${blogSlug}`, indexData);
}

async function generateCacheData(blogSlug: string, type: string): Promise<void> {
  // 模拟生成缓存数据
  console.log(`生成缓存数据: ${blogSlug}, type: ${type}`);
}

async function updateCategoryStats(category: string, action: 'increment' | 'decrement'): Promise<void> {
  // 模拟更新分类统计
  console.log(`更新分类统计: ${category}, action: ${action}`);
}

async function updateSitemap(type: string, slug: string): Promise<void> {
  // 模拟更新网站地图
  console.log(`更新网站地图: ${type}/${slug}`);
}

async function updateRSSFeed(): Promise<void> {
  // 模拟更新RSS feed
  console.log('更新RSS feed');
}

function generateExcerpt(content: string, maxLength: number = 150): string {
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  return cleanContent.length > maxLength 
    ? cleanContent.substring(0, maxLength) + '...' 
    : cleanContent;
}

function generateRequestId(): string {
  return `blog_upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}