import { Link, useLocation } from 'react-router-dom';
import { Beer, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const location = useLocation();

  // 💡 【追加】現在のURLやステートから「翌朝モード」かどうかを判定
  const searchParams = new URLSearchParams(location.search);
  const timingParam = searchParams.get('timing');
  const stateTiming = location.state?.result?.timing;

  // 診断画面（URLパラメータ）または 結果画面（location.state）で timing === 2 なら翌朝モード
  const isHangoverMode = 
    (location.pathname === '/diagnosis' && timingParam === '2') ||
    (location.pathname === '/result' && String(stateTiming) === '2');

  // 💡 【追加】モードに応じたテーマカラーを定義
  const iconColor = isHangoverMode ? 'text-cyan-500' : 'text-primary';
  const hoverColor = isHangoverMode ? 'hover:text-cyan-500' : 'hover:text-primary';
  const bgColor = isHangoverMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-primary hover:bg-orange-600';

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm relative z-50 transition-colors duration-500">
      <Link to="/" className="flex items-center gap-2 no-underline group">
        <Beer className={`${iconColor} w-8 h-8 transition-colors duration-500`} />
        <span className="text-xl font-bold text-gray-800">Nomu-Sup</span>
      </Link>

      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-700 font-medium mr-2">
              {user?.name || 'ユーザー'} さん
            </span>
            <Link to="/mypage" className={`text-gray-600 transition-colors flex items-center gap-1 ${hoverColor}`}>
              <User className="w-4 h-4" />
              マイページ
            </Link>
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1">
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`text-gray-600 font-medium transition-colors duration-300 ${hoverColor}`}>ログイン</Link>
            <Link to="/signup" className={`${bgColor} text-white px-5 py-2 rounded-full font-bold transition-colors duration-300 shadow-sm`}>新規登録</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;