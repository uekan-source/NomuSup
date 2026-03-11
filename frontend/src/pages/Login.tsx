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

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.post('/auth/login', { 
        user: { email, password } 
      });

      // Railsからのレスポンス構造に合わせてデータを取り出す
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
            href="http://localhost:3000/api/v1/users/auth/google_oauth2"
            className="w-full flex items-center justify-center py-4 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <img
              className="h-5 w-5 mr-3"
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Googleロゴ"
            />
            Googleでログイン
          </a>
        </div>
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