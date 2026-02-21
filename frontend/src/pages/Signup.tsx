import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      alert('パスワードが一致しません');
      return;
    }

    try {
      // 【修正ポイント1】Deviseが期待する user オブジェクト形式で送信
      const response = await client.post('/auth/signup', { 
        user: {
          name, 
          email, 
          password,
          password_confirmation: passwordConfirmation 
        }
      });
      
      // 【修正ポイント2】ヘッダーからトークンを抽出
      const authHeader = response.headers['authorization'] || response.headers['Authorization'];
      const token = authHeader ? authHeader.split(' ')[1] : null;

      const userData = response.data.data || response.data;

      if (token && userData) {
        // ★ 修正：login(token) を login(token, userData) に変更！
        login(token, userData); 
        navigate('/mypage');
      } else {
        // 万が一ボディに入っている場合
        const bodyToken = response.data.token;
        if (bodyToken && userData) {
          // ★ 修正：ここも同様に userData を追加！
          login(bodyToken, userData); 
          navigate('/mypage');
        } else {
          // どちらにもない場合はログイン画面へ
          alert('登録に成功しました。ログインしてください。');
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data);
      const errorMessages = error.response?.data?.errors?.join('\n') || '登録に失敗しました。';
      alert(errorMessages);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">アカウント作成</h2>
        <p className="text-gray-500 mt-2">あなたにぴったりの対策を記録しましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">ニックネーム</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="飲み助"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="example@nomusup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">パスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="8文字以上の英数字"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">パスワード（確認）</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="もう一度入力してください"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-4 mt-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
          登録して診断を始める
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500">
        既にアカウントをお持ちの方は{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">ログイン</Link>
      </p>
    </div>
  );
};

export default Signup;