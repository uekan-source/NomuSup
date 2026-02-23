import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { Lock, Save } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // URLの「?reset_password_token=xxx」の部分を取得するための機能
  const [searchParams] = useSearchParams();
  const token = searchParams.get('reset_password_token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      alert('パスワードが一致しません');
      return;
    }

    setIsSubmitting(true);

    try {
      // Railsのパスワード更新アクション (PUT) へ送信
      await client.put('/auth/password', {
        user: {
          reset_password_token: token,
          password: password,
          password_confirmation: passwordConfirmation
        }
      });
      
      alert('パスワードの再設定が完了しました！新しいパスワードでログインしてください。');
      navigate('/login');
    } catch (error: any) {
      console.error("パスワードリセットエラー:", error.response?.data);
      alert('再設定に失敗しました。URLの有効期限が切れているか、無効なリンクの可能性があります。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // トークンがないURLで直接アクセスされた場合の弾き処理
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">不正なアクセスです</h2>
        <p className="text-gray-600">パスワード再設定URLが正しくありません。</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2">新しいパスワード</h2>
        <p className="text-gray-500 text-sm">
          8文字以上の新しいパスワードを設定してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上の英数字"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード（確認用）</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="もう一度入力してください"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full text-white py-4 rounded-full font-bold flex justify-center items-center gap-2 ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-orange-600'
          } transition-colors`}
        >
          {isSubmitting ? '更新中...' : (
            <>
              <Save className="w-5 h-5" />
              パスワードを更新する
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;