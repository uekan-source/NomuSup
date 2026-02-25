import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save } from 'lucide-react';

const UserEdit = () => {
  const { user, login } = useAuth(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // 画面を開いた時に現在のユーザー情報をセット
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.patch('/me', {
        user: { name, email }
      });

      // AuthContext の情報を新しいデータで上書きする
      const token = localStorage.getItem('token');
      if (token) {
        login(token, response.data.user); 
      }
      
      alert('プロフィールを更新しました！');
      navigate('/mypage');
    } catch (error: any) {
      alert('更新に失敗しました。');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">プロフィール編集</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">名前</label>
          <div className="relative">
            <User className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-full font-bold flex justify-center items-center gap-2">
          <Save className="w-5 h-5" />
          更新する
        </button>
      </form>
    </div>
  );
};

export default UserEdit;