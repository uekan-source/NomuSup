// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home'; 
import Timing from './pages/Timing'; 
import Diagnosis from './pages/Diagnosis';
import Result from './pages/Result';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white text-gray-900">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} /> {/* 予定の文字を Home に置き換え */}
            <Route path="/login" element={<div className="p-10 text-center">ログイン画面（準備中）</div>} />
            <Route path="/signup" element={<div className="p-10 text-center">新規登録画面（準備中）</div>} />
            <Route path="/timing" element={<Timing />} />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;