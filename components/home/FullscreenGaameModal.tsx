// FullscreenGameModal.tsx
import React, { useState, useEffect } from 'react';

// 定义组件的props类型
interface FullscreenGameModalProps {
  title: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const FullscreenGameModal: React.FC<FullscreenGameModalProps> = ({ title, url, isOpen, onClose }) => {
  // 如果浮窗未打开，则不渲染任何内容
  if (!isOpen) {
    return null;
  }

  return (
    // 浮窗容器，用于实现全屏背景
    <div className="fullscreen-modal-overlay">
      
      {/* 浮窗内容区 */}
      <div className="fullscreen-modal-content">
        
        {/* 浮窗头部 */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times; {/* 乘号作为关闭图标 */}
          </button>
        </div>
        
        {/* 游戏内嵌区域 */}
        <div className="modal-body">
          {/* iframe 用于内嵌游戏链接 */}
          <iframe 
            src={url} 
            title={title}
            className="game-iframe"
            // 添加以下属性以确保更好的移动端兼容性
            allowFullScreen
            frameBorder="0"
          ></iframe>
        </div>
      </div>
      
      <style jsx>{`
        .fullscreen-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.95);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          overflow: hidden; /* 防止背景滚动 */
        }

        .fullscreen-modal-content {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #1a1a1a;
          color: #ffffff;
          box-sizing: border-box;
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
        }

        .modal-title {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .close-button {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
          padding: 0 5px;
          line-height: 1;
        }
        
        .modal-body {
          flex-grow: 1;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .game-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default FullscreenGameModal;