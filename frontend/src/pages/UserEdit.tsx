import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, Scale, Activity, ChevronLeft } from 'lucide-react';

const UserEdit = () => {
  const { user, login } = useAuth(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // 💡 追加: 体重、性別、体質のstate
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [constitution, setConstitution] = useState('normal');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setWeight(user.weight?.toString() || '');
      setGender(user.gender || 'male');
      setConstitution(user.constitution || 'normal');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.patch('/me', {
        user: { 
          name, 
          email,
          weight: weight ? parseInt(weight) : null,
          gender,
          constitution
        }
      });

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
    <div className="max-w-md mx-auto py-10 px-6 animate-fadeIn pb-32">
      <button onClick={() => navigate('/mypage')} className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>マイページに戻る</span>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">プロフィール編集</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">名前</label>
            <div className="relative">
              <User className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* 💡 追加: シミュレーション用データ */}
        <div className="bg-orange-50/50 p-6 rounded-3xl shadow-sm border border-orange-100 space-y-5">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4" />
            シミュレーション設定（自動入力用）
          </h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
              <Scale className="w-4 h-4 text-gray-400" /> 体重 (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              placeholder="例: 60"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">性別</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${gender === 'male' ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' : 'bg-white text-gray-500 border-2 border-transparent'}`}
              >
                男性
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${gender === 'female' ? 'bg-pink-50 text-pink-600 border-2 border-pink-200' : 'bg-white text-gray-500 border-2 border-transparent'}`}
              >
                女性
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">お酒への強さ（体質）</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConstitution('normal')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${constitution === 'normal' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
              >
                普通・強い
              </button>
              <button
                type="button"
                onClick={() => setConstitution('weak')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${constitution === 'weak' ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
              >
                弱い・すぐ赤くなる
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white py-4 rounded-full font-bold flex justify-center items-center gap-2 shadow-lg transition-all">
          <Save className="w-5 h-5" />
          更新する
        </button>
      </form>
    </div>
  );
};

export default UserEdit;