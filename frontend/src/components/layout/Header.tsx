import { Link, useLocation } from 'react-router-dom';
import { Beer, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const timingParam = searchParams.get('timing');
  const stateTiming = location.state?.result?.timing;

  const isHangoverMode = 
    (location.pathname === '/diagnosis' && timingParam === '2') ||
    (location.pathname === '/result' && String(stateTiming) === '2');

  const iconColor = isHangoverMode ? 'text-cyan-500' : 'text-primary';
  const hoverColor = isHangoverMode ? 'hover:text-cyan-500' : 'hover:text-primary';
  const bgColor = isHangoverMode ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-primary hover:bg-orange-600';

  return (
    <header className="bg-white border-b border-gray-200 py-3 md:py-4 px-4 md:px-6 flex justify-between items-center shadow-sm relative z-50 transition-colors duration-500">
      
      {/* 💡 flex-shrink-0 と whitespace-nowrap で絶対に改行させない */}
      <Link to="/" className="flex items-center gap-1 md:gap-2 no-underline group flex-shrink-0">
        <Beer className={`${iconColor} w-7 h-7 md:w-8 md:h-8 transition-colors duration-500`} />
        <span className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">Nomu-Sup</span>
      </Link>

      <nav className="flex items-center gap-4 md:gap-6">
        {isLoggedIn ? (
          <>
            {/* 💡 スマホ(md未満)ではユーザー名を隠す */}
            <span className="text-gray-700 font-medium hidden md:inline-block truncate max-w-[150px]">
              {user?.name || 'ユーザー'} さん
            </span>
            
            <Link to="/mypage" className={`text-gray-600 transition-colors flex items-center gap-1 font-bold md:font-medium ${hoverColor}`}>
              <User className="w-5 h-5 md:w-5 md:h-5" />
              {/* 💡 スマホ(md未満)では文字を隠す */}
              <span className="hidden md:inline">マイページ</span>
            </Link>
            
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 font-bold md:font-medium">
              <LogOut className="w-5 h-5 md:w-5 md:h-5" />
              {/* 💡 スマホ(md未満)では文字を隠す */}
              <span className="hidden md:inline">ログアウト</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`text-gray-600 font-bold md:font-medium text-sm md:text-base transition-colors duration-300 ${hoverColor}`}>
              ログイン
            </Link>
            <Link to="/signup" className={`${bgColor} text-white px-4 py-1.5 md:px-5 md:py-2 text-sm md:text-base rounded-full font-bold transition-colors duration-300 shadow-sm whitespace-nowrap`}>
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;