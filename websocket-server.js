const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// WebSocket服务器配置
const WS_PORT = process.env.WS_PORT || 8080;

// 创建HTTP服务器
const server = http.createServer();

// 创建WebSocket服务器
const wss = new WebSocket.Server({ 
  server,
  path: '/ws',
  perMessageDeflate: false
});

// 存储客户端连接和房间信息
const clients = new Map();
const rooms = new Map();

// 客户端连接管理
wss.on('connection', (ws, request) => {
  const { pathname, query } = url.parse(request.url, true);
  const clientId = generateClientId();
  const userAgent = request.headers['user-agent'] || 'Unknown';
  
  console.log(`新的WebSocket连接: ${clientId}, UserAgent: ${userAgent}`);
  
  // 存储客户端信息
  clients.set(clientId, {
    ws,
    id: clientId,
    rooms: new Set(),
    userAgent,
    connectedAt: new Date(),
    lastPing: new Date()
  });

  // 发送连接确认
  ws.send(JSON.stringify({
    type: 'connection_established',
    clientId,
    timestamp: new Date().toISOString(),
    serverInfo: {
      version: '1.0.0',
      supportedProtocols: ['game-upload-v1', 'game-delete-v1', 'blog-upload-v1', 'blog-delete-v1']
    }
  }));

  // 处理客户端消息
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleClientMessage(clientId, message);
    } catch (error) {
      console.error(`解析客户端消息失败 (${clientId}):`, error);
      ws.send(JSON.stringify({
        type: 'error',
        error: 'Invalid message format',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // 处理连接关闭
  ws.on('close', (code, reason) => {
    console.log(`WebSocket连接关闭: ${clientId}, Code: ${code}, Reason: ${reason}`);
    handleClientDisconnect(clientId);
  });

  // 处理连接错误
  ws.on('error', (error) => {
    console.error(`WebSocket连接错误 (${clientId}):`, error);
    handleClientDisconnect(clientId);
  });

  // 处理ping/pong心跳
  ws.on('pong', () => {
    const client = clients.get(clientId);
    if (client) {
      client.lastPing = new Date();
    }
  });
});

// 处理客户端消息
function handleClientMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  console.log(`收到客户端消息 (${clientId}):`, message.type);

  switch (message.type) {
    case 'join_room':
      joinRoom(clientId, message.room);
      break;
      
    case 'leave_room':
      leaveRoom(clientId, message.room);
      break;
      
    case 'ping':
      client.ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date().toISOString()
      }));
      break;
      
    case 'subscribe_events':
      handleEventSubscription(clientId, message.eventTypes);
      break;
      
    default:
      console.warn(`未知消息类型: ${message.type}`);
      client.ws.send(JSON.stringify({
        type: 'error',
        error: `Unknown message type: ${message.type}`,
        timestamp: new Date().toISOString()
      }));
  }
}

// 加入房间
function joinRoom(clientId, roomName) {
  const client = clients.get(clientId);
  if (!client) return;

  // 添加客户端到房间
  if (!rooms.has(roomName)) {
    rooms.set(roomName, new Set());
  }
  
  rooms.get(roomName).add(clientId);
  client.rooms.add(roomName);

  console.log(`客户端 ${clientId} 加入房间: ${roomName}`);
  
  // 发送加入确认
  client.ws.send(JSON.stringify({
    type: 'room_joined',
    room: roomName,
    timestamp: new Date().toISOString()
  }));

  // 通知房间内其他客户端
  broadcastToRoom(roomName, {
    type: 'user_joined_room',
    clientId,
    room: roomName,
    timestamp: new Date().toISOString()
  }, clientId);
}

// 离开房间
function leaveRoom(clientId, roomName) {
  const client = clients.get(clientId);
  if (!client) return;

  if (rooms.has(roomName)) {
    rooms.get(roomName).delete(clientId);
    
    // 如果房间为空，删除房间
    if (rooms.get(roomName).size === 0) {
      rooms.delete(roomName);
    }
  }
  
  client.rooms.delete(roomName);

  console.log(`客户端 ${clientId} 离开房间: ${roomName}`);
  
  // 发送离开确认
  client.ws.send(JSON.stringify({
    type: 'room_left',
    room: roomName,
    timestamp: new Date().toISOString()
  }));

  // 通知房间内其他客户端
  broadcastToRoom(roomName, {
    type: 'user_left_room',
    clientId,
    room: roomName,
    timestamp: new Date().toISOString()
  }, clientId);
}

// 处理事件订阅
function handleEventSubscription(clientId, eventTypes) {
  const client = clients.get(clientId);
  if (!client) return;

  client.subscribedEvents = new Set(eventTypes);
  
  console.log(`客户端 ${clientId} 订阅事件:`, eventTypes);
  
  client.ws.send(JSON.stringify({
    type: 'subscription_confirmed',
    eventTypes,
    timestamp: new Date().toISOString()
  }));
}

