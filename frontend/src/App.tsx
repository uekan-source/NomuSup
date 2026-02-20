// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home'; 
import Timing from './pages/Timing'; 
import Diagnosis from './pages/Diagnosis';
import Result from './pages/Result';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyPage from './pages/MyPage';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/timing" element={<Timing />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/result" element={<Result />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
     </AuthProvider> 
  );
};

export default App;