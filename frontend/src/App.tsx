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
import UserEdit from './pages/UserEdit';
import DiagnosisHistory from './pages/DiagnosisHistory';
import DiagnosisHistoryDetail from './pages/DiagnosisHistoryDetail';
import { TermsOfService, PrivacyPolicy, Disclaimer } from './pages/StaticPages';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Simulation from './pages/Simulation';
import OAuthCallback from './pages/OAuthCallback';

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
              <Route path="/mypage/edit" element={<UserEdit />} />
              <Route path="/diagnosis/history" element={<DiagnosisHistory />} />
              <Route path="/diagnosis/history/:id" element={<DiagnosisHistoryDetail />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
     </AuthProvider> 
  );
};

export default App;