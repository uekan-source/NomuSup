import { Link } from 'react-router-dom';
import { Beer, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <Beer className="text-primary w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">Nomu-Sup</span>
      </Link>

      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-700 font-medium mr-2">
              {user?.name || 'ユーザー'} さん
            </span>
            <Link to="/mypage" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
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
            <Link to="/login" className="text-gray-600 font-medium hover:text-primary">ログイン</Link>
            <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full font-bold">新規登録</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;