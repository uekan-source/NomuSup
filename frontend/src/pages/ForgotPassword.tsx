import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { Mail, Send, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Railsの devise_scope で設定した auth/password (POST) へ送信
      await client.post('/auth/password', {
        user: { email }
      });
      // 成功したら完了画面に切り替える
      setIsSuccess(true);
    } catch (error: any) {
      console.error("メール送信エラー:", error.response?.data);
      alert('メールの送信に失敗しました。メールアドレスが正しいか確認してください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6 animate-fadeIn">
      <button onClick={() => navigate('/login')} className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span>ログイン画面に戻る</span>
      </button>

      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2">パスワードの再設定</h2>
        <p className="text-gray-500 text-sm">
          ご登録のメールアドレスを入力してください。<br />
          パスワード再設定用のリンクをお送りします。
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center">
          <h3 className="text-green-800 font-bold mb-2">メールを送信しました！</h3>
          <p className="text-green-700 text-sm mb-6">
            入力されたアドレスにパスワード再設定用のURLをお送りしました。メールボックスをご確認ください。
          </p>
          <Link to="/" className="text-primary font-bold hover:underline">
            トップページへ戻る
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="登録したメールアドレス"
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
            {isSubmitting ? '送信中...' : (
              <>
                <Send className="w-5 h-5" />
                再設定メールを送信する
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;