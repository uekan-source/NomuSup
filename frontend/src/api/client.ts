import axios from 'axios';

const client = axios.create({
  // baseURL は環境変数を使う形にすると、デプロイ時に楽になります
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- ここから追加 ---
// リクエストインターセプター：送信前に毎回実行される処理
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // RailsのDevise JWTなどは、この 'Authorization' ヘッダーを見てユーザーを識別します
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
});
// --- ここまで追加 ---

export default client;