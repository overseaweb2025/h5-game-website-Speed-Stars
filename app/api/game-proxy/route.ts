import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  
  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing target URL' }, { status: 400 })
  }

  try {
    // 模拟桌面浏览器的User-Agent和其他头部信息
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Referer': 'https://www.google.com/'
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Target server error: ${response.status}` }, 
        { status: response.status }
      )
    }

    // 获取HTML内容
    const htmlContent = await response.text()
    
    // 修改HTML内容，注入强制绕过检测的脚本
    const modifiedHtml = htmlContent.replace(
      '</head>',
      `
      <script>
        // 强制模拟桌面环境
        (function() {
          // 重写navigator属性
          Object.defineProperty(navigator, 'userAgent', {
            get: function() { return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'; },
            configurable: true
          });
          
          Object.defineProperty(navigator, 'platform', {
            get: function() { return 'Win32'; },
            configurable: true
          });
          
          Object.defineProperty(navigator, 'maxTouchPoints', {
            get: function() { return 0; },
            configurable: true
          });
          
          // 重写screen属性
          Object.defineProperty(screen, 'width', {
            get: function() { return 1920; },
            configurable: true
          });
          
          Object.defineProperty(screen, 'height', {
            get: function() { return 1080; },
            configurable: true
          });
          
          Object.defineProperty(screen, 'availWidth', {
            get: function() { return 1920; },
            configurable: true
          });
          
          Object.defineProperty(screen, 'availHeight', {
            get: function() { return 1080; },
            configurable: true
          });

          // 强制设置window尺寸
          Object.defineProperty(window, 'innerWidth', {
            get: function() { return 1920; },
            configurable: true
          });
          
          Object.defineProperty(window, 'innerHeight', {
            get: function() { return 1080; },
            configurable: true
          });
          
          Object.defineProperty(window, 'outerWidth', {
            get: function() { return 1920; },
            configurable: true
          });
          
          Object.defineProperty(window, 'outerHeight', {
            get: function() { return 1080; },
            configurable: true
          });

          // 移除触摸事件检测
          if ('ontouchstart' in window) {
            delete window.ontouchstart;
          }
          if ('ontouchmove' in window) {
            delete window.ontouchmove;
          }
          if ('ontouchend' in window) {
            delete window.ontouchend;
          }
          
          // 模拟鼠标设备
          Object.defineProperty(window, 'TouchEvent', {
            get: function() { return undefined; },
            configurable: true
          });
          
          // 阻止移动端检测函数
          window.isMobile = function() { return false; };
          window.isMobileDevice = function() { return false; };
          window.detectMobile = function() { return false; };
          
          // 重写媒体查询
          const originalMatchMedia = window.matchMedia;
          window.matchMedia = function(query) {
            if (query.includes('hover: none') || query.includes('pointer: coarse')) {
              return { matches: false, addListener: function() {}, removeListener: function() {} };
            }
            return originalMatchMedia.call(this, query);
          };
          
          console.log('强制桌面模式已启用');
        })();
        
        // 自动点击加载按钮和强制启动游戏
        document.addEventListener('DOMContentLoaded', function() {
          console.log('开始查找并自动点击加载按钮');
          
          function findAndClickLoadButton() {
            // 查找常见的加载/播放按钮选择器
            const selectors = [
              'button[class*="play"]',
              'button[class*="start"]', 
              'button[class*="load"]',
              'div[class*="play"]',
              'div[class*="start"]',
              'div[class*="load"]',
              '.play-button',
              '.start-button',
              '.load-button',
              '#play-button',
              '#start-button',
              '#load-button',
              '[onclick*="play"]',
              '[onclick*="start"]',
              '[onclick*="load"]'
            ];
            
            for (let selector of selectors) {
              const elements = document.querySelectorAll(selector);
              for (let element of elements) {
                if (element && (element.offsetWidth > 0 || element.offsetHeight > 0)) {
                  console.log('找到加载按钮，自动点击:', selector);
                  element.click();
                  return true;
                }
              }
            }
            return false;
          }
          
          // 立即尝试点击
          setTimeout(() => findAndClickLoadButton(), 500);
          
          // 持续尝试点击（前5秒内）
          let attempts = 0;
          const maxAttempts = 10;
          const interval = setInterval(() => {
            attempts++;
            if (findAndClickLoadButton() || attempts >= maxAttempts) {
              clearInterval(interval);
            }
          }, 500);
          
          // 监听点击事件，自动触发所有可能的启动事件
          document.addEventListener('click', function(e) {
            console.log('检测到点击事件，强制触发游戏启动');
            
            // 触发常见的游戏启动事件
            const events = ['mousedown', 'mouseup', 'touchstart', 'touchend', 'keydown'];
            events.forEach(eventType => {
              document.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
          });
          
          // 强制音频上下文启动
          function forceAudioStart() {
            try {
              if (window.AudioContext || window.webkitAudioContext) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!window.gameAudioContext) {
                  window.gameAudioContext = new AudioContextClass();
                }
                if (window.gameAudioContext.state === 'suspended') {
                  window.gameAudioContext.resume();
                  console.log('强制启动音频上下文');
                }
              }
            } catch (error) {
              console.log('音频上下文启动失败:', error);
            }
          }
          
          // 模拟用户交互
          setTimeout(() => {
            forceAudioStart();
            document.dispatchEvent(new Event('click', { bubbles: true }));
            document.dispatchEvent(new Event('touchstart', { bubbles: true }));
          }, 1000);
        });
      </script>
      </head>`
    )

    return new NextResponse(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': 'frame-ancestors *'
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch game', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}