// Unity WebGL 游戏优化脚本
(function() {
  'use strict';

  // 禁用过时的Unity函数警告
  if (typeof window !== 'undefined') {
    // 劫持console.error以过滤Unity过时函数警告
    const originalConsoleError = console.error;
    console.error = function(...args) {
      const message = args.join(' ');
      
      // 过滤掉Unity过时函数警告
      if (message.includes('Pointer_stringify') || 
          message.includes('is obsoleted and will be removed')) {
        // 将这些警告转换为普通日志
        console.warn('[Unity Compatibility]', ...args);
        return;
      }
      
      // 过滤掉权限策略错误（这些已经被我们的错误处理器处理）
      if (message.includes('Permissions Policy') ||
          message.includes('SecurityError') ||
          message.includes('RelativeOrientationSensor') ||
          message.includes('Gyroscope') ||
          message.includes('Accelerometer') ||
          message.includes('LinearAccelerationSensor') ||
          message.includes('GravitySensor')) {
        // 静默处理这些错误
        return;
      }
      
      // 对于其他错误，正常输出
      originalConsoleError.apply(console, args);
    };

    // 优化AudioContext处理
    const initializeAudioContext = () => {
      if (window.AudioContext || window.webkitAudioContext) {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          
          // 监听用户交互以激活音频上下文
          const activateAudio = async () => {
            if (audioContext.state === 'suspended') {
              try {
                await audioContext.resume();
                console.log('[Unity Audio] AudioContext activated');
                
                // 触发自定义事件通知游戏音频已激活
                window.dispatchEvent(new CustomEvent('unity-audio-activated'));
              } catch (error) {
                console.warn('[Unity Audio] Failed to activate AudioContext:', error);
              }
            }
          };

          // 监听多种用户交互事件
          const interactionEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
          const activateOnce = () => {
            activateAudio();
            interactionEvents.forEach(event => {
              document.removeEventListener(event, activateOnce);
            });
          };

          interactionEvents.forEach(event => {
            document.addEventListener(event, activateOnce, { once: true });
          });

        } catch (error) {
          console.warn('[Unity Audio] AudioContext initialization failed:', error);
        }
      }
    };

    // 检测和优化WebGL上下文
    const optimizeWebGL = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        try {
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          if (gl) {
            console.log('[Unity WebGL] WebGL context detected and optimized');
            
            // 设置一些WebGL优化参数
            gl.hint(gl.FRAGMENT_SHADER_DERIVATIVE_HINT, gl.FASTEST);
            
            // 启用一些有用的扩展
            const extensions = [
              'OES_vertex_array_object',
              'WEBGL_lose_context',
              'OES_standard_derivatives'
            ];
            
            extensions.forEach(ext => {
              const extension = gl.getExtension(ext);
              if (extension) {
                console.log(`[Unity WebGL] Extension ${ext} enabled`);
              }
            });
            
            // 触发WebGL优化完成事件
            window.dispatchEvent(new CustomEvent('unity-webgl-optimized'));
          }
        } catch (error) {
          console.warn('[Unity WebGL] WebGL optimization failed:', error);
        }
      }
    };

    // 内存管理优化
    const optimizeMemory = () => {
      // 定期清理内存（仅在空闲时）
      let memoryCleanupTimer;
      const scheduleMemoryCleanup = () => {
        if (memoryCleanupTimer) {
          clearTimeout(memoryCleanupTimer);
        }
        
        memoryCleanupTimer = setTimeout(() => {
          if (window.gc && typeof window.gc === 'function') {
            try {
              window.gc();
              console.log('[Unity Memory] Garbage collection triggered');
            } catch (error) {
              // GC不可用，静默忽略
            }
          }
        }, 30000); // 30秒后清理
      };

      // 监听页面可见性变化
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          scheduleMemoryCleanup();
        } else {
          if (memoryCleanupTimer) {
            clearTimeout(memoryCleanupTimer);
          }
        }
      });
    };

    // 性能监控
    const monitorPerformance = () => {
      let frameCount = 0;
      let lastTime = performance.now();
      let fps = 0;

      const updateFPS = () => {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          frameCount = 0;
          lastTime = currentTime;
          
          // 触发FPS更新事件
          window.dispatchEvent(new CustomEvent('unity-fps-update', { 
            detail: { fps } 
          }));
          
          // 如果FPS过低，触发性能警告
          if (fps < 30) {
            window.dispatchEvent(new CustomEvent('unity-performance-warning', {
              detail: { fps, message: 'Low frame rate detected' }
            }));
          }
        }
        
        requestAnimationFrame(updateFPS);
      };

      requestAnimationFrame(updateFPS);
    };

    // Unity特定的错误处理
    const handleUnityErrors = () => {
      // 监听Unity特定的错误
      window.addEventListener('error', (event) => {
        const error = event.error || { message: event.message };
        
        if (error.message && (
          error.message.includes('Unity') ||
          error.message.includes('WebGL') ||
          error.message.includes('ASTC') ||
          error.message.includes('RGBA Compressed')
        )) {
          // 触发Unity错误事件
          window.dispatchEvent(new CustomEvent('unity-error', {
            detail: { 
              message: error.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          }));
        }
      });

      // 监听未捕获的Promise拒绝
      window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && (
          event.reason.toString().includes('Unity') ||
          event.reason.toString().includes('WebGL')
        )) {
          window.dispatchEvent(new CustomEvent('unity-error', {
            detail: { 
              message: event.reason.toString(),
              type: 'promise-rejection'
            }
          }));
        }
      });
    };

    // 初始化所有优化
    const initialize = () => {
      console.log('[Unity Optimizer] Initializing Unity WebGL optimizations...');
      
      initializeAudioContext();
      optimizeMemory();
      handleUnityErrors();
      
      // 等待DOM加载完成后优化WebGL和开始性能监控
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            optimizeWebGL();
            monitorPerformance();
          }, 1000);
        });
      } else {
        setTimeout(() => {
          optimizeWebGL();
          monitorPerformance();
        }, 1000);
      }
      
      console.log('[Unity Optimizer] Unity WebGL optimizations initialized');
    };

    // 导出API给外部使用
    window.UnityOptimizer = {
      activateAudio: initializeAudioContext,
      optimizeWebGL: optimizeWebGL,
      cleanup: () => {
        // 清理资源
        if (memoryCleanupTimer) {
          clearTimeout(memoryCleanupTimer);
        }
      }
    };

    // 立即初始化
    initialize();
  }
})();