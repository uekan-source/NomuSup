import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  return (
    <BrowserRouter>
      {/* flex-col と min-h-screen で、フッターを常に一番下に配置します */}
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <Header />
        
        {/* メインコンテンツ（ここが各画面の中身になる） */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<div className="p-10 text-center text-xl font-bold">お酒を飲む前、飲んだ後。あなたの体調をサポート。</div>} />
            <Route path="/login" element={<div className="p-10 text-center">ログイン画面（準備中）</div>} />
            <Route path="/signup" element={<div className="p-10 text-center">新規登録画面（準備中）</div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;