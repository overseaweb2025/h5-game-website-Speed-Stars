import * as fs from 'fs/promises';
import * as path from 'path';

// 定义缓存目录的路径
const cacheDir = path.join(process.cwd(), 'cache');

export const clearServerCache = async () => {
  try {
    // 检查缓存目录是否存在
    const exists = await fs.stat(cacheDir).catch(() => false);
    if (!exists) {
      console.log('缓存目录不存在，无需清除。');
      return;
    }

    // 获取缓存目录中的所有文件和文件夹
    const files = await fs.readdir(cacheDir);

    // 遍历并删除每一个文件或文件夹
    const deletePromises = files.map(file => 
      fs.rm(path.join(cacheDir, file), { recursive: true, force: true })
    );

    await Promise.all(deletePromises);
    console.log('文件系统缓存已清除。');
  } catch (error) {
    console.error('清除文件系统缓存失败:', error);
    throw error;
  }
};