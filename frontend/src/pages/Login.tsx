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
    console.log("1. 送信開始"); 
    try {
      const response = await client.post('/auth/login', { 
        user: { email, password } 
      });

      console.log("2. Railsからのデータ:", response.data);

      const token = response.data.token;
      console.log("3. 抽出したトークン:", token);

      if (token) {
        login(token);
        console.log("4. login関数呼び出し完了。Storageを確認してください。");
        // ここで一旦止めて、Applicationタブにtokenが出たか見てください
        setTimeout(() => navigate('/mypage'), 1000); 
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data);
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
    </div>
  );
};

export default Login;