// 处理客户端断开连接
function handleClientDisconnect(clientId) {
  const client = clients.get(clientId);
  if (!client) return;

  // 从所有房间中移除客户端
  for (const roomName of client.rooms) {
    if (rooms.has(roomName)) {
      rooms.get(roomName).delete(clientId);
      
      // 通知房间内其他客户端
      broadcastToRoom(roomName, {
        type: 'user_disconnected',
        clientId,
        room: roomName,
        timestamp: new Date().toISOString()
      }, clientId);
      
      // 如果房间为空，删除房间
      if (rooms.get(roomName).size === 0) {
        rooms.delete(roomName);
      }
    }
  }

  // 删除客户端
  clients.delete(clientId);
  console.log(`客户端 ${clientId} 已断开连接并清理`);
}

// 向房间广播消息
function broadcastToRoom(roomName, message, excludeClientId = null) {
  if (!rooms.has(roomName)) return;

  const roomClients = rooms.get(roomName);
  let sentCount = 0;

  for (const clientId of roomClients) {
    if (clientId === excludeClientId) continue;
    
    const client = clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
        sentCount++;
      } catch (error) {
        console.error(`发送消息到客户端 ${clientId} 失败:`, error);
      }
    }
  }

  console.log(`向房间 ${roomName} 广播消息，发送给 ${sentCount} 个客户端`);
}

// 向所有客户端广播消息
function broadcastToAll(message, excludeClientId = null) {
  let sentCount = 0;

  for (const [clientId, client] of clients) {
    if (clientId === excludeClientId) continue;
    
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
        sentCount++;
      } catch (error) {
        console.error(`发送消息到客户端 ${clientId} 失败:`, error);
      }
    }
  }

  console.log(`向所有客户端广播消息，发送给 ${sentCount} 个客户端`);
}

// 根据事件类型广播
function broadcastEvent(event) {
  console.log('广播事件:', event.type);
  
  // 确定目标房间
  let targetRooms = [];
  
  if (event.type.includes('game_')) {
    targetRooms.push('games', `game_${event.gameSlug}`);
  } else if (event.type.includes('blog_')) {
    targetRooms.push('blogs', `blog_${event.blogSlug}`);
  }
  
  // 向相关房间广播
  for (const roomName of targetRooms) {
    broadcastToRoom(roomName, event);
  }
  
  // 向订阅了此事件类型的客户端广播
  for (const [clientId, client] of clients) {
    if (client.subscribedEvents && client.subscribedEvents.has(event.type)) {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(event));
        } catch (error) {
          console.error(`发送事件到客户端 ${clientId} 失败:`, error);
        }
      }
    }
  }
}

// 心跳检查
function heartbeat() {
  const now = new Date();
  const timeout = 30000; // 30秒超时
  
  for (const [clientId, client] of clients) {
    const timeSinceLastPing = now - client.lastPing;
    
    if (timeSinceLastPing > timeout) {
      console.log(`客户端 ${clientId} 心跳超时，断开连接`);
      client.ws.terminate();
      handleClientDisconnect(clientId);
    } else {
      // 发送ping
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.ping();
      }
    }
  }
}

// 获取服务器状态
function getServerStatus() {
  return {
    clients: clients.size,
    rooms: rooms.size,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  };
}

// 生成客户端ID
function generateClientId() {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 启动心跳检查
setInterval(heartbeat, 15000); // 每15秒检查一次

// 定期输出服务器状态
setInterval(() => {
  const status = getServerStatus();
  console.log(`WebSocket服务器状态 - 客户端: ${status.clients}, 房间: ${status.rooms}, 运行时间: ${Math.floor(status.uptime)}秒`);
}, 60000); // 每分钟输出一次

// 启动服务器
server.listen(WS_PORT, () => {
  console.log(`WebSocket服务器启动在端口 ${WS_PORT}`);
  console.log(`WebSocket连接地址: ws://localhost:${WS_PORT}/ws`);
});

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭WebSocket服务器...');
  
  // 通知所有客户端服务器即将关闭
  broadcastToAll({
    type: 'server_shutdown',
    message: 'Server is shutting down',
    timestamp: new Date().toISOString()
  });
  
  // 关闭所有连接
  for (const [clientId, client] of clients) {
    client.ws.close(1001, 'Server shutdown');
  }
  
  // 关闭服务器
  server.close(() => {
    console.log('WebSocket服务器已关闭');
    process.exit(0);
  });
});

// 导出广播函数供API路由使用
global.broadcastEvent = broadcastEvent;
global.broadcastToRoom = broadcastToRoom;
global.broadcastToAll = broadcastToAll;
global.getServerStatus = getServerStatus;

console.log('WebSocket服务器配置加载完成');