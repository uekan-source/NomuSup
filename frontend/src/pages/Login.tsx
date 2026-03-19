import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // 環境に合わせてURLを自動で切り替える変数を準備 
  const isProduction = import.meta.env.PROD;
  
  // GoogleとGitHub用 (ローカルは localhost)
  const backendBaseUrl = isProduction 
    ? 'https://api.nomu-sup.com' 
    : 'http://localhost:3000';

  // X用 (ローカルは 127.0.0.1 のみ許可されているため分ける)
  const backendBaseUrlForX = isProduction 
    ? 'https://api.nomu-sup.com' 
    : 'http://127.0.0.1:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.post('/auth/login', { 
        user: { email, password } 
      });

      const token = response.data.token;
      const userData = response.data.data; 

      if (token && userData) {
        login(token, userData); 
        console.log("ログイン成功！ユーザー名:", userData.name);
        navigate('/mypage');
      } else {
        console.error("データが不足しています", response.data);
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data);
      alert('ログインに失敗しました。');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">おかえりなさい！</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-full font-bold">
          ログイン
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">または</span>
          </div>
        </div>

        <div className="mt-6">
          <a
            href={`${backendBaseUrl}/api/v1/users/auth/google_oauth2`}
            className="w-full flex items-center justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Googleロゴ" />
            Googleでログイン
          </a>
        </div>
      </div>

      <div className="mt-3">
        <a
          href={`${backendBaseUrl}/api/v1/users/auth/github`}
          className="w-full flex items-center justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm bg-[#24292F] text-sm font-bold text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="h-5 w-5 mr-3 fill-current" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHubでログイン
        </a>
      </div>

      <div className="mt-3">
        <a
          href={`${backendBaseUrlForX}/api/v1/users/auth/twitter`}
          className="w-full flex items-center justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm bg-black text-sm font-bold text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="h-4 w-4 mr-3 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Xでログイン
        </a>
      </div>

      <div className="mt-6 text-center">
        <Link to="/forgot-password" className="text-sm text-primary font-bold hover:underline">
          パスワードを忘れた方はこちら
        </Link>
      </div>
    </div>
  );
};

export default Login;