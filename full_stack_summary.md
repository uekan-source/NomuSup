## File: ./frontend/package.json
 ```json
{
  "name": "app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "axios": "^1.13.5",
    "lucide-react": "^0.574.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.13",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
 ```

## File: ./frontend/.vite/deps/package.json
 ```json
{
  "type": "module"
}
 ```

## File: ./frontend/vite.config.ts
 ```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0を解放して外部からアクセス可能にする
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Docker環境でのホットリロードを安定させる
    },
  },
}) ```

## File: ./frontend/src/App.css
 ```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
 ```

## File: ./frontend/src/main.tsx
 ```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) ```

## File: ./frontend/src/api/client.ts
 ```ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター：送信前に毎回実行される処理
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
});

export default client; ```

## File: ./frontend/src/context/AuthContext.tsx
 ```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

// 1. 型定義に user を追加し、login がデータを受け取れるようにする
interface AuthContextType {
  isLoggedIn: boolean;
  user: any; 
  login: (token: string, userData: any) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // 1. トークンがあれば、サーバーに自分の情報を聞きに行く
          const response = await client.get('/me');
          // 2. 成功したら、ログイン状態とユーザー情報を復元する
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          // トークンが期限切れなどの場合はクリアする
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    fetchUser();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setUser(userData); 
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Rails側にトークン無効化のリクエストを送る
      await client.delete('/auth/logout');
    } catch (error) {
      console.error('ログアウト通信エラー', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; ```

## File: ./frontend/src/components/layout/Footer.tsx
 ```tsx
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-50 py-10 border-t border-gray-100">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <p className="text-gray-400 text-sm mb-4">© 2026 Nomu-Sup. 薬剤師監修の二日酔い対策ソムリエ</p>
      <div className="flex justify-center gap-6 text-xs text-gray-500 font-medium">
        <Link to="/terms" className="hover:text-primary transition-colors">利用規約</Link>
        <Link to="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link>
        <Link to="/disclaimer" className="hover:text-primary transition-colors">免責事項</Link>
      </div>
    </div>
  </footer>
);

export default Footer; ```

## File: ./frontend/src/components/layout/Header.tsx
 ```tsx
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

export default Header; ```

## File: ./frontend/src/components/shared/DisclaimerContent.tsx
 ```tsx
import { AlertTriangle } from 'lucide-react';

export const DisclaimerContent = () => {
  return (
    <div className="space-y-6 text-gray-600 leading-relaxed">
      {/* 重要な警告（レッドフラッグ） */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-700 mb-2">【重要】利用を中止し、直ちに受診してください</h3>
            <p className="text-sm text-red-600 mb-2">
              以下の症状がある場合、命に関わる危険性があります。本アプリの利用を控え、直ちに救急車を呼ぶか、医療機関を受診してください。
            </p>
            <ul className="list-disc pl-5 text-sm text-red-700 font-bold space-y-1">
              <li>意識がもうろうとしている、呼びかけに応じない</li>
              <li>激しい頭痛、今までに経験したことのない頭痛</li>
              <li>血を吐く（吐血）、便に血が混じる（血便・黒色便）</li>
              <li>激しい腹痛、嘔吐が止まらない</li>
              <li>呼吸が苦しい、動悸が止まらない</li>
            </ul>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">1. 本サービスの目的と情報の性質</h3>
        <p>
          「Nomu-Sup」（以下、本サービス）は、薬剤師監修のロジックに基づき、一般的な二日酔い対策や市販薬の情報を提供するものです。
          <br />
          <strong>提供される情報は医師による診断・治療行為に代わるものではありません。</strong>
          個人の体質や持病、服薬状況によっては適さない場合があります。
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">2. 利用者の責任</h3>
        <p>
          本サービスの情報に基づく判断および行動は、利用者の自己責任において行ってください。
          推奨された市販薬を使用する際は、必ず製品の添付文書（説明書）をよく読み、用法・用量を守って使用してください。
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">3. 免責事項</h3>
        <p>
          本サービスの利用によって生じた体調不良、症状の悪化、またはその他の損害について、運営者は一切の責任を負いかねます。
          また、本サービスの情報は作成時点のものであり、最新の医学的知見と異なる場合があります。
        </p>
      </section>
    </div>
  );
}; ```

## File: ./frontend/src/components/shared/DisclaimerModal.tsx
 ```tsx
import { useState, useEffect } from 'react';
import { DisclaimerContent } from './DisclaimerContent'; // さっき作った文章をインポート

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // まだ同意していない場合のみ開く
    const hasAgreed = localStorage.getItem('disclaimer_agreed');
    if (!hasAgreed) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    // 同意フラグを保存
    localStorage.setItem('disclaimer_agreed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            安全にご利用いただくために
          </h2>
        </div>

        {/* コンテンツ（スクロール可能領域） */}
        <div className="p-6 overflow-y-auto flex-grow">
          <DisclaimerContent />
        </div>

        {/* フッター（同意ボタン） */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            onClick={handleAgree}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all"
          >
            内容を確認し、同意して利用する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal; ```

## File: ./frontend/src/pages/DiagnosisHistoryDetail.tsx
 ```tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ChevronLeft, Pill, AlertCircle, MessageCircle, Trash2, Loader2, Lightbulb } from 'lucide-react'; // 👈 Lightbulb を追加

const DiagnosisHistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (!window.confirm('この診断履歴を削除してもよろしいですか？')) return;

    try {
      await client.delete(`/diagnosis_logs/${id}`);
      alert('履歴を削除しました');
      navigate('/diagnosis/history'); 
    } catch (error) {
      console.error("削除に失敗しました", error);
      alert('削除に失敗しました');
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await client.get(`/diagnosis_logs/${id}`);
        setLog(response.data);
      } catch (error) {
        console.error("詳細の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  if (!log) return <div className="p-10 text-center">データが見つかりませんでした</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span>履歴一覧に戻る</span>
        </button>

        {/* --- 削除ボタン --- */}
        <button 
          onClick={handleDelete}
          className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors text-sm font-bold"
        >
          <Trash2 className="w-4 h-4" />
          削除する
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* ヘッダー部分 */}
        <div className="bg-orange-50 p-6 border-b border-orange-100">
          <p className="text-orange-600 text-sm font-bold mb-1">
            {new Date(log.created_at).toLocaleDateString()} の診断結果
          </p>
          <h2 className="text-2xl font-bold text-gray-800">診断詳細</h2>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. 過去の症状 */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3>選択していた症状</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {log.symptoms?.map((s: any) => (
                <span key={s.id} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </section>

          {/* 2. 提案された対応（薬） */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold">
              <Pill className="w-5 h-5 text-primary" />
              <h3>提案されたお薬</h3>
            </div>
            <div className="space-y-4">
              {log.drugs?.map((drug: any) => (
                <div key={drug.id} className="border border-gray-100 rounded-2xl p-4">
                  <div className="flex gap-4 items-start mb-4">
                    <div className="bg-gray-50 w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <Pill className="text-gray-400 w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{drug.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{drug.description}</p>
                    </div>
                  </div>
                  
                  {/* ▼ 追加：薬ごとのワンポイントアドバイス ▼ */}
                  {drug.pharmacist_advice && (
                    <div className="bg-orange-50/50 p-4 rounded-xl flex items-start gap-3 border border-orange-100">
                      <Lightbulb className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-primary block mb-1">薬剤師のワンポイント</span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {drug.pharmacist_advice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 古いデータ（カラム追加前の診断履歴）でエラーにならないよう、log.result_summary がある時だけ表示 */}
          {log.result_summary && (
            <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                <h3>薬剤師からのアドバイス</h3>
              </div>
              <div className="text-blue-900 text-sm leading-loose whitespace-pre-wrap">
                {log.result_summary}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default DiagnosisHistoryDetail; ```

## File: ./frontend/src/pages/Signup.tsx
 ```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      alert('パスワードが一致しません');
      return;
    }

    try {
      const response = await client.post('/auth/signup', { 
        user: {
          name, 
          email, 
          password,
          password_confirmation: passwordConfirmation 
        }
      });
      
      const authHeader = response.headers['authorization'] || response.headers['Authorization'];
      const token = authHeader ? authHeader.split(' ')[1] : null;

      const userData = response.data.data || response.data;

      if (token && userData) {
        login(token, userData); 
        navigate('/mypage');
      } else {
        const bodyToken = response.data.token;
        if (bodyToken && userData) {
          login(bodyToken, userData); 
          navigate('/mypage');
        } else {
          alert('登録に成功しました。ログインしてください。');
          navigate('/login');
        }
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data);
      const errorMessages = error.response?.data?.errors?.join('\n') || '登録に失敗しました。';
      alert(errorMessages);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">アカウント作成</h2>
        <p className="text-gray-500 mt-2">あなたにぴったりの対策を記録しましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">ニックネーム</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="飲み助"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="example@nomusup.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">パスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="8文字以上の英数字"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">パスワード（確認）</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="もう一度入力してください"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-4 mt-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
          登録して診断を始める
        </button>
      </form>

      <p className="text-center mt-8 text-gray-500">
        既にアカウントをお持ちの方は{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">ログイン</Link>
      </p>
    </div>
  );
};

export default Signup; ```

## File: ./frontend/src/pages/Home.tsx
 ```tsx
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, History, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col animate-fadeIn">
      {/* ヒーローセクション：一番目立つメインビジュアル */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          今日の一杯を、<br />
          <span className="text-primary">明日への活力に。</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          薬剤師監修のロジックで、あなたの今のコンディションに最適な二日酔い対策を提案します。
        </p>
        <Link 
          to="/timing" 
          className="inline-flex items-center gap-2 bg-primary text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          診断を始める
          <ChevronRight className="w-6 h-6" />
        </Link>
      </section>

      {/* 特徴セクション：アプリの強みを3つ紹介 */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">薬剤師監修</h3>
            <p className="text-sm text-gray-500">あなたの体質や症状に合わせ、医学的視点から最適な薬や成分を提案。</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">直感的な診断</h3>
            <p className="text-sm text-gray-500">「飲む前・中・後」を選ぶだけ。たった数問で今のあなたに最適なケアが判明。</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">履歴を保存</h3>
            <p className="text-sm text-gray-500">ログインすれば過去の診断履歴を保存。自分に合う対策がいつでも見返せる。</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; ```

## File: ./frontend/src/pages/Diagnosis.tsx
 ```tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Symptom } from '../types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Diagnosis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timing = searchParams.get('timing') || '0';

  // 状態（State）の定義
  const [symptoms, setSymptoms] = useState<Symptom[]>([]); // 症状リスト
  const [constitutions, setConstitutions] = useState<Symptom[]>([]); // 体質リスト
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // 選択されたID
  const [loading, setLoading] = useState(true);

  // 1. 画面表示時にRailsから質問を取得
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await client.get(`/symptoms?timing=${timing}`);
        setSymptoms(response.data.symptoms);
        setConstitutions(response.data.constitutions);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, [timing]);

  // チェックボックスの切り替え
  const toggleSymptom = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 2. 診断実行（Railsのcreateアクションへ送る）
  const handleSubmit = async () => {
    try {
      const response = await client.post('/diagnosis_logs/calculate', {
        symptom_ids: selectedIds,
        timing: parseInt(timing)
      });
      // 結果画面へ（取得した薬のデータを渡す）
      navigate('/result', { state: { result: response.data } });
    } catch (error) {
      alert("診断に失敗しました。症状を選択してください。");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-primary">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-8 text-center">当てはまるものを教えてください</h2>

      {/* 症状セクション */}
      <div className="mb-10">
        <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-700">
          <AlertCircle className="text-orange-400 w-5 h-5" /> 今の症状
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {symptoms.map(s => (
            <label key={s.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedIds.includes(s.id) ? 'border-primary bg-orange-50' : 'border-gray-100 bg-white'}`}>
              <input type="checkbox" className="hidden" onChange={() => toggleSymptom(s.id)} />
              <CheckCircle2 className={`w-6 h-6 mr-3 ${selectedIds.includes(s.id) ? 'text-primary' : 'text-gray-200'}`} />
              <span className="font-medium">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 体質セクション */}
