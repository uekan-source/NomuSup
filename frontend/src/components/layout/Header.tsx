import { Link } from 'react-router-dom';
import { Beer } from 'lucide-react'; // アイコンライブラリ

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
      {/* ロゴ部分：クリックするとトップへ戻る */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <Beer className="text-primary w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">Nomu-Sup</span>
      </Link>

      {/* ナビゲーション */}
      <nav className="flex gap-4">
        <Link to="/login" className="text-gray-600 font-medium hover:text-primary transition-colors flex items-center">
          ログイン
        </Link>
        <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
          新規登録
        </Link>
      </nav>
    </header>
  );
};

export default Header;