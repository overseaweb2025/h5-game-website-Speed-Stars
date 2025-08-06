import axios from "axios";

 const instance = axios.create({
    baseURL: process.env.NEXT_API_URL,
    timeout: 15000, // 增加超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: false, // 关闭凭据发送以避免预检复杂化
    // 不在客户端设置 CORS 头，这应该由服务器处理
  })

export default instance