<div className="mb-12">
  <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-700">
    <CheckCircle2 className="text-green-400 w-5 h-5" /> あなたの体質・傾向
  </h3>
  <div className="space-y-3">
    {constitutions.map(c => (
      <div 
        key={c.id} 
        onClick={() => toggleSymptom(c.id)}
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
      >
        <span className="font-medium text-gray-700">{c.name}</span>
        
        {/* トグルスイッチ本体 */}
        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${selectedIds.includes(c.id) ? 'bg-primary' : 'bg-gray-200'}`}>
          {/* スイッチの中の白い丸 */}
          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${selectedIds.includes(c.id) ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      </div>
    ))}
  </div>
</div>

      <button 
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 disabled:shadow-none transition-all"
      >
        診断結果を見る
      </button>
    </div>
  );
};

export default Diagnosis; ```

## File: ./frontend/src/pages/StaticPages.tsx
 ```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scale, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DisclaimerContent } from '../components/shared/DisclaimerContent';

const StaticPageLayout = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <Icon className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 利用規約 ---
export const TermsOfService = () => (
  <StaticPageLayout title="利用規約" icon={Scale}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">1. はじめに</h2>
      <p>Nomu-Sup（以下「本サービス」）の利用規約を定めます。利用者は本規約に同意したものとみなします。</p>
    </section>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">2. 禁止事項</h2>
      <p>本サービスの解析、不正アクセス、または他の利用者の迷惑となる行為を禁止します。</p>
    </section>
  </StaticPageLayout>
);

// --- プライバシーポリシー ---
export const PrivacyPolicy = () => (
  <StaticPageLayout title="プライバシーポリシー" icon={ShieldCheck}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">1. 個人情報の収集</h2>
      <p>本サービスでは、アカウント作成時にメールアドレスおよび氏名を収集します。</p>
    </section>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">2. 利用目的</h2>
      <p>収集した情報は、診断履歴の保存および本人確認のためにのみ利用します。</p>
    </section>
  </StaticPageLayout>
);

// --- 免責事項 ---
// 【修正】直書きしていた<section>を消して、<DisclaimerContent />に置き換えます
export const Disclaimer = () => (
  <StaticPageLayout title="免責事項" icon={AlertTriangle}>
    <DisclaimerContent />
  </StaticPageLayout>
); ```

## File: ./frontend/src/pages/Result.tsx
 ```tsx
import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import type { Drug } from '../types';
import { Sparkles, ShoppingCart, RefreshCcw, Info, Save, Lightbulb, MessageCircle } from 'lucide-react'; // 👈 MessageCircleを追加

// Railsからの返り値の型
interface DiagnosisResponse {
  status: string;
  suggested_drugs: Drug[];
  symptom_ids: string[];
  timing: number;
  result_summary: string; 
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  
  const data = location.state?.result as DiagnosisResponse;

  const handleSaveResult = async () => {
    if (!isLoggedIn) {
      if (window.confirm('診断結果を保存するには会員登録が必要です。登録画面へ移動しますか？')) {
        navigate('/signup');
      }
      return;
    }

    try {
      const drugIds = data.suggested_drugs.map(d => d.id);

      await client.post('/diagnosis_logs', {
        timing: data.timing,
        symptom_ids: data.symptom_ids,
        drug_ids: drugIds,
        result_summary: data.result_summary
      });
      
      setIsSaved(true);
      alert('診断履歴に保存しました！マイページからいつでも確認できます。');
    } catch (error) {
      console.error("保存エラー:", error);
      alert('保存に失敗しました。既に保存されているか、通信エラーの可能性があります。');
    }
  };

  if (!data) return (
    <div className="text-center py-20">
      <p className="mb-4">結果が見つかりませんでした。</p>
      <Link to="/" className="text-primary underline">トップへ戻る</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-3 rounded-full mb-4">
          <Sparkles className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold mb-2">あなたへの処方箋</h2>
        <p className="text-gray-500">ソムリエが最適な対策をセレクトしました</p>
      </div>

      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-blue-800 font-bold">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <h3>薬剤師からのアドバイス</h3>
        </div>
        <div className="text-blue-900 text-sm leading-loose whitespace-pre-wrap">
          {data.result_summary}
        </div>
      </div>

      <div className="space-y-6">
        {data.suggested_drugs.map((drug, index) => (
          <div 
            key={drug.id} 
            className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-sm ${index === 0 ? 'border-primary ring-4 ring-orange-50' : 'border-gray-100'}`}
          >
            {index === 0 && (
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                BEST MATCH
              </span>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{drug.name}</h3>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-500 rounded mt-1 inline-block">
                  {String(drug.category) === 'medicine' ? 'ドラッグストア等' : 'コンビニ等'}
                </span>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <Info className="text-primary w-5 h-5" />
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {drug.description}
            </p>

            {drug.pharmacist_advice && (
              <div className="bg-orange-50/50 p-4 rounded-xl mb-6 flex items-start gap-3 border border-orange-100">
                <Lightbulb className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-primary block mb-1">薬剤師のワンポイント</span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {drug.pharmacist_advice}
                  </p>
                </div>
              </div>
            )}

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
              <ShoppingCart className="w-5 h-5" />
              詳細・購入を検討
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-orange-50 rounded-3xl border border-orange-100 text-center">
        <h4 className="font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
          <Save className="w-5 h-5 text-primary" />
          結果を記録に残しませんか？
        </h4>
        <p className="text-sm text-gray-600 mb-5">
          保存すると、過去のコンディションと対策をいつでもマイページから振り返ることができます。
        </p>
        <button
          onClick={handleSaveResult}
          disabled={isSaved} // 保存済みならボタンを無効化
          className={`w-full py-4 bg-white border-2 rounded-full font-bold transition-all shadow-sm flex justify-center items-center gap-2
            ${isSaved 
              ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50' 
              : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
        >
          {isSaved ? '保存済み' : (isLoggedIn ? '診断結果を保存する' : '会員登録して結果を保存')}
        </button>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <Link 
          to="/timing" 
          className="flex items-center justify-center gap-2 text-gray-600 font-bold py-4 hover:text-primary transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          もう一度診断する
        </Link>
        <Link 
          to="/" 
          className="bg-white border-2 border-gray-200 text-center py-4 rounded-full font-bold hover:border-primary transition-all"
        >
          トップに戻る
        </Link>
      </div>
    </div>
  );
};

export default Result; ```

## File: ./frontend/src/pages/DiagnosisHistory.tsx
 ```tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ChevronLeft, Calendar, ChevronRight, Clock, Loader2 } from 'lucide-react';

const DiagnosisHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await client.get('/diagnosis_logs');
        setLogs(response.data);
      } catch (error) {
        console.error("履歴の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

// 飲酒タイミングの表示をテキストに変換（Railsのenumの文字列にも対応）
  const getTimingText = (timing: string | number) => {
    if (timing === 0 || timing === 'before_drinking') return 'これから飲む';
    if (timing === 1 || timing === 'during_drinking') return '飲みすぎた';
    if (timing === 2 || timing === 'after_drinking') return '翌朝がつらい';
    
    return '不明';
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-primary">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <button onClick={() => navigate('/mypage')} className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>マイページに戻る</span>
      </button>

      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <Calendar className="text-primary" />
        診断履歴一覧
      </h2>

      {logs.length === 0 ? (
        <div className="bg-gray-50 rounded-3xl p-10 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500">まだ診断履歴がありません。</p>
          <Link to="/timing" className="inline-block mt-4 text-primary font-bold">
            診断をはじめる →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log: any) => (
            <Link 
              key={log.id} 
              to={`/diagnosis/history/${log.id}`}
              className="block bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:border-primary transition-all group no-underline"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(log.created_at).toLocaleString('ja-JP')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-md font-bold">
                      {getTimingText(log.timing)}
                    </span>
                    <span className="font-bold text-gray-800">
                      {log.symptoms?.length || 0} 件の症状
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagnosisHistory; ```

## File: ./frontend/src/pages/UserEdit.tsx
 ```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save } from 'lucide-react';

const UserEdit = () => {
  const { user, login } = useAuth(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // 画面を開いた時に現在のユーザー情報をセット
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.patch('/me', {
        user: { name, email }
      });

      // AuthContext の情報を新しいデータで上書きする
      const token = localStorage.getItem('token');
      if (token) {
        login(token, response.data.user); 
      }
      
      alert('プロフィールを更新しました！');
      navigate('/mypage');
    } catch (error: any) {
      alert('更新に失敗しました。');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-6 text-center">プロフィール編集</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">名前</label>
          <div className="relative">
            <User className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-full font-bold flex justify-center items-center gap-2">
          <Save className="w-5 h-5" />
          更新する
        </button>
      </form>
    </div>
  );
};

export default UserEdit; ```

## File: ./frontend/src/pages/Timing.tsx
 ```tsx
import { useNavigate } from 'react-router-dom';
import { GlassWater, Beer, Coffee, ChevronRight } from 'lucide-react';

const Timing = () => {
  const navigate = useNavigate();

  const options = [
    { id: 0, label: 'これから飲む！', icon: <GlassWater />, description: '事前の準備で明日の自分を救おう' },
    { id: 1, label: '飲みすぎたかも...', icon: <Beer />, description: '今のうちにできるケアを提案' },
    { id: 2, label: '翌朝がつらい', icon: <Coffee />, description: '二日酔いの症状を緩和したい' },
  ];

  const handleSelect = (id: number) => {
    navigate(`/diagnosis?timing=${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center mb-2">今の状態は？</h2>
      <p className="text-center text-gray-500 mb-10">状況に合わせて最適なアドバイスを行います</p>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className="w-full flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl text-left hover:border-primary hover:bg-orange-50 transition-all group"
          >
            <div className="bg-orange-100 text-primary p-4 rounded-xl mr-6 group-hover:bg-primary group-hover:text-white transition-colors">
              {option.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timing; ```

## File: ./frontend/src/pages/ResetPassword.tsx
 ```tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import client from '../api/client';
import { Lock, Save } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // URLの「?reset_password_token=xxx」の部分を取得するための機能
  const [searchParams] = useSearchParams();
  const token = searchParams.get('reset_password_token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      alert('パスワードが一致しません');
      return;
    }

    setIsSubmitting(true);

    try {
      // Railsのパスワード更新アクション (PUT) へ送信
      await client.put('/auth/password', {
        user: {
          reset_password_token: token,
          password: password,
          password_confirmation: passwordConfirmation
        }
      });
      
      alert('パスワードの再設定が完了しました！新しいパスワードでログインしてください。');
      navigate('/login');
    } catch (error: any) {
      console.error("パスワードリセットエラー:", error.response?.data);
      alert('再設定に失敗しました。URLの有効期限が切れているか、無効なリンクの可能性があります。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // トークンがないURLで直接アクセスされた場合の弾き処理
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 px-6 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">不正なアクセスです</h2>
        <p className="text-gray-600">パスワード再設定URLが正しくありません。</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16 px-6 animate-fadeIn">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2">新しいパスワード</h2>
        <p className="text-gray-500 text-sm">
          8文字以上の新しいパスワードを設定してください。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上の英数字"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">新しいパスワード（確認用）</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="もう一度入力してください"
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
          {isSubmitting ? '更新中...' : (
            <>
              <Save className="w-5 h-5" />
              パスワードを更新する
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword; ```

## File: ./frontend/src/pages/Login.tsx
 ```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await client.post('/auth/login', { 
        user: { email, password } 
      });

      // Railsからのレスポンス構造に合わせてデータを取り出す
      const token = response.data.token;
      const userData = response.data.data; 

      if (token && userData) {
        login(token, userData); 
        
        console.log("ログイン成功！ユーザー名:", userData.name);
        navigate('/mypage');
      } else {
        console.error("データが不足しています", response.data);
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data);
      alert('ログインに失敗しました。');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold">おかえりなさい！</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-4 rounded-full font-bold">
          ログイン
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/forgot-password" className="text-sm text-primary font-bold hover:underline">
          パスワードを忘れた方はこちら
        </Link>
      </div>
    </div>
  );
};

export default Login; ```

## File: ./frontend/src/pages/ForgotPassword.tsx
 ```tsx
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

export default ForgotPassword; ```

## File: ./frontend/src/pages/MyPage.tsx
 ```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { User, History, ChevronRight, LogOut, Loader2, Settings } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
}

const MyPage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.get('/me');
        setUser(response.data);
      } catch (error) {
        console.error("ユーザー情報の取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-primary">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fadeIn">
      {/* ユーザープロフィール部分 */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-primary w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user?.name || 'ゲスト'} さん</h2>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>

      {/* メニューリスト */}
      <div className="space-y-4">
        {/* 診断履歴を見る */}
        <Link 
          to="/diagnosis/history" 
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all group no-underline"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-orange-50 transition-colors">
              <History className="text-gray-600 group-hover:text-primary w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">診断履歴を見る</span>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-primary" />
        </Link>

        {/* プロフィールを編集する */}
        <Link 
          to="/mypage/edit" 
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all group no-underline"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-orange-50 transition-colors">
              <Settings className="text-gray-600 group-hover:text-primary w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">プロフィールを編集する</span>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-primary" />
        </Link>

        {/* ログアウト */}
        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-red-100 transition-colors">
              <LogOut className="text-gray-600 group-hover:text-red-500 w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700 group-hover:text-red-500">ログアウト</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MyPage; ```

## File: ./frontend/src/App.tsx
 ```tsx
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
     </AuthProvider> 
  );
};

export default App; ```

## File: ./frontend/src/types/index.ts
 ```ts
// ユーザーの型
export interface User {
  id: string;
  email: string;
  name?: string; 
}

// 症状の型：Railsの Symptom モデルに対応
export interface Symptom {
  id: string;
  name: string;
  timing: number;   // 0:前, 1:中, 2:後
  category: number; // 0:症状, 1:体質
}

// 薬の型：Railsの Drug モデルに対応
export interface Drug {
  id: string;
  name: string;
  category: number;    // 0:DS(医薬品), 1:コンビニ(食品)
  timing: number;
  description: string;
  pharmacist_advice?: string;
}

// 診断履歴の型：診断結果画面やマイページの一覧で使う
export interface DiagnosisLog {
  id: string;
  user_id?: string;
  timing: number;
  created_at: string;
  symptoms: Symptom[]; // 選んだ症状のリスト
  drugs: Drug[];       // 提案された薬のリスト
} ```

## File: ./frontend/src/index.css
 ```css
@import "tailwindcss";

@theme {
  --color-primary: #FF8C00;
} ```

## File: ./config/initializers/inflections.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, "\\1en"
#   inflect.singular /^(ox)en/i, "\\1"
#   inflect.irregular "person", "people"
#   inflect.uncountable %w( fish sheep )
# end

# These inflection rules are supported but not enabled by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.acronym "RESTful"
# end
 ```

## File: ./config/initializers/devise.rb
 ```rb
# frozen_string_literal: true

# Assuming you have not yet modified this file, each configuration option below
# is set to its default value. Note that some are commented out while others
# are not: uncommented lines are intended to protect your configuration from
# breaking changes in upgrades (i.e., in the event that future versions of
# Devise change the default values for those options).
#
# Use this hook to configure devise mailer, warden hooks and so forth.
# Many of these configuration options can be set straight in your model.
Devise.setup do |config|
  config.jwt do |jwt|
    jwt.secret = '987ba70954a4ef34eff93e1318e3008619de5baed83a2b2cb9344c0292bac05290a79f55276b66b54dd3a72f58b8eef546b1799665363e0e48dcc80a4638a33c'
    
    # ログイン・ログアウトのURLパターン
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth/logout$}]
    ]
    
    # 有効期限（1日）
    jwt.expiration_time = 1.day.to_i
  end
  # The secret key used by Devise. Devise uses this key to generate
  # random tokens. Changing this key will render invalid all existing
  # confirmation, reset password and unlock tokens in the database.
  # Devise will use the `secret_key_base` as its `secret_key`
  # by default. You can change it below and use your own secret key.
  # config.secret_key = '177d3b8dae307509b4b3a5e93e1fdad907b6714387ef8b38738dc310989b74c08ab22e4d3eec85359c79b4e803adac02cf6e42443595c892cdc92644ee7625c8'

  # ==> Controller configuration
  # Configure the parent class to the devise controllers.
  # config.parent_controller = 'DeviseController'

  # ==> Mailer Configuration
  # Configure the e-mail address which will be shown in Devise::Mailer,
  # note that it will be overwritten if you use your own mailer class
  # with default "from" parameter.
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  # Configure the class responsible to send e-mails.
  # config.mailer = 'Devise::Mailer'

  # Configure the parent class responsible to send e-mails.
  # config.parent_mailer = 'ActionMailer::Base'

  # ==> ORM configuration
  # Load and configure the ORM. Supports :active_record (default) and
  # :mongoid (bson_ext recommended) by default. Other ORMs may be
  # available as additional gems.
  require 'devise/orm/active_record'

  # ==> Configuration for any authentication mechanism
  # Configure which keys are used when authenticating a user. The default is
  # just :email. You can configure it to use [:username, :subdomain], so for
  # authenticating a user, both parameters are required. Remember that those
  # parameters are used only when authenticating and not when retrieving from
  # session. If you need permissions, you should implement that in a before filter.
  # You can also supply a hash where the value is a boolean determining whether
  # or not authentication should be aborted when the value is not present.
  # config.authentication_keys = [:email]

  # Configure parameters from the request object used for authentication. Each entry
  # given should be a request method and it will automatically be passed to the
  # find_for_authentication method and considered in your model lookup. For instance,
  # if you set :request_keys to [:subdomain], :subdomain will be used on authentication.
  # The same considerations mentioned for authentication_keys also apply to request_keys.
  # config.request_keys = []

  # Configure which authentication keys should be case-insensitive.
  # These keys will be downcased upon creating or modifying a user and when used
  # to authenticate or find a user. Default is :email.
  config.case_insensitive_keys = [:email]

  # Configure which authentication keys should have whitespace stripped.
  # These keys will have whitespace before and after removed upon creating or
  # modifying a user and when used to authenticate or find a user. Default is :email.
  config.strip_whitespace_keys = [:email]

  # Tell if authentication through request.params is enabled. True by default.
  # It can be set to an array that will enable params authentication only for the
  # given strategies, for example, `config.params_authenticatable = [:database]` will
  # enable it only for database (email + password) authentication.
  # config.params_authenticatable = true

  # Tell if authentication through HTTP Auth is enabled. False by default.
  # It can be set to an array that will enable http authentication only for the
  # given strategies, for example, `config.http_authenticatable = [:database]` will
  # enable it only for database authentication.
  # For API-only applications to support authentication "out-of-the-box", you will likely want to
  # enable this with :database unless you are using a custom strategy.
  # The supported strategies are:
  # :database      = Support basic authentication with authentication key + password
  # config.http_authenticatable = false

  # If 401 status code should be returned for AJAX requests. True by default.
  # config.http_authenticatable_on_xhr = true

  # The realm used in Http Basic Authentication. 'Application' by default.
  # config.http_authentication_realm = 'Application'

  # It will change confirmation, password recovery and other workflows
  # to behave the same regardless if the e-mail provided was right or wrong.
  # Does not affect registerable.
  # config.paranoid = true

  # By default Devise will store the user in session. You can skip storage for
  # particular strategies by setting this option.
  # Notice that if you are skipping storage for all authentication paths, you
  # may want to disable generating routes to Devise's sessions controller by
  # passing skip: :sessions to `devise_for` in your config/routes.rb
  config.skip_session_storage = [:http_auth, :params_auth]

  # By default, Devise cleans up the CSRF token on authentication to
  # avoid CSRF token fixation attacks. This means that, when using AJAX
  # requests for sign in and sign up, you need to get a new CSRF token
  # from the server. You can disable this option at your own risk.
  # config.clean_up_csrf_token_on_authentication = true

  # When false, Devise will not attempt to reload routes on eager load.
  # This can reduce the time taken to boot the app but if your application
  # requires the Devise mappings to be loaded during boot time the application
  # won't boot properly.
  # config.reload_routes = true

  # ==> Configuration for :database_authenticatable
  # For bcrypt, this is the cost for hashing the password and defaults to 12. If
  # using other algorithms, it sets how many times you want the password to be hashed.
  # The number of stretches used for generating the hashed password are stored
  # with the hashed password. This allows you to change the stretches without
  # invalidating existing passwords.
  #
  # Limiting the stretches to just one in testing will increase the performance of
  # your test suite dramatically. However, it is STRONGLY RECOMMENDED to not use
  # a value less than 10 in other environments. Note that, for bcrypt (the default
  # algorithm), the cost increases exponentially with the number of stretches (e.g.
  # a value of 20 is already extremely slow: approx. 60 seconds for 1 calculation).
  config.stretches = Rails.env.test? ? 1 : 12

  # Set up a pepper to generate the hashed password.
  # config.pepper = '52b64ad050cdea612e0447198e6adcb1b2d75e3eb74da3e5d2d2bb5774944913b96d8da5ce6e19b47ad9b60f90a759fabb250dd8803c2e5d48042c3ff5922446'

  # Send a notification to the original email when the user's email is changed.
  # config.send_email_changed_notification = false

  # Send a notification email when the user's password is changed.
  # config.send_password_change_notification = false

  # ==> Configuration for :confirmable
  # A period that the user is allowed to access the website even without
  # confirming their account. For instance, if set to 2.days, the user will be
  # able to access the website for two days without confirming their account,
  # access will be blocked just in the third day.
  # You can also set it to nil, which will allow the user to access the website
  # without confirming their account.
  # Default is 0.days, meaning the user cannot access the website without
  # confirming their account.
  # config.allow_unconfirmed_access_for = 2.days

  # A period that the user is allowed to confirm their account before their
  # token becomes invalid. For example, if set to 3.days, the user can confirm
  # their account within 3 days after the mail was sent, but on the fourth day
  # their account can't be confirmed with the token any more.
  # Default is nil, meaning there is no restriction on how long a user can take
  # before confirming their account.
  # config.confirm_within = 3.days

  # If true, requires any email changes to be confirmed (exactly the same way as
  # initial account confirmation) to be applied. Requires additional unconfirmed_email
  # db field (see migrations). Until confirmed, new email is stored in
  # unconfirmed_email column, and copied to email column on successful confirmation.
  # Also, when used in conjunction with `send_email_changed_notification`,
  # the notification is sent to the original email when the change is requested,
  # not when the unconfirmed email is confirmed.
  config.reconfirmable = true

  # Defines which key will be used when confirming an account
  # config.confirmation_keys = [:email]

  # ==> Configuration for :rememberable
  # The time the user will be remembered without asking for credentials again.
  # config.remember_for = 2.weeks

  # Invalidates all the remember me tokens when the user signs out.
  config.expire_all_remember_me_on_sign_out = true

  # If true, extends the user's remember period when remembered via cookie.
  # config.extend_remember_period = false

  # Options to be passed to the created cookie. For instance, you can set
  # secure: true in order to force SSL only cookies.
  # config.rememberable_options = {}

  # ==> Configuration for :validatable
  # Range for password length.
  config.password_length = 6..128

  # Email regex used to validate email formats. It simply asserts that
  # one (and only one) @ exists in the given string. This is mainly
  # to give user feedback and not to assert the e-mail validity.
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # ==> Configuration for :timeoutable
  # The time you want to timeout the user session without activity. After this
  # time the user will be asked for credentials again. Default is 30 minutes.
  # config.timeout_in = 30.minutes

  # ==> Configuration for :lockable
  # Defines which strategy will be used to lock an account.
  # :failed_attempts = Locks an account after a number of failed attempts to sign in.
  # :none            = No lock strategy. You should handle locking by yourself.
  # config.lock_strategy = :failed_attempts

  # Defines which key will be used when locking and unlocking an account
  # config.unlock_keys = [:email]

  # Defines which strategy will be used to unlock an account.
  # :email = Sends an unlock link to the user email
  # :time  = Re-enables login after a certain amount of time (see :unlock_in below)
  # :both  = Enables both strategies
  # :none  = No unlock strategy. You should handle unlocking by yourself.
  # config.unlock_strategy = :both

  # Number of authentication tries before locking an account if lock_strategy
  # is failed attempts.
  # config.maximum_attempts = 20

  # Time interval to unlock the account if :time is enabled as unlock_strategy.
  # config.unlock_in = 1.hour

  # Warn on the last attempt before the account is locked.
  # config.last_attempt_warning = true

  # ==> Configuration for :recoverable
  #
  # Defines which key will be used when recovering the password for an account
  # config.reset_password_keys = [:email]

  # Time interval you can reset your password with a reset password key.
  # Don't put a too small interval or your users won't have the time to
  # change their passwords.
  config.reset_password_within = 6.hours

  # When set to false, does not sign a user in automatically after their password is
  # reset. Defaults to true, so a user is signed in automatically after a reset.
  # config.sign_in_after_reset_password = true

  # ==> Configuration for :encryptable
  # Allow you to use another hashing or encryption algorithm besides bcrypt (default).
  # You can use :sha1, :sha512 or algorithms from others authentication tools as
  # :clearance_sha1, :authlogic_sha512 (then you should set stretches above to 20
  # for default behavior) and :restful_authentication_sha1 (then you should set
  # stretches to 10, and copy REST_AUTH_SITE_KEY to pepper).
  #
  # Require the `devise-encryptable` gem when using anything other than bcrypt
  # config.encryptor = :sha512

  # ==> Scopes configuration
  # Turn scoped views on. Before rendering "sessions/new", it will first check for
  # "users/sessions/new". It's turned off by default because it's slower if you
  # are using only default views.
  # config.scoped_views = false

  # Configure the default scope given to Warden. By default it's the first
  # devise role declared in your routes (usually :user).
  # config.default_scope = :user

  # Set this configuration to false if you want /users/sign_out to sign out
  # only the current scope. By default, Devise signs out all scopes.
  # config.sign_out_all_scopes = true

  # ==> Navigation configuration
  # Lists the formats that should be treated as navigational. Formats like
  # :html should redirect to the sign in page when the user does not have
  # access, but formats like :xml or :json, should return 401.
  #
  # If you have any extra navigational formats, like :iphone or :mobile, you
  # should add them to the navigational formats lists.
  #
  # The "*/*" below is required to match Internet Explorer requests.
  # config.navigational_formats = ['*/*', :html, :turbo_stream]

  # The default HTTP method used to sign out a resource. Default is :delete.
  config.sign_out_via = :delete

  # ==> OmniAuth
  # Add a new OmniAuth provider. Check the wiki for more information on setting
  # up on your models and hooks.
  # config.omniauth :github, 'APP_ID', 'APP_SECRET', scope: 'user,public_repo'

  # ==> Warden configuration
  # If you want to use other strategies, that are not supported by Devise, or
  # change the failure app, you can configure them inside the config.warden block.
  #
  # config.warden do |warden_config|
  #   warden_config.intercept_401 = false
  #   warden_config.default_strategies(scope: :user).unshift :some_external_strategy
  # end

  # ==> Mountable engine configurations
  # When using Devise inside an engine, let's call it `MyEngine`, and this engine
  # is mountable, there are some extra configurations to be taken into account.
  # The following options are available, assuming the engine is mounted as:
  #
  #     mount MyEngine, at: '/my_engine'
  #
  # The router that invoked `devise_for`, in the example above, would be:
  # config.router_name = :my_engine
  #
  # When using OmniAuth, Devise cannot automatically set OmniAuth path,
  # so you need to do it manually. For the users scope, it would be:
  # config.omniauth_path_prefix = '/my_engine/users/auth'

  # ==> Hotwire/Turbo configuration
  # When using Devise with Hotwire/Turbo, the http status for error responses
  # and some redirects must match the following. The default in Devise for existing
  # apps is `200 OK` and `302 Found` respectively, but new apps are generated with
  # these new defaults that match Hotwire/Turbo behavior.
  # Note: These might become the new default in future versions of Devise.
  config.responder.error_status = :unprocessable_content
  config.responder.redirect_status = :see_other
  config.navigational_formats = []

  # ==> Configuration for :registerable

  # When set to false, does not sign a user in automatically after their password is
  # changed. Defaults to true, so a user is signed in automatically after changing a password.
  # config.sign_in_after_change_password = true
end
 ```

## File: ./config/initializers/cors.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # VercelのURL、または開発用のlocalhostからのアクセスを許可
    origins "localhost:5173", "https://nomu-sup-frontend.vercel.app"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
 ```

## File: ./config/initializers/filter_parameter_logging.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Configure parameters to be partially matched (e.g. passw matches password) and filtered from the log file.
# Use this to limit dissemination of sensitive information.
# See the ActiveSupport::ParameterFilter documentation for supported notations and behaviors.
Rails.application.config.filter_parameters += [
  :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn
]
 ```

## File: ./config/puma.rb
 ```rb
# This configuration file will be evaluated by Puma. The top-level methods that
# are invoked here are part of Puma's configuration DSL. For more information
# about methods provided by the DSL, see https://puma.io/puma/Puma/DSL.html.

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

rails_env = ENV.fetch("RAILS_ENV") { "development" }

if rails_env == "production"
  # If you are running more than 1 thread per process, the workers count
  # should be equal to the number of processors (CPU cores) in production.
  #
  # It defaults to 1 because it's impossible to reliably detect how many
  # CPU cores are available. Make sure to set the `WEB_CONCURRENCY` environment
  # variable to match the number of processors.
  worker_count = Integer(ENV.fetch("WEB_CONCURRENCY") { 1 })
  if worker_count > 1
    workers worker_count
  else
    preload_app!
  end
end
# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
port ENV.fetch("PORT") { 3000 }

# Specifies the `environment` that Puma will run in.
environment rails_env

# Specifies the `pidfile` that Puma will use.
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart
 ```

## File: ./config/routes.rb
 ```rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health_check', to: 'health_check#index'
      resources :symptoms, only: [:index]
      resources :diagnosis_logs, only: [:index, :show, :create, :destroy] do
        collection do
          post :calculate # 診断のみ（DB保存しない）
        end
      end
      get 'me', to: 'users#show'
      patch 'me', to: 'users#update'

      # DeviseのルートをAPIのパス配下に設定
      devise_for :users, skip: [:sessions, :registrations, :passwords], controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations'
      }

      # パスを /api/v1/auth/signup などに明示的にマッピング
      devise_scope :api_v1_user do
        post 'auth/signup', to: 'auth/registrations#create'
        post 'auth/login', to: 'auth/sessions#create'
        delete 'auth/logout', to: 'auth/sessions#destroy'
        post 'auth/password', to: 'auth/passwords#create' # メール送信依頼用
        put 'auth/password', to: 'auth/passwords#update'  # 新パスワード設定用
      end
    end
  end
end ```

## File: ./config/environments/development.rb
 ```rb
require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Highlight code that enqueued background job in logs.
  config.active_job.verbose_enqueue_logs = true


  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true

  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
end
 ```

## File: ./config/environments/test.rb
 ```rb
require "active_support/core_ext/integer/time"

# The test environment is used exclusively to run your application's
# test suite. You never need to work with it otherwise. Remember that
# your test database is "scratch space" for the test suite and is wiped
# and recreated between test runs. Don't rely on the data there!

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # While tests run files are not watched, reloading is not necessary.
  config.enable_reloading = false

  # Eager loading loads your entire application. When running a single test locally,
  # this is usually not necessary, and can slow down your test suite. However, it's
  # recommended that you enable it in continuous integration systems to ensure eager
  # loading is working properly before deploying your code.
  config.eager_load = ENV["CI"].present?

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.hour.to_i}"
  }

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  # Render exception templates for rescuable exceptions and raise for other exceptions.
  config.action_dispatch.show_exceptions = :rescuable

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  # Store uploaded files on the local file system in a temporary directory.
  config.active_storage.service = :test

  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test

  # Print deprecation notices to the stderr.
  config.active_support.deprecation = :stderr

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true
end
 ```

## File: ./config/environments/production.rb
 ```rb
require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local = false

  # Ensures that a master key has been made available in ENV["RAILS_MASTER_KEY"], config/master.key, or an environment
  # key such as config/credentials/production.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Disable serving static files from `public/`, relying on NGINX/Apache to do so instead.
  # config.public_file_server.enabled = false

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for Apache
  # config.action_dispatch.x_sendfile_header = "X-Accel-Redirect" # for NGINX

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Mount Action Cable outside main process or domain.
  # config.action_cable.mount_path = nil
  # config.action_cable.url = "wss://example.com/cable"
  # config.action_cable.allowed_request_origins = [ "http://example.com", /http:\/\/example.*/ ]

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Can be used together with config.force_ssl for Strict-Transport-Security and secure cookies.
  # config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Log to STDOUT by default
  config.logger = ActiveSupport::Logger.new(STDOUT)
    .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
    .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  # Prepend all log lines with the following tags.
  config.log_tags = [ :request_id ]

  # "info" includes generic and useful information about system operation, but avoids logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII). If you
  # want to log everything, set the level to "debug".
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # config.active_job.queue_adapter = :resque
  # config.active_job.queue_name_prefix = "app_production"

  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end
 ```

## File: ./config/application.rb
 ```rb
require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end
  end
end
 ```

## File: ./config/environment.rb
 ```rb
# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!
 ```

## File: ./config/boot.rb
 ```rb
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
 ```

## File: ./Gemfile
 ```/Gemfile
source "https://rubygems.org"

ruby "3.3.0"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.6"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# gem "jbuilder"

# Use Redis adapter to run Action Cable in production
# gem "redis", ">= 4.0.1"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin Ajax possible
# gem "rack-cors"

gem "rack-cors"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ]
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

gem 'devise'

gem 'devise-jwt'
 ```

## File: ./app/models/diagnosis_log.rb
 ```rb
class DiagnosisLog < ApplicationRecord
  belongs_to :user, optional: true # ログインなしでも診断できる場合は optional: true
  has_many :diagnosis_log_symptoms, dependent: :destroy
  has_many :symptoms, through: :diagnosis_log_symptoms

  has_many :diagnosis_log_drugs, dependent: :destroy
  has_many :drugs, through: :diagnosis_log_drugs

  enum timing: { before_drinking: 0, during_drinking: 1, after_drinking: 2 }
end
 ```

## File: ./app/models/symptom.rb
 ```rb
class Symptom < ApplicationRecord
  has_many :diagnosis_log_symptoms
  has_many :diagnosis_logs, through: :diagnosis_log_symptoms

  has_many :drug_symptoms, dependent: :destroy
  has_many :drugs, through: :drug_symptoms
end
 ```

## File: ./app/models/ingredient.rb
 ```rb
class Ingredient < ApplicationRecord
  has_many :drug_ingredients, dependent: :destroy
  has_many :drugs, through: :drug_ingredients
end
 ```

## File: ./app/models/drug.rb
 ```rb
class Drug < ApplicationRecord
  has_many :diagnosis_log_drugs
  has_many :diagnosis_logs, through: :diagnosis_log_drugs

  has_many :drug_ingredients, dependent: :destroy
  has_many :ingredients, through: :drug_ingredients

  has_many :drug_symptoms, dependent: :destroy
  has_many :symptoms, through: :drug_symptoms

  enum category: { medicine: 0, food: 1 }
  enum timing: { before: 0, during: 1, after: 2, any: 3 }
end
 ```

## File: ./app/models/application_record.rb
 ```rb
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
 ```

## File: ./app/models/drug_ingredient.rb
 ```rb
class DrugIngredient < ApplicationRecord
  belongs_to :drug
  belongs_to :ingredient
end
 ```

## File: ./app/models/diagnosis_log_symptom.rb
 ```rb
class DiagnosisLogSymptom < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :symptom
end
 ```

## File: ./app/models/drug_symptom.rb
 ```rb
class DrugSymptom < ApplicationRecord
  belongs_to :drug
  belongs_to :symptom
end
 ```

## File: ./app/models/diagnosis_log_drug.rb
 ```rb
class DiagnosisLogDrug < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :drug
end
 ```

## File: ./app/models/user.rb
 ```rb
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
         
  has_many :diagnosis_logs, dependent: :destroy

  def self.jwt_revocation_strategy
    self
  end
end
 ```

## File: ./app/channels/application_cable/connection.rb
 ```rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
  end
end
 ```

## File: ./app/channels/application_cable/channel.rb
 ```rb
module ApplicationCable
  class Channel < ActionCable::Channel::Base
  end
end
 ```

## File: ./app/jobs/application_job.rb
 ```rb
class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that encountered a deadlock
  # retry_on ActiveRecord::Deadlocked

  # Most jobs are safe to ignore if the underlying records are no longer available
  # discard_on ActiveJob::DeserializationError
end
 ```

## File: ./app/mailers/application_mailer.rb
 ```rb
class ApplicationMailer < ActionMailer::Base
  default from: "from@example.com"
  layout "mailer"
end
 ```

## File: ./app/controllers/api/v1/health_check_controller.rb
 ```rb
class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "Rails APIとの接続に成功しました！" }, status: :ok
  end
end
 ```

## File: ./app/controllers/api/v1/users_controller.rb
 ```rb
class Api::V1::UsersController < ApplicationController
  def show
    if current_user
      render json: { id: current_user.id, name: current_user.name, email: current_user.email }, status: :ok
    else
      render json: { error: "ユーザーが見つかりません" }, status: :unauthorized
    end
  end

  def update
    if current_user&.update(user_params)
      render json: { message: 'プロフィールを更新しました', user: current_user }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
 ```

## File: ./app/controllers/api/v1/diagnosis_logs_controller.rb
 ```rb
class Api::V1::DiagnosisLogsController < ApplicationController
  # 【修正】自作の認証メソッドを使用するように変更
  before_action :ensure_logged_in, only: [:index, :show, :create, :destroy]

  def index
    @logs = current_user.diagnosis_logs
                        .includes(:symptoms, :drugs)
                        .order(created_at: :desc)

    render json: @logs.as_json(
      include: {
        symptoms: { only: [:id, :name] },
        drugs: { only: [:id, :name, :description, :pharmacist_advice] }
      }
    ), status: :ok
  end
  
  def calculate
    symptom_ids = params[:symptom_ids] || []
    timing = params[:timing]

    service = DiagnosisService.new(symptom_ids, timing)
    result = service.execute # { drugs: [...], summary: "..." } が返ってくる

    render json: {
      status: 'success',
      suggested_drugs: result[:drugs],
      result_summary: result[:summary], 
      symptom_ids: symptom_ids,
      timing: timing
    }, status: :ok
  end

  def create
    symptom_ids = params[:symptom_ids]
    timing = params[:timing]
    drug_ids = params[:drug_ids]
    result_summary = params[:result_summary] 

    diagnosis_log = current_user.diagnosis_logs.build(
      timing: timing,
      result_summary: result_summary 
    )

    if diagnosis_log.save
      diagnosis_log.symptom_ids = symptom_ids
      diagnosis_log.drug_ids = drug_ids

      render json: {
        status: 'success',
        diagnosis_log_id: diagnosis_log.id
      }, status: :created
    else
      render json: { status: 'error', message: diagnosis_log.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    @log = current_user.diagnosis_logs
                       .includes(:symptoms, :drugs)
                       .find(params[:id])

    render json: @log.as_json(
      include: {
        symptoms: { only: [:id, :name, :category] },
        drugs: { only: [:id, :name, :description, :pharmacist_advice ] } # 薬にcategoryがない場合は消しておきます
      }
    ), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: '履歴が見つかりませんでした' }, status: :not_found
  end

  def destroy
    @log = current_user.diagnosis_logs.find(params[:id])
    if @log.destroy
      render json: { message: '履歴を削除しました' }, status: :ok
    else
      render json: { error: '削除に失敗しました' }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: '履歴が見つかりませんでした' }, status: :not_found
  end

  private

  # 【追加】ログインしていない場合に401を返すメソッド
  def ensure_logged_in
    if current_user.nil?
      render json: { error: "ログインが必要です" }, status: :unauthorized
    end
  end
end ```

## File: ./app/controllers/api/v1/symptoms_controller.rb
 ```rb
class Api::V1::SymptomsController < ApplicationController
  def index
    # 1. 指定されたタイミングのデータを一括で取得する
    base_query = Symptom.where(timing: params[:timing])

    # 2. 取得したデータをカテゴリごとに振り分けて返却する
    render json: {
      symptoms: base_query.where(category: 0),     # 症状
      constitutions: base_query.where(category: 1)  # 体質
    }, status: :ok
  end
end ```

## File: ./app/controllers/api/v1/auth/sessions_controller.rb
 ```rb
class Api::V1::Auth::SessionsController < Devise::SessionsController
  # APIモードなのでJSON形式でレスポンスを返す
  respond_to :json

  # ログイン（サインイン）
  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      Rails.logger.info "Generated Token: #{token}"
      
      render json: {
        status: 'success',
        token: token, 
        data: user
      }, status: :ok
    else
      render json: {
        status: 'error',
        message: 'メールアドレスまたはパスワードが間違っています。'
      }, status: :unauthorized
    end
  end

  # ログアウト（サインアウト）
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    render json: {
      status: 'success',
      message: "ログアウトしました"
    }, status: :ok
  end

  private

  # Deviseに渡すパラメーターの形式を定義
  def sign_in_params
    params.require(:user).permit(:email, :password)
  end

  # 認証失敗時の挙動をカスタマイズ（401 Unauthorizedを返す）
  def respond_to_on_destroy
    head :no_content
  end
end ```

## File: ./app/controllers/api/v1/auth/registrations_controller.rb
 ```rb
class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  def create
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)
      
      render json: {
        status: 'success',
        token: token, 
        data: resource
      }, status: :ok
    else
      render json: {
        status: 'error',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  protected

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end ```

## File: ./app/controllers/api/v1/auth/passwords_controller.rb
 ```rb
class Api::V1::Auth::PasswordsController < Devise::PasswordsController
  respond_to :json

  # POST /api/v1/auth/password
  def create
    reset_params = params.require(:user).permit(:email)
    self.resource = resource_class.send_reset_password_instructions(reset_params)

    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { message: 'パスワード再設定メールを送信しました。' }, status: :ok
    else
      render json: { error: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/auth/password (新パスワード設定)
  def update
    update_params = params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
    self.resource = resource_class.reset_password_by_token(update_params)
    
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      render json: { message: 'パスワードが正しく変更されました。' }, status: :ok
    else
      render json: { error: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end ```

## File: ./app/controllers/application_controller.rb
 ```rb
class ApplicationController < ActionController::API
include ActionController::MimeResponds
  before_action :configure_permitted_parameters, if: :devise_controller?

  def current_user
    auth_header = request.headers['Authorization']
    token = auth_header.split(' ').last if auth_header.present?

    # トークンがない（未ログイン・ゲスト）場合は nil を返す
    return nil if token.blank? || token == 'null'

    begin
      # トークンがあれば解読してユーザーを探す
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      User.find_by(id: payload['sub'])
    rescue
      # トークンの期限切れや不正な場合はゲスト（nil）として扱う
      nil
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end ```

## File: ./app/services/diagnosis_service.rb
 ```rb
class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  def execute
    selected_symptoms = Symptom.where(id: @symptom_ids).index_by(&:id)
    valid_drugs = Drug.where(timing: [@timing, 3]).includes(:drug_symptoms)

    has_stomach_pain = selected_symptoms.values.any? { |s| s.name.include?('胃痛') || s.name.include?('胃に違和感') }

    scored_drugs = valid_drugs.map do |drug|
      score = 0
      matched_count = 0

      drug.drug_symptoms.each do |ds|
        symptom = selected_symptoms[ds.symptom_id]
        if symptom
          score += (symptom.category == 1) ? 2 : 1
          matched_count += 1
        end
      end

      # 💊 禁忌・リスク回避ロジック（胃痛時のNSAIDs除外）
      if has_stomach_pain && drug.name == 'バファリンA'
        score -= 10
      end

      match_ratio = 0.0
      if drug.drug_symptoms.size > 0 && score > 0
        match_ratio = matched_count.to_f / drug.drug_symptoms.size
      end

      final_score = score + match_ratio

      { drug: drug, score: final_score, random: rand, symptom_count: drug.drug_symptoms.size }
    end

    # 🎯 スコアがマイナス（禁忌）の薬だけを除外する（スコア0の無難な薬は残す）
    safe_drugs = scored_drugs.reject { |item| item[:score] < 0 }

    # ランキングの並び替え
    sorted_drugs = safe_drugs.sort_by do |item|
      [
        -item[:score],         # 1. スコアが高い順（マッチしているものを最優先）
        item[:symptom_count],  # 2. 薬の守備範囲が狭い順（特化型を優先）
        item[:drug].category,  # 3. 医薬品優先
        item[:random]          # 4. 同点（スコア0同士など）はランダム
      ]
    end

    # 上位3つを確実に取得する（スコア0のものも穴埋めとして入る）
    suggested_drugs = sorted_drugs.map { |item| item[:drug] }.take(3)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end

  private

  def generate_summary(symptoms)
    names = symptoms.map(&:name)
    advices = []

    if names.any? { |n| n.include?('空腹') }
      advices << "空腹でお酒を飲むとアルコールの吸収が急激に進み、胃粘膜も荒れやすくなります。まずは何か軽く胃に入れてからお酒を楽しみましょう。"
    end
    
    if names.any? { |n| n.include?('頭痛') || n.include?('乾く') }
      advices << "アルコールによる脱水が起きているサインです。お酒と同じかそれ以上の水分（水や経口補水液）をこまめに摂ることを強くおすすめします。"
    end
    
    if names.any? { |n| n.include?('胃') || n.include?('吐き気') || n.include?('ムカムカ') }
      advices << "胃腸がダメージを受けています。消化の良い温かいものを摂り、油物や刺激物は避けて胃を休ませてください。"
    end
    
    if names.any? { |n| n.include?('弱い') || n.include?('赤く') || n.include?('ふらつく') }
      advices << "アルコールの分解が追いついていない可能性があります。自分のペースを守り、無理な飲酒や一気飲みは絶対に控えてください。"
    end

    if advices.empty?
      advices << "肝臓の代謝を助ける成分を摂りつつ、こまめな水分補給と十分な休息を心がけてください。"
    end

    advices.join("\n\n")
  end
end ```

## File: ./app/views/layouts/mailer.text.erb
 ```erb
<%= yield %>
 ```

## File: ./app/views/layouts/mailer.html.erb
 ```erb
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
      /* Email styles need to be inline */
    </style>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
 ```

## File: ./app/views/devise/mailer/reset_password_instructions.html.erb
 ```erb
<%
  # ローカル開発時は localhost、本番（Vercel）では本番のURLになるように設定
  frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5173'
  
  # トークンをくっつけた再設定用URLを組み立てる
  reset_url = "#{frontend_url}/reset-password?reset_password_token=#{@token}"
%>

<div style="font-family: sans-serif; color: #333;">
  <p><%= @resource.email %> さん、こんにちは！</p>

  <p>Nomu-Sup のパスワード再設定リクエストを受け付けました。<br>
  以下のリンクをクリックして、新しいパスワードを設定してください。</p>

  <p style="margin: 24px 0;">
    <%= link_to 'パスワードを再設定する', reset_url, style: "background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; display: inline-block;" %>
  </p>

  <p style="font-size: 12px; color: #666;">
    ※もしこのメールに心当たりがない場合は、他の方が誤ってメールアドレスを入力した可能性があります。その場合はこのメールを無視していただいて構いません。
  </p>
</div> ```

## File: ./test/models/symptom_test.rb
 ```rb
require "test_helper"

class SymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/user_test.rb
 ```rb
require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/ingredient_test.rb
 ```rb
require "test_helper"

class IngredientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_symptom_test.rb
 ```rb
require "test_helper"

class DrugSymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_symptom_test.rb
 ```rb
require "test_helper"

class DiagnosisLogSymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_ingredient_test.rb
 ```rb
require "test_helper"

class DrugIngredientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_drug_test.rb
 ```rb
require "test_helper"

class DiagnosisLogDrugTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_test.rb
 ```rb
require "test_helper"

class DrugTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_test.rb
 ```rb
require "test_helper"

class DiagnosisLogTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/channels/application_cable/connection_test.rb
 ```rb
require "test_helper"

module ApplicationCable
  class ConnectionTest < ActionCable::Connection::TestCase
    # test "connects with cookies" do
    #   cookies.signed[:user_id] = 42
    #
    #   connect
    #
    #   assert_equal connection.user_id, "42"
    # end
  end
end
 ```

## File: ./test/controllers/api/v1/health_check_controller_test.rb
 ```rb
require "test_helper"

class Api::V1::HealthCheckControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/controllers/api/v1/users_controller_test.rb
 ```rb
require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/test_helper.rb
 ```rb
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end
 ```

## File: ./db/seeds.rb
 ```rb
# 既存データの削除
[
  DiagnosisLogDrug,
  DiagnosisLogSymptom,
  DiagnosisLog,
  DrugIngredient,
  DrugSymptom,
  Drug,
  Ingredient,
  Symptom
].each(&:destroy_all)

# 1. 症状データの登録 (Symptoms)
# timing: 0:前, 1:中, 2:後 / category: 0:症状, 1:体質
symptoms_data = [
  # これから飲む (前)
  { name: '空腹である', timing: 0, category: 0 },
  { name: '今日はがっつり飲む予定', timing: 0, category: 0 },
  { name: 'ビールなど炭酸系を多く飲む', timing: 0, category: 0 },
  { name: 'お酒に弱い体質である', timing: 0, category: 1 },
  # 飲みすぎたかも (中)
  { name: '顔が赤くなっている', timing: 1, category: 0 },
  { name: '少しふらつく', timing: 1, category: 0 },
  { name: '喉が異常に乾く', timing: 1, category: 0 },
  { name: '締めを食べたい欲求がある', timing: 1, category: 0 },
  { name: 'すでに胃に違和感がある', timing: 1, category: 1 },
  # 翌朝がつらい (後)
  { name: 'ズキズキする頭痛', timing: 2, category: 0 },
  { name: 'ムカムカする吐き気', timing: 2, category: 0 },
  { name: '体がだるい', timing: 2, category: 0 },
  { name: 'むくみがひどい', timing: 2, category: 0 },
  { name: '現在、胃痛がある', timing: 2, category: 1 }
]
symptoms = {}
symptoms_data.each { |s| symptoms[s[:name]] = Symptom.create!(s) }

# 2. 成分データの登録 (Ingredients) - 25種類以上
ingredients_list = [
  "肝臓エキス", "クルクミン", "ウコンエキス", "オルニチン", "ビタミンB1", "ビタミンB2", "ビタミンB6", "ビタミンC",
  "ブドウ糖", "クエン酸", "タウリン", "ナイアシン", "L-システイン", "グリチルリチン酸", "アセトアミノフェン",
  "無水カフェイン", "イブプロフェン", "水酸化マグネシウム", "アルミナマグネシウム", "ウルソデオキシコール酸",
  "カンゾウエキス", "ケイヒ", "チョウジ", "バクモンドウ", "五苓散エキス", "半夏瀉心湯エキス", "芍薬甘草湯エキス"
]
ingredients = {}
ingredients_list.each { |name| ingredients[name] = Ingredient.create!(name: name, detail: "#{name}の代謝助長・保護作用") }

# 3. 商品データの登録 (Drugs) - 25種類 (コンビニ15個 / DS10個)
# category: 0:DS(医薬品等), 1:コンビニ(食品/指定医薬部外品)
# timing: 0:前, 1:中, 2:後, 3:いつでも
drugs_data = [
  # --- コンビニ系 (14個) ---
  { 
    name: 'ヘパリーゼW', 
    category: 1, 
    timing: 0, 
    description: '肝臓エキス100mg配合。飲む前の定番。', 
    pharmacist_advice: '飲み会の30分〜1時間前に飲んでおくのが最も効果的です。成分が吸収され、肝臓が準備運動を始めます。' 
  },
  { 
    name: 'ウコンの力', 
    category: 1, 
    timing: 0, 
    description: 'クルクミン30mg配合。秋ウコンエキス。', 
    pharmacist_advice: '沈殿しやすいので、よく振ってから飲みましょう。乾杯の直前に飲むのがおすすめです。' 
  },
  { 
    name: 'ウコンの力 超MAX', 
    category: 1, 
    timing: 0, 
    description: 'クルクミン40mgに加え、肝臓エキスも配合。', 
    pharmacist_advice: '「今日は長丁場になりそうだ」という時の切り札です。ドロっとしていますが、一気に飲み干して気合を入れましょう。' 
  },
  { 
    name: 'カゴメ トマトジュース', 
    category: 1, 
    timing: 1, 
    description: 'リコピンがアルコール代謝をサポート。', 
    pharmacist_advice: 'お酒と交互に飲む「チェイサー」として優秀です。血中のアルコール濃度の上昇を緩やかにしてくれます。' 
  },
  { 
    name: 'ラムネ', 
    category: 1, 
    timing: 1, 
    description: 'ブドウ糖90%配合。低血糖予防に。', 
    pharmacist_advice: '飲酒により消費された脳のエネルギー（ブドウ糖）を素早く補給できます。酔いが回ってフラフラする時に数粒どうぞ。' 
  },
  { 
    name: 'inゼリー エネルギー', 
    category: 1, 
    timing: 0, 
    description: '空腹での飲酒を避けるためのエネルギー補給。', 
    pharmacist_advice: '空腹で飲むお酒は、胃壁を荒らす最大の原因です。食事をする時間がない時は、これで胃に膜を作ってから挑みましょう。' 
  },
  { 
    name: 'チョコラBBスパークリング', 
    category: 1, 
    timing: 2, 
    description: 'ナイアシン配合。アセトアルデヒド分解を助ける。', 
    pharmacist_advice: '「ナイアシン」は二日酔いの原因物質を分解する補酵素です。翌朝、肌荒れとだるさが気になる女性に特におすすめです。' 
  },
  { 
    name: 'ソルマック5', 
    category: 1, 
    timing: 1, 
    description: '食べる前に飲む。胃の働きを整える。', 
    pharmacist_advice: '苦味が強いですが、それが胃薬の証です。脂っこいおつまみを食べる前に飲んでおくと、翌日の胃もたれが軽減します。' 
  },
  { 
    name: 'ヘパリーゼHi', 
    category: 1, 
    timing: 0, 
    description: 'コンドロイチン配合。さらに元気を。', 
    pharmacist_advice: '疲れが溜まっている状態での飲み会にはこちら。代謝促進成分が強化されているので、元気を底上げしてくれます。' 
  },
  { 
    name: 'TBC 鉄分', 
    category: 1, 
    timing: 3, 
    description: 'ミネラル補給。', 
    pharmacist_advice: 'アルコールの利尿作用でミネラルも失われます。だるさが抜けない時は、水分と一緒に鉄分などのミネラルを補いましょう。' 
  },
  { 
    name: 'ウィルキンソン炭酸水', 
    category: 1, 
    timing: 3, 
    description: '水分補給とリフレッシュ。', 
    pharmacist_advice: '胃の中で発泡することで満腹感を与え、お酒のペースを落とせます。レモン入りならクエン酸効果も期待できます。' 
  },
  { 
    name: 'ポカリスエット', 
    category: 1, 
    timing: 1, 
    description: '電解質を素早く補給。', 
    pharmacist_advice: '帰宅後、寝る前にコップ1杯飲むだけで翌朝のラクさが違います。アルコールによる脱水を寝ている間に防ぎます。' 
  },
  { 
    name: 'しじみ70個分のちから', 
    category: 1, 
    timing: 2, 
    description: 'オルニチンたっぷり。翌朝の味噌汁代わりに。', 
    pharmacist_advice: '温かい汁物は弱った胃腸を温め、血流を良くします。飲んだ後の締め、または翌朝の朝食に最適です。' 
  },
  { 
    name: 'リポビタンD', 
    category: 1, 
    timing: 0, 
    description: 'タウリン1000mg。エネルギーチャージ。', 
    pharmacist_advice: 'タウリンは肝細胞の修復を助けます。カフェインが含まれるので、これから飲むぞ！という気合入れのタイミングで。' 
  },

  # --- ドラッグストア系 (12個) ---
  { 
    name: 'ヘパリーゼGX', 
    category: 0, 
    timing: 0, 
    description: '第3類医薬品。肝臓加水分解物600mg。', 
    pharmacist_advice: 'ドリンクタイプより成分量が多い医薬品です。頻繁に飲む方は、こちらを常備しておくとコストパフォーマンスが良いです。' 
  },
  { 
    name: 'ハイチオールCプラス', 
    category: 0, 
    timing: 2, 
    description: 'L-システインが代謝を促進し、二日酔いを改善。', 
    pharmacist_advice: '本来は肌の薬ですが、二日酔いの原因物質（アセトアルデヒド）を無毒化する力が強力です。だるさが残る朝に。' 
  },
  { 
    name: 'ミラグレーン錠', 
    category: 0, 
    timing: 3, 
    description: '知る人ぞ知る肝臓薬。牛黄配合。', 
    pharmacist_advice: 'お酒好きの間で「最強」との呼び声高い薬です。飲む前なら2錠、二日酔いになってしまった後なら2錠服用してください。' 
  },
  { 
    name: '太田胃散', 
    category: 0, 
    timing: 1, 
    description: '生薬の力で胃の違和感をスッキリ。', 
    pharmacist_advice: '飲みすぎ特有の「胸焼け」「胃の不快感」にはこれ。独特の香りは生薬（シナモン等）によるもので、胃の動きを高めます。' 
  },
  { 
    name: 'パンシロン01+', 
    category: 0, 
    timing: 1, 
    description: '飲みすぎ・胃もたれに。', 
    pharmacist_advice: '荒れた胃粘膜を修復する成分が入っています。「食べ過ぎ」も併発している時の胃もたれによく効きます。' 
  },
  { 
    name: '五苓散', 
    category: 0, 
    timing: 2, 
    description: '水分の巡りを整え、頭痛・むくみを改善。', 
    pharmacist_advice: '「喉が渇くのに吐いてしまう」「頭が痛い」という、水分の偏りによる二日酔いに特効薬です。お湯に溶かして飲むと効果倍増。' 
  },
  { 
    name: '半夏瀉心湯', 
    category: 0, 
    timing: 2, 
    description: '吐き気・下痢・二日酔いのむかつきに。', 
    pharmacist_advice: 'お腹がゴロゴロする、下痢気味、口内炎ができている等の胃腸トラブルを伴う二日酔いに適しています。' 
  },
  { 
    name: 'スクラート胃腸薬', 
    category: 0, 
    timing: 1, 
    description: '荒れた胃粘膜を直接保護・修復するスクラルファート配合。', 
    pharmacist_advice: 'お酒で荒れた胃の患部に直接貼り付いてバリアを作ってくれます。第2類医薬品なので、薬剤師不在の時間帯でもドラッグストア等で比較的購入しやすいお薬です。' 
  },
   { 
    name: '経口補水液OS-1', 
    category: 0, 
    timing: 3, 
    description: '脱水状態の水分補給に最適。', 
    pharmacist_advice: '二日酔いの頭痛は「脳の脱水」が原因なことが多いです。ガブ飲みせず、少しずつ点滴のように身体に染み渡らせてください。' 
  },
  { 
    name: 'バファリンA', 
    category: 0, 
    timing: 2, 
    description: '二日酔いの頭痛に。※胃障害注意。', 
    pharmacist_advice: '【重要】空腹時に飲むと胃を荒らします。アルコールで胃が弱っている時は特に注意し、必ず水多めか、何か食べてから服用してください。' 
  },
  { 
    name: 'ウルソ', 
    category: 0, 
    timing: 0, 
    description: '胆汁酸の分泌を促進し、肝機能を改善。', 
    pharmacist_advice: '脂っこい食事と一緒に飲むお酒にはこれ。胆汁の働きを助け、油ものの消化と肝臓の解毒をダブルでサポートします。' 
  },
  { 
    name: 'タイレノールA', 
    category: 0, 
    timing: 2, 
    description: '空腹時でも飲める、胃に優しいアセトアミノフェン単一処方。', 
    pharmacist_advice: 'ロキソニンやバファリン等で胃が痛くなりやすい方の頭痛におすすめです。ただし、お酒が抜けていない状態での服用は肝臓へ負担がかかるため、しっかり水分を摂って時間をおいてから服用してください。' 
  }
]
drugs_data.each { |d| Drug.create!(d) }

# 4. 紐付け (DrugSymptom / DrugIngredient) 

# === ① 成分(Ingredient)の紐付け ===
hepa_w = Drug.find_by(name: 'ヘパリーゼW')
DrugIngredient.create!(drug: hepa_w, ingredient: ingredients['肝臓エキス']) if hepa_w && ingredients['肝臓エキス']

goreisan = Drug.find_by(name: '五苓散')
DrugIngredient.create!(drug: goreisan, ingredient: ingredients['五苓散エキス']) if goreisan && ingredients['五苓散エキス']

ramune = Drug.find_by(name: 'ラムネ')
DrugIngredient.create!(drug: ramune, ingredient: ingredients['ブドウ糖']) if ramune && ingredients['ブドウ糖']

tylenol = Drug.find_by(name: 'タイレノールA')
DrugIngredient.create!(drug: tylenol, ingredient: ingredients['アセトアミノフェン']) if tylenol && ingredients['アセトアミノフェン']


# === ② 症状(Symptom)の紐付け（診断アルゴリズムのコア） ===
# 薬の名前 => [効く症状の名前の配列] で定義
drug_symptom_mappings = {
  # --- コンビニ系 ---
  'ヘパリーゼW' => ['空腹である', 'お酒に弱い体質である', '今日はがっつり飲む予定'],
  'ウコンの力' => ['今日はがっつり飲む予定', 'お酒に弱い体質である', 'ビールなど炭酸系を多く飲む'],
  'ウコンの力 超MAX' => ['今日はがっつり飲む予定', '体がだるい', 'お酒に弱い体質である'],
  'カゴメ トマトジュース' => ['顔が赤くなっている', '喉が異常に乾く'],
  'ラムネ' => ['少しふらつく', '締めを食べたい欲求がある'],
  'inゼリー エネルギー' => ['空腹である', 'すでに胃に違和感がある', 'ビールなど炭酸系を多く飲む'],
  'チョコラBBスパークリング' => ['体がだるい', '顔が赤くなっている'],
  'ソルマック5' => ['すでに胃に違和感がある', '今日はがっつり飲む予定'],
  'ヘパリーゼHi' => ['体がだるい', '今日はがっつり飲む予定'],
  'TBC 鉄分' => ['体がだるい', '少しふらつく'],
  'ウィルキンソン炭酸水' => ['ビールなど炭酸系を多く飲む', '喉が異常に乾く'],
  'ポカリスエット' => ['喉が異常に乾く', '顔が赤くなっている'],
  'しじみ70個分のちから' => ['体がだるい', '締めを食べたい欲求がある'],
  'リポビタンD' => ['体がだるい', '今日はがっつり飲む予定'],

  # --- ドラッグストア系 ---
  'ヘパリーゼGX' => ['お酒に弱い体質である', '今日はがっつり飲む予定', '体がだるい'],
  'ハイチオールCプラス' => ['体がだるい', '顔が赤くなっている'],
  'ミラグレーン錠' => ['お酒に弱い体質である', '体がだるい', '少しふらつく'],
  '太田胃散' => ['すでに胃に違和感がある', 'ムカムカする吐き気', '現在、胃痛がある', 'ビールなど炭酸系を多く飲む'],
  'パンシロン01+' => ['ムカムカする吐き気', '現在、胃痛がある'],
  '五苓散' => ['ズキズキする頭痛', 'むくみがひどい', '喉が異常に乾く', 'ムカムカする吐き気'],
  '半夏瀉心湯' => ['ムカムカする吐き気', '現在、胃痛がある'],
  '経口補水液OS-1' => ['喉が異常に乾く', 'ズキズキする頭痛', '少しふらつく'],
  'スクラート胃腸薬' => ['現在、胃痛がある', 'ムカムカする吐き気'],
  'タイレノールA' => ['ズキズキする頭痛', '現在、胃痛がある'],
  'バファリンA' => ['ズキズキする頭痛'],
  'ウルソ' => ['今日はがっつり飲む予定', 'すでに胃に違和感がある']
}

# 上のリストを元に、自動で一括紐付けを行う処理
drug_symptom_mappings.each do |drug_name, symptom_names|
  drug = Drug.find_by(name: drug_name)
  symptom_names.each do |s_name|
    symptom = symptoms[s_name]
    if drug && symptom
      DrugSymptom.create!(drug: drug, symptom: symptom)
    end
  end
end

puts "Seedデータの投入と紐付けが完了しました！"
 ```

## File: ./db/migrate/20260204020414_create_diagnosis_logs.rb
 ```rb
class CreateDiagnosisLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_logs, id: :uuid do |t|
      t.uuid :user_id
      t.integer :timing

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204020821_create_diagnosis_log_drugs.rb
 ```rb
class CreateDiagnosisLogDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_drugs, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :drug, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260212025335_add_devise_to_users.rb
 ```rb
class AddDeviseToUsers < ActiveRecord::Migration[7.1]
  def self.up
    change_table :users do |t|
      # emailはすでにあるので、ここでは「encrypted_password」だけ追加します
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at
    end

    # emailカラム自体はあるはずなので、もしindexがなければ追加、
    # password_digest（古い欄）が不要なら削除します
    remove_column :users, :password_digest, :string
    
    # indexの追加（既存のemailにユニーク制約をかける）
    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
  end
end
 ```

## File: ./db/migrate/20260204025027_create_ingredients.rb
 ```rb
class CreateIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients, id: :uuid do |t|
      t.string :name
      t.text :detail

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260203022540_enable_pgcrypto.rb
 ```rb
class EnablePgcrypto < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto' # PostgreSQLのUUID生成機能をONにする
  end
end
 ```

## File: ./db/migrate/20260204024135_create_users.rb
 ```rb
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :password_digest

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204025116_create_drug_ingredients.rb
 ```rb
class CreateDrugIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_ingredients, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :ingredient, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260212024435_add_jti_to_users.rb
 ```rb
class AddJtiToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :jti, :string
    add_index :users, :jti
  end
end
 ```

## File: ./db/migrate/20260223110645_add_pharmacist_advice_to_drugs.rb
 ```rb
class AddPharmacistAdviceToDrugs < ActiveRecord::Migration[7.1]
  def change
    add_column :drugs, :pharmacist_advice, :text
  end
end
 ```

## File: ./db/migrate/20260204032858_add_details_to_symptoms.rb
 ```rb
class AddDetailsToSymptoms < ActiveRecord::Migration[7.1]
  def change
    add_column :symptoms, :timing, :integer
    add_column :symptoms, :category, :integer
  end
end
 ```

## File: ./db/migrate/20260204014528_create_drugs.rb
 ```rb
class CreateDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :drugs, id: :uuid do |t|
      t.string :name
      t.integer :category
      t.integer :timing
      t.text :description

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260218042235_add_name_to_users.rb
 ```rb
class AddNameToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :name, :string
  end
end
 ```

## File: ./db/migrate/20260223113336_add_result_summary_to_diagnosis_logs.rb
 ```rb
class AddResultSummaryToDiagnosisLogs < ActiveRecord::Migration[7.1]
  def change
    add_column :diagnosis_logs, :result_summary, :text
  end
end
 ```

## File: ./db/migrate/20260204020806_create_diagnosis_log_symptoms.rb
 ```rb
class CreateDiagnosisLogSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_symptoms, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204015552_create_symptoms.rb
 ```rb
class CreateSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :symptoms, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204025144_create_drug_symptoms.rb
 ```rb
class CreateDrugSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_symptoms, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/schema.rb
 ```rb
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_23_113336) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "diagnosis_log_drugs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "diagnosis_log_id", null: false
    t.uuid "drug_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["diagnosis_log_id"], name: "index_diagnosis_log_drugs_on_diagnosis_log_id"
    t.index ["drug_id"], name: "index_diagnosis_log_drugs_on_drug_id"
  end

  create_table "diagnosis_log_symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "diagnosis_log_id", null: false
    t.uuid "symptom_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["diagnosis_log_id"], name: "index_diagnosis_log_symptoms_on_diagnosis_log_id"
    t.index ["symptom_id"], name: "index_diagnosis_log_symptoms_on_symptom_id"
  end

  create_table "diagnosis_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.integer "timing"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "result_summary"
  end

  create_table "drug_ingredients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "drug_id", null: false
    t.uuid "ingredient_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drug_id"], name: "index_drug_ingredients_on_drug_id"
    t.index ["ingredient_id"], name: "index_drug_ingredients_on_ingredient_id"
  end

  create_table "drug_symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "drug_id", null: false
    t.uuid "symptom_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drug_id"], name: "index_drug_symptoms_on_drug_id"
    t.index ["symptom_id"], name: "index_drug_symptoms_on_symptom_id"
  end

  create_table "drugs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "category"
    t.integer "timing"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "pharmacist_advice"
  end

  create_table "ingredients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "detail"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "timing"
    t.integer "category"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "diagnosis_log_drugs", "diagnosis_logs"
  add_foreign_key "diagnosis_log_drugs", "drugs"
  add_foreign_key "diagnosis_log_symptoms", "diagnosis_logs"
  add_foreign_key "diagnosis_log_symptoms", "symptoms"
  add_foreign_key "drug_ingredients", "drugs"
  add_foreign_key "drug_ingredients", "ingredients"
  add_foreign_key "drug_symptoms", "drugs"
  add_foreign_key "drug_symptoms", "symptoms"
end
 ```

