import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 1. URLから 'token' の中身を抜き取る
    const token = searchParams.get('token');

    if (token) {
      // 2. トークンが存在すれば、ブラウザに保存する（通常のログインと同じ処理）
      localStorage.setItem('token', token);

      // 3. ログイン完了として、トップページ（またはマイページ）へ強制移動させる
      navigate('/', { replace: true });
    } else {
      // トークンが無ければエラーとしてログイン画面へ戻す
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [navigate, searchParams]);

  // この画面は一瞬で切り替わる中継地点なので、ローディング表示だけしておく
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500">ログイン処理中...</p>
    </div>
  );
};

export default OAuthCallback;