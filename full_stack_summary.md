## File: ./frontend/eslint.config.js
 ```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
 ```

## File: ./frontend/tsconfig.json
 ```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
 ```

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

## File: ./frontend/.vite/deps/_metadata.json
 ```json
{
  "hash": "71c94930",
  "configHash": "135df27c",
  "lockfileHash": "2a31bdc1",
  "browserHash": "abd568fe",
  "optimized": {},
  "chunks": {}
} ```

## File: ./frontend/index.html
 ```html
<!doctype html>
<html lang="ja"> <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>Nomu-Sup | 薬剤師監修の二日酔い対策ソムリエ</title>
    <meta name="description" content="今日の一杯を、明日への活力に。あなたの今のコンディションに最適な二日酔い対策を提案します。">

    <meta property="og:site_name" content="Nomu-Sup" />
    <meta property="og:title" content="Nomu-Sup | 薬剤師監修の二日酔い対策ソムリエ" />
    <meta property="og:description" content="今日の一杯を、明日への活力に。あなたの今のコンディションに最適な二日酔い対策を提案します。" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.nomu-sup.com/" /> 
    <meta property="og:image" content="https://www.nomu-sup.com/ogp-image.png" />

    <meta name="twitter:card" content="summary_large_image" /> </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html> ```

## File: ./frontend/tailwind.config.js
 ```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // アクティブな印象のオレンジを設定
        primary: "#FF8C00", 
      },
    },
  },
  plugins: [],
} ```

## File: ./frontend/tsconfig.node.json
 ```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
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

## File: ./frontend/postcss.config.js
 ```js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ここを修正
    autoprefixer: {},
  },
} ```

## File: ./frontend/tsconfig.app.json
 ```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
 ```

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

## File: ./frontend/src/components/shared/DiagnosisHeader.tsx
 ```tsx
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface DiagnosisHeaderProps {
  currentStep: number;
  steps: { id: number; label: string }[];
  // 💡 【追加】テーマカラーを外から受け取れるようにする（デフォルトはオレンジ）
  theme?: 'orange' | 'blue'; 
}

const DiagnosisHeader = ({ currentStep, steps, theme = 'orange' }: DiagnosisHeaderProps) => {
  const navigate = useNavigate();

  // 💡 テーマに応じたカラークラスを定義
  const isBlue = theme === 'blue';
  const bgLineColor = isBlue ? 'bg-blue-100' : 'bg-orange-100';
  const activeLineColor = isBlue ? 'bg-gradient-to-r from-blue-300 to-cyan-500' : 'bg-gradient-to-r from-orange-400 to-primary';
  const activeCircleBg = isBlue ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-200 ring-blue-50' : 'bg-gradient-to-br from-orange-400 to-primary shadow-orange-200 ring-orange-50';
  const currentTextColor = isBlue ? 'text-cyan-600' : 'text-primary';

  return (
    <div className="mb-10 relative z-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-8 font-medium group bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        戻る
      </button>

      <div className="relative max-w-md mx-auto px-4">
        {/* 背景のグレーの線 */}
        <div className={`absolute left-0 top-4 w-full h-1 rounded-full z-0 transition-colors duration-500 ${bgLineColor}`}></div>
        
        {/* アクティブな色付きの線 */}
        <div
          className={`absolute left-0 top-4 h-1 rounded-full z-0 transition-all duration-500 ease-out shadow-sm ${activeLineColor}`}
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? `${activeCircleBg} text-white shadow-md ring-4`
                      : 'bg-white text-gray-300 ring-4 ring-white border border-gray-100'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs font-bold mt-2 whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? `${currentTextColor} drop-shadow-sm` : isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHeader; ```

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
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, History, ChevronRight, GlassWater, ListChecks, Sparkles, Beer, Coffee } from 'lucide-react';

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 1, title: 'いまの状態を選ぶ', desc: '「これから飲む」「二日酔い」など、あなたの状況を選択します。', icon: <GlassWater className="w-10 h-10" /> },
    { id: 2, title: '症状をタップ', desc: '当てはまる症状や、あなたの体質をチェックリストから選びます。', icon: <ListChecks className="w-10 h-10" /> },
    { id: 3, title: '最適な対策がわかる', desc: '薬剤師監修のロジックで、今すぐできるケアや市販薬をご提案します。', icon: <Sparkles className="w-10 h-10" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % steps.length), 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex flex-col animate-fadeIn bg-white">
      
      {/* 1. ヒーローセクション（ビタミンオレンジのグラデーション） */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 pt-20 pb-36 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
            最高の一杯と、<br className="md:hidden" />
            最高の翌朝を。
          </h1>
          <p className="text-lg text-orange-50 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            今のあなたの状態を選ぶだけ。<br className="hidden md:block"/>
            薬剤師監修のロジックが、最適な対策を即座に導き出します。
          </p>
        </div>
      </section>

      {/* 2. ダイレクト分岐カード */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-24 mb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <Link to="/diagnosis?timing=0" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <GlassWater className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">これから飲む</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">事前の準備で<br/>明日の自分を救う</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/diagnosis?timing=1" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Beer className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">飲みすぎた</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">今のうちにできる<br/>即効ケアを提案</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/diagnosis?timing=2" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Coffee className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">翌朝がつらい</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">二日酔いの症状を<br/>ピンポイントで緩和</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. 使い方は簡単３ステップ */}
      {/* 【変更点】全幅で明るいグラデーションを敷き、装飾の光（blur）を追加 */}
      <section className="py-20 px-6 w-full bg-gradient-to-b from-orange-50 via-amber-100/60 to-orange-50 relative overflow-hidden">
        {/* 背景のうっすらとした円形アクセント */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-orange-200/50 border border-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">使い方は簡単３ステップ</h2>
              <p className="text-orange-600/80 mt-3 font-medium">会員登録なしでも、今すぐ診断できます</p>
            </div>
            <div className="relative h-64 w-full max-w-lg mx-auto">
              <div key={activeStep} className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-orange-50/50 to-white border border-orange-100/50 rounded-3xl animate-fadeIn">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md">
                  {steps[activeStep].id}
                </div>
                <div className="mt-4 mb-5 bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary">
                  {steps[activeStep].icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{steps[activeStep].title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{steps[activeStep].desc}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {steps.map((_, index) => (
                <button key={index} onClick={() => setActiveStep(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-primary w-8' : 'bg-orange-200 hover:bg-orange-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 特徴セクション */}
      <section className="py-16 px-6 bg-orange-50/30 border-t border-orange-100/50 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nomu-Supの特徴</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">薬剤師監修</h3>
              <p className="text-sm text-gray-500 leading-relaxed">あなたの体質や症状に合わせ、医学的視点から最適な薬や成分を提案。</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">直感的な診断</h3>
              <p className="text-sm text-gray-500 leading-relaxed">「飲む前・中・後」を選ぶだけ。たった数問で今のあなたに最適なケアが判明。</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <History className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">履歴を保存</h3>
              <p className="text-sm text-gray-500 leading-relaxed">ログインすれば過去の診断履歴を保存。自分に合う対策がいつでも見返せる。</p>
            </div>
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
import DiagnosisHeader from '../components/shared/DiagnosisHeader';
import { 
  CheckCircle2, Loader2, ArrowRight, Sparkles, 
  Utensils, Calendar, Beer, Activity, ThermometerSun, 
  Wind, Droplets, Soup, AlertTriangle, Brain, Frown, 
  BatteryWarning, CloudRain, HeartPulse, Droplet
} from 'lucide-react';

const Diagnosis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timing = searchParams.get('timing') || '0';

  const isHangoverMode = timing === '2';

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [constitutions, setConstitutions] = useState<Symptom[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

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

  const toggleSymptom = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await client.post('/diagnosis_logs/calculate', {
        symptom_ids: selectedIds,
        timing: parseInt(timing)
      });
      navigate('/result', { state: { result: response.data } });
    } catch (error) {
      alert("診断に失敗しました。通信環境を確認してください。");
    }
  };

  const getStepData = () => {
    if (timing === '0') {
      return {
        header: [{ id: 1, label: '予定' }, { id: 2, label: '気分' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }],
        step1: symptoms.filter(s => s.name.includes('予定') || s.name.includes('炭酸')),
        step2: symptoms.filter(s => s.name.includes('空腹')),
        step3: constitutions,
        title1: '今日の予定は？', title2: '今の気分・状況は？', title3: 'あなたの体質は？'
      };
    } else {
      return {
        header: [{ id: 1, label: '気分' }, { id: 2, label: '症状' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }],
        step1: symptoms.filter(s => s.name.includes('欲求') || s.name.includes('だるい')),
        step2: symptoms.filter(s => !s.name.includes('欲求') && !s.name.includes('だるい')),
        step3: constitutions,
        title1: '今の気分は？', title2: '具体的な症状は？', title3: 'あなたの体質は？'
      };
    }
  };

  const currentConfig = getStepData();
  const currentItems = wizardStep === 1 ? currentConfig.step1 : wizardStep === 2 ? currentConfig.step2 : currentConfig.step3;
  const currentTitle = wizardStep === 1 ? currentConfig.title1 : wizardStep === 2 ? currentConfig.title2 : currentConfig.title3;

  const getIconForText = (text: string, isSelected: boolean) => {
    // 💡 翌朝モードの基本カラーを「水色（cyan）」に
    const defaultColor = isHangoverMode ? 'text-cyan-500' : 'text-primary';
    const iconClass = `w-7 h-7 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'text-white' : defaultColor}`;
    
    if (text.includes('空腹')) return <Utensils className={iconClass} />;
    if (text.includes('予定')) return <Calendar className={iconClass} />;
    if (text.includes('炭酸')) return <Beer className={iconClass} />;
    if (text.includes('弱い')) return <Activity className={iconClass} />;
    if (text.includes('赤く')) return <ThermometerSun className={iconClass} />;
    if (text.includes('ふらつく')) return <Wind className={iconClass} />;
    if (text.includes('乾く')) return <Droplets className={iconClass} />;
    if (text.includes('締め')) return <Soup className={iconClass} />;
    if (text.includes('違和感')) return <AlertTriangle className={iconClass} />;
    if (text.includes('頭痛')) return <Brain className={iconClass} />;
    if (text.includes('吐き気')) return <Frown className={iconClass} />;
    if (text.includes('だるい')) return <BatteryWarning className={iconClass} />;
    if (text.includes('むくみ')) return <CloudRain className={iconClass} />;
    if (text.includes('胃痛')) return <HeartPulse className={iconClass} />;
    // 翌朝は「水滴」アイコンで水分補給の清涼感を演出
    return isHangoverMode ? <Droplet className={iconClass} /> : <Sparkles className={iconClass} />;
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${isHangoverMode ? 'text-cyan-500 bg-blue-50/30' : 'text-primary'}`}>
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    // 💡 【変更】背景を「白ヘッダーに馴染む淡い水色のグラデーション」に
    <div className={`min-h-screen pt-6 pb-32 px-6 transition-colors duration-500 ${
      isHangoverMode 
        ? 'bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80' 
        : 'bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30'
    }`}>
      <div className="max-w-xl mx-auto">
        
        {/* 💡 ヘッダーにテーマカラーを渡す */}
        <DiagnosisHeader 
          currentStep={wizardStep} 
          steps={currentConfig.header} 
          theme={isHangoverMode ? 'blue' : 'orange'} 
        />

        <div className="animate-fadeIn">
          <div className="text-center mb-10">
            {/* 💡 テキストカラーを「深い青」にして視認性と優しさを両立 */}
            <h2 className={`text-3xl font-bold mb-3 drop-shadow-sm transition-colors ${
              isHangoverMode ? 'text-blue-900' : 'text-gray-800'
            }`}>
              {currentTitle}
            </h2>
            <p className={`text-sm font-medium transition-colors ${
              isHangoverMode ? 'text-blue-600/80' : 'text-orange-600/80'
            }`}>
              当てはまるものをすべて選んでください
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            {currentItems.length === 0 ? (
              <p className={`text-center py-10 ${isHangoverMode ? 'text-blue-400' : 'text-gray-400'}`}>該当する項目がありません</p>
            ) : (
              currentItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button 
                    key={item.id} 
                    onClick={() => toggleSymptom(item.id)} 
                    // 💡 【変更】カードは白ベースで、選択時に淡い水色に光るように
                    className={`group flex items-center p-5 rounded-3xl border-2 text-left transition-all duration-300 w-full overflow-hidden relative
                      ${isHangoverMode 
                        ? (isSelected 
                            ? 'border-transparent bg-blue-50/50 shadow-md transform scale-[1.02] ring-2 ring-cyan-400' 
                            : 'border-white bg-white shadow-sm hover:border-blue-100 hover:shadow-md')
                        : (isSelected 
                            ? 'border-transparent bg-white shadow-lg shadow-orange-200/50 transform scale-[1.02] ring-2 ring-primary' 
                            : 'border-white bg-white shadow-sm hover:shadow-md hover:border-orange-100')
                      }`}
                  >
                    <div className={`absolute left-0 top-0 h-full w-2 transition-all duration-300 ${
                      isSelected 
                        ? (isHangoverMode ? 'bg-cyan-400' : 'bg-primary') 
                        : 'bg-transparent'
                    }`}></div>

                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 transition-all duration-300 z-10
                      ${isHangoverMode 
                        ? (isSelected ? 'bg-gradient-to-br from-blue-400 to-cyan-400 shadow-inner' : 'bg-blue-50 group-hover:bg-blue-100')
                        : (isSelected ? 'bg-gradient-to-br from-orange-400 to-primary shadow-inner' : 'bg-orange-50 group-hover:bg-orange-100')
                      }
                    `}>
                      {getIconForText(item.name, isSelected)}
                    </div>

                    <span className={`text-lg font-bold flex-grow z-10 transition-colors duration-300 ${
                      isHangoverMode 
                        ? (isSelected ? 'text-blue-900' : 'text-gray-600')
                        : (isSelected ? 'text-gray-900' : 'text-gray-600')
                    }`}>
                      {item.name}
                    </span>

                    <CheckCircle2 className={`w-6 h-6 z-10 transition-all duration-300 ${
                      isSelected 
                        ? `scale-110 opacity-100 ${isHangoverMode ? 'text-cyan-500' : 'text-primary'}` 
                        : `scale-90 opacity-0 group-hover:opacity-50 text-gray-200`
                    }`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* --- Sticky（画面下部固定）ナビゲーションボタン --- */}
        <div className={`fixed bottom-0 left-0 w-full p-4 z-50 transition-colors duration-500 bg-white/80 backdrop-blur-xl border-t ${
          isHangoverMode ? 'border-blue-50 shadow-[0_-10px_30px_-15px_rgba(0,100,255,0.05)]' : 'border-gray-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]'
        }`}>
          <div className="max-w-xl mx-auto flex gap-3">
            
            {wizardStep > 1 && (
              <button 
                onClick={() => setWizardStep(prev => (prev - 1) as 1 | 2 | 3)} 
                className={`px-6 py-4 rounded-full font-bold transition-all whitespace-nowrap shadow-sm border-2 bg-white ${
                  isHangoverMode
                    ? 'text-blue-500 border-blue-100 hover:border-cyan-300 hover:bg-blue-50'
                    : 'text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                前へ
              </button>
            )}

            <button 
              onClick={wizardStep < 3 ? () => setWizardStep(prev => (prev + 1) as 1 | 2 | 3) : handleSubmit}
              disabled={selectedIds.length === 0 && wizardStep === 3}
              className={`flex-grow py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2
                ${selectedIds.length === 0 && wizardStep === 3
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  : (isHangoverMode
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:-translate-y-1'
                      : 'bg-gradient-to-r from-orange-500 to-primary text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:-translate-y-1')
                }`}
            >
              {wizardStep < 3 ? (
                <>次へ進む（{selectedIds.length}件選択中） <ArrowRight className="w-5 h-5" /></>
              ) : selectedIds.length === 0 ? (
                '1つ以上選択してください'
              ) : (
                <>診断結果を見る（{selectedIds.length}件選択中） {isHangoverMode ? <Droplet className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}</>
              )}
            </button>
          </div>
        </div>

      </div>
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
      <h2 className="text-lg font-bold text-gray-800 mb-2">第1条（適用）</h2>
      <p>本規約は、ユーザーと本サービス「Nomu-Sup」（以下「本サービス」）の利用に関わる一切の関係に適用されるものとします。</p>
      <p>なお、本サービスにおける情報提供の性質や健康被害に関する免責については、別途定めている「免責事項」の規定が適用されるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第2条（ユーザー登録）</h2>
      <p>本サービスの利用を希望する者は、本規約およびプライバシーポリシーに同意の上、運営者の定める方法によってユーザー登録を行うものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第3条（アカウントの管理）</h2>
      <p>ユーザーは、自己の責任において、本サービスのメールアドレスおよびパスワードを適切に管理するものとします。</p>
      <p>ユーザーは、いかなる場合にも、アカウントおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第4条（禁止事項）</h2>
      <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>法令または公序良俗に違反する行為</li>
        <li>犯罪行為に関連する行為</li>
        <li>本サービスのサーバーやネットワークの機能を破壊したり、妨害したりする行為</li>
        <li>本サービスの運営を妨害するおそれのある行為</li>
        <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
        <li>その他、運営者が不適切と判断する行為</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第5条（本サービスの提供の停止等）</h2>
      <p>運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
        <li>地震、落雷、火災、停電などの不可抗力により、本サービスの提供が困難となった場合</li>
        <li>コンピュータまたは通信回線等が事故により停止した場合</li>
        <li>その他、運営者が本サービスの提供が困難と判断した場合</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第6条（退会）</h2>
      <p>ユーザーは、運営者の定める退会手続により、本サービスから退会できるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第7条（サービス内容の変更等）</h2>
      <p>運営者は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害（本規約および免責事項に定めるものを除く）について一切の責任を負いません。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第8条（利用規約の変更）</h2>
      <p>運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第9条（準拠法・裁判管轄）</h2>
      <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
      <p>本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>
    </section>
  </StaticPageLayout>
);

// --- プライバシーポリシー ---
export const PrivacyPolicy = () => (
  <StaticPageLayout title="プライバシーポリシー" icon={ShieldCheck}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第1条（取得する個人情報）</h2>
      <p>本サービスは、ユーザーが利用登録をする際に以下の個人情報を取得します。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>メールアドレス</li>
        <li>ニックネーム</li>
        <li>診断履歴（選択した症状や体質、提案された対策商品に関するデータ）</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第2条（個人情報の利用目的）</h2>
      <p>本サービスが個人情報を収集・利用する目的は、以下のとおりです。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>ユーザーのアカウント管理およびログイン認証のため</li>
        <li>ユーザーへ過去の診断履歴を提供・表示するため</li>
        <li>ユーザーの利用状況を分析し、本サービスの品質向上や機能改善に役立てるため</li>
        <li>上記の利用目的に付随する目的</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第3条（個人情報の第三者提供）</h2>
      <p>運営者は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>法令に基づく場合</li>
        <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第4条（個人情報の開示・訂正・削除）</h2>
      <p>ユーザーは、本サービスのマイページ等の機能を利用して、自身の個人情報（ニックネーム、メールアドレス）の確認および訂正を行うことができます。また、アカウントの削除（退会）機能を利用することで、個人情報および診断履歴の削除を行うことができます。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第5条（プライバシーポリシーの変更）</h2>
      <p>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。</p>
      <p>変更後のプライバシーポリシーは、本サービス内に掲示したときから効力を生じるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第6条（お問い合わせ窓口）</h2>
      <p>本ポリシーに関するお問い合わせは、本サービスのお問い合わせ窓口、または運営者宛にお願いいたします。</p>
    </section>
  </StaticPageLayout>
);

// --- 免責事項 ---
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
import { 
  Sparkles, ShoppingCart, RefreshCcw, Save, Lightbulb, 
  MapPin, ExternalLink, ChevronDown, ChevronUp, UserCircle, Droplet
} from 'lucide-react';
import DiagnosisHeader from '../components/shared/DiagnosisHeader';

const customStyles = `
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10%) scale(1.05); }
  }
  .animate-bounce-subtle {
    animation: bounce-subtle 2s infinite ease-in-out;
  }

  @keyframes fadeSlideInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeSlideInUp {
    opacity: 0; 
    animation: fadeSlideInUp 1s ease-out forwards;
  }
`;

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
  const [expandedCards, setExpandedCards] = useState<number[]>([]);
  
  const data = location.state?.result as DiagnosisResponse;

  const isHangoverMode = data?.timing === 2;

  const headerSteps = data?.timing === 0
    ? [{ id: 1, label: '予定' }, { id: 2, label: '気分' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }]
    : [{ id: 1, label: '気分' }, { id: 2, label: '症状' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }];

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

  const toggleCard = (index: number) => {
    if (index === 0) return;
    setExpandedCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!data) return (
    <div className="text-center py-20">
      <p className="mb-4">結果が見つかりませんでした。</p>
      <Link to="/" className="text-primary underline font-bold">トップへ戻る</Link>
    </div>
  );

  const DELAY_STEP = 500;

  const renderSaveSection = (isMobile: boolean) => (
    <div 
      className={`animate-fadeSlideInUp p-6 rounded-3xl border shadow-sm text-center transition-colors duration-500
        ${isMobile ? 'block lg:hidden mt-10' : 'hidden lg:block'}
        ${isHangoverMode ? 'bg-gradient-to-br from-blue-50 to-white border-blue-100' : 'bg-gradient-to-br from-orange-50 to-white border-orange-100'}`}
      style={{ animationDelay: `${DELAY_STEP * (3 + data.suggested_drugs.length)}ms` }}
    >
      <h4 className="font-bold text-gray-800 mb-2 flex items-center justify-center gap-1.5 text-md">
        <Save className={`w-4 h-4 ${isHangoverMode ? 'text-cyan-500' : 'text-primary'}`} />
        記録に残しませんか？
      </h4>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        マイページからいつでも振り返れます。
      </p>
      <button
        onClick={handleSaveResult}
        disabled={isSaved}
        className={`w-full py-3.5 bg-white border-2 rounded-full font-bold text-sm transition-all shadow-sm flex justify-center items-center gap-2
          ${isSaved 
            ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' 
            : (isHangoverMode 
                ? 'border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white hover:shadow-md'
                : 'border-primary text-primary hover:bg-primary hover:text-white hover:shadow-md')}`}
      >
        {isSaved ? '保存済み' : (isLoggedIn ? '結果を保存する' : '会員登録して保存')}
      </button>
    </div>
  );

  const renderActionButtons = (isMobile: boolean) => (
    <div 
      className={`animate-fadeSlideInUp flex-col gap-3 relative z-10 ${isMobile ? 'flex lg:hidden mt-6' : 'hidden lg:flex'}`}
      style={{ animationDelay: `${DELAY_STEP * (3 + data.suggested_drugs.length + 1)}ms` }}
    >
      <Link 
        to="/diagnosis?timing=0" 
        className={`flex items-center justify-center gap-2 text-gray-600 text-sm font-bold py-3.5 transition-colors bg-white rounded-full border-2 border-transparent
          ${isHangoverMode ? 'hover:text-cyan-600' : 'hover:text-primary'}`}
      >
        <RefreshCcw className="w-4 h-4" />
        もう一度診断する
      </Link>
      <Link 
        to="/" 
        className={`bg-white border-2 border-gray-200 text-center text-sm py-3.5 rounded-full font-bold text-gray-600 transition-all
          ${isHangoverMode ? 'hover:border-cyan-500 hover:text-cyan-600' : 'hover:border-primary hover:text-primary'}`}
      >
        トップに戻る
      </Link>
    </div>
  );

  return (
    <div className={`max-w-5xl mx-auto pt-6 pb-20 px-6 relative min-h-screen transition-colors duration-500 ${
      isHangoverMode ? 'bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80' : 'bg-white'
    }`}>
      <style>{customStyles}</style>
      
      {/* 1. Header */}
      <div className="animate-fadeSlideInUp max-w-2xl mx-auto" style={{ animationDelay: '0ms' }}>
        <DiagnosisHeader currentStep={4} steps={headerSteps} theme={isHangoverMode ? 'blue' : 'orange'} />
      </div>

      {/* 2. Title */}
      <div className="text-center mb-12 relative z-10 animate-fadeSlideInUp" style={{ animationDelay: `${DELAY_STEP * 1}ms` }}>
        <div className={`inline-block p-3 rounded-full mb-4 shadow-lg ${
          isHangoverMode ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-cyan-200' : 'bg-gradient-to-br from-orange-400 to-primary shadow-orange-200'
        }`}>
          {isHangoverMode ? <Droplet className="text-white w-8 h-8" /> : <Sparkles className="text-white w-8 h-8" />}
        </div>
        <h2 className={`text-3xl lg:text-4xl font-extrabold mb-3 tracking-tight ${isHangoverMode ? 'text-blue-900' : 'text-gray-800'}`}>
          あなたへの処方箋
        </h2>
        <p className={`font-medium text-sm lg:text-base ${isHangoverMode ? 'text-blue-600/80' : 'text-orange-600/80'}`}>
          ソムリエが最適な対策をセレクトしました
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* =========================================
            左カラム：チャット風アドバイス
        ========================================= */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-8">
          
          <div className="animate-fadeSlideInUp" style={{ animationDelay: `${DELAY_STEP * 2}ms` }}>
            <div className="flex gap-4 items-start">
              
              {/* 💡 薬剤師アバター：翌朝はエメラルド、通常はブルー */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md
                  ${isHangoverMode 
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' 
                    : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}
                >
                  <UserCircle className="text-white w-8 h-8" />
                </div>
                <span className={`text-[10px] font-bold ${isHangoverMode ? 'text-emerald-600' : 'text-blue-600'}`}>
                  薬剤師
                </span>
              </div>

              {/* 💡 吹き出し：翌朝はエメラルド、通常はブルー */}
              <div className={`relative p-5 rounded-2xl rounded-tl-none border shadow-sm flex-grow
                ${isHangoverMode 
                  ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100' 
                  : 'bg-gradient-to-br from-blue-50 to-white border-blue-100'}`}
              >
                <div className={`absolute top-0 -left-2 w-0 h-0 border-t-[0px] border-t-transparent border-r-[10px] border-b-[12px] border-b-transparent
                  ${isHangoverMode ? 'border-r-emerald-50' : 'border-r-blue-50'}`}
                ></div>
                
                <h3 className={`text-sm font-bold mb-2 flex items-center gap-1
                  ${isHangoverMode ? 'text-emerald-800' : 'text-blue-800'}`}
                >
                  <Lightbulb className={`w-4 h-4 ${isHangoverMode ? 'text-emerald-500' : 'text-blue-500'}`} />
                  アドバイス
                </h3>
                <div className={`text-sm leading-relaxed whitespace-pre-wrap font-medium
                  ${isHangoverMode ? 'text-slate-700' : 'text-blue-900'}`}
                >
                  {data.result_summary}
                </div>
              </div>
            </div>
          </div>

          {renderSaveSection(false)}
          {renderActionButtons(false)}

        </div>

        {/* =========================================
            右カラム：薬の提案カードリスト
        ========================================= */}
        <div className="w-full lg:w-2/3 space-y-6">
          {data.suggested_drugs.map((drug, index) => {
            const isBestMatch = index === 0;
            const isExpanded = isBestMatch || expandedCards.includes(index);
            const isMedicine = String(drug.category) === 'medicine' || drug.category === 0;

            const mapQuery = isMedicine ? '薬局' : 'コンビニ';
            const amazonUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(drug.name)}`;

            return (
              <div 
                key={drug.id} 
                // 💡 バッジが綺麗に収まる元のデザイン（overflow-hidden と pt-16 を維持）
                className={`bg-white transition-all duration-300 overflow-hidden relative animate-fadeSlideInUp
                  ${isBestMatch 
                    ? `rounded-[2.5rem] border-4 pt-16 px-6 md:px-8 pb-8 ${
                        isHangoverMode ? 'border-cyan-100 shadow-xl shadow-cyan-100/50' : 'border-orange-100 shadow-xl shadow-orange-100/50'
                      }` 
                    : 'rounded-3xl border border-gray-200 shadow-sm hover:shadow-md'
                  }`}
                style={{ animationDelay: `${DELAY_STEP * (3 + index)}ms` }}
              >
                {isBestMatch && (
                  <div className="absolute top-6 left-0 w-full flex justify-center z-50">
                    <div className={`text-white text-sm font-extrabold px-7 py-2 rounded-full tracking-tight shadow-xl animate-bounce-subtle flex items-center gap-1.5 ${
                      isHangoverMode ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-cyan-500/30' : 'bg-gradient-to-r from-orange-600 to-red-600 shadow-orange-500/30'
                    }`}>
                      {isHangoverMode ? <Droplet className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                      BEST MATCH
                    </div>
                  </div>
                )}
                
                <div 
                  onClick={() => toggleCard(index)}
                  className={`flex justify-between items-center ${!isBestMatch && 'p-6 cursor-pointer hover:bg-gray-50'}`}
                >
                  <div>
                    <h3 className={`${isBestMatch ? 'text-2xl' : 'text-lg'} font-bold text-gray-800`}>
                      {drug.name}
                    </h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md mt-2 inline-block
                      ${isMedicine ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}
                    `}>
                      {isMedicine ? 'ドラッグストア等(医薬品)' : 'コンビニ等(食品・部外品)'}
                    </span>
                  </div>

                  {!isBestMatch && (
                    <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>

                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0 m-0'}`}>
                  <div className={`${!isBestMatch && 'px-6 pb-6'}`}>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                      {drug.description}
                    </p>

                    {drug.pharmacist_advice && (
                      // 💡 カード内ワンポイント：翌朝はエメラルド、通常はオレンジ
                      <div className={`p-5 rounded-2xl mb-6 flex items-start gap-3 border ${
                        isHangoverMode ? 'bg-emerald-50/50 border-emerald-100/50' : 'bg-orange-50/50 border-orange-100/50'
                      }`}>
                        <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHangoverMode ? 'text-emerald-500' : 'text-primary'}`} />
                        <div>
                          <span className={`text-xs font-bold block mb-1 ${isHangoverMode ? 'text-emerald-600' : 'text-primary'}`}>
                            薬剤師のワンポイント
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {drug.pharmacist_advice}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                          target="_blank" rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-colors ${
                            isMedicine 
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          <MapPin className="w-5 h-5" />
                          近くの{mapQuery}を探す
                        </a>
                        <a 
                          href={amazonUrl}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Amazonで探す <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {renderSaveSection(true)}
          {renderActionButtons(true)}

        </div>
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

## File: ./Dockerfile
 ```/Dockerfile
FROM ruby:3.3.0

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs postgresql-client

WORKDIR /app

# 環境変数の設定 (本番モード)
ENV RAILS_ENV="production" \
    RAILS_SERVE_STATIC_FILES="true" \
    RAILS_LOG_TO_STDOUT="true"

COPY Gemfile Gemfile.lock /app/
RUN bundle config set --local without 'development test' && bundle install

COPY . /app

# bin配下の実行権限を付与
RUN chmod +x /app/bin/*

# サーバー起動設定
CMD ["bundle", "exec", "rails", "s", "-p", "3000", "-b", "0.0.0.0"]
 ```

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
    origins "localhost:5173", 
            "https://nomu-sup-frontend.vercel.app",
            "https://nomu-sup.com",
            "https://www.nomu-sup.com"

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

  config.action_dispatch.show_exceptions = :none
  # テスト環境ではホスト制限を完全に無効化する
  config.host_authorization = { exclude: ->(request) { true } }
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
      g.test_framework :rspec,
                       fixtures: false,
                       view_specs: false,
                       helper_specs: false,
                       routing_specs: false
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

## File: ./docker-compose.yml
 ```yml
services:
  db:
    image: postgres:16
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_HOST_AUTH_METHOD: trust
  web:
    build: .
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      RAILS_ENV: development
      DATABASE_URL: postgres://postgres:password@db:5432/app_development
  frontend:
    image: node:20-slim
    volumes:
      - ./frontend:/app
    working_dir: /app
    ports:
      - "5173:5173"
    command: npm run dev
    tty: true
    stdin_open: true ```

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
  gem 'rspec-rails'
  gem 'factory_bot_rails'
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
  gem 'rubocop', require: false
  gem 'rubocop-rails', require: false
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

  enum :timing, { before_drinking: 0, during_drinking: 1, after_drinking: 2 }
end
 ```

## File: ./app/models/symptom.rb
 ```rb
class Symptom < ApplicationRecord
  has_many :diagnosis_log_symptoms, dependent: :destroy
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
  has_many :diagnosis_log_drugs, dependent: :destroy
  has_many :diagnosis_logs, through: :diagnosis_log_drugs

  has_many :drug_ingredients, dependent: :destroy
  has_many :ingredients, through: :drug_ingredients

  has_many :drug_symptoms, dependent: :destroy
  has_many :symptoms, through: :drug_symptoms

  enum :category, { medicine: 0, food: 1 }
  enum :timing, { before: 0, during: 1, after: 2, any: 3 }
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
  default from: 'from@example.com'
  layout 'mailer'
end
 ```

## File: ./app/controllers/api/v1/health_check_controller.rb
 ```rb
module Api
  module V1
    class HealthCheckController < ApplicationController
      def index
        render json: { message: 'Rails APIとの接続に成功しました！' }, status: :ok
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/users_controller.rb
 ```rb
module Api
  module V1
    class UsersController < ApplicationController
      def show
        if current_user
          render json: { id: current_user.id, name: current_user.name, email: current_user.email }, status: :ok
        else
          render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized
        end
      end

      def update
        if current_user&.update(user_params)
          render json: { message: 'プロフィールを更新しました', user: current_user }, status: :ok
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_content
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email)
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/diagnosis_logs_controller.rb
 ```rb
module Api
  module V1
    class DiagnosisLogsController < ApplicationController
      # 【修正】自作の認証メソッドを使用するように変更
      before_action :ensure_logged_in, only: %i[index show create destroy]

      def index
        @logs = current_user.diagnosis_logs
                            .includes(:symptoms, :drugs)
                            .order(created_at: :desc)

        render json: @logs.as_json(
          include: {
            symptoms: { only: %i[id name] },
            drugs: { only: %i[id name description pharmacist_advice] }
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

      def show
        @log = current_user.diagnosis_logs
                           .includes(:symptoms, :drugs)
                           .find(params[:id])

        render json: @log.as_json(
          include: {
            symptoms: { only: %i[id name category] },
            drugs: { only: %i[id name description pharmacist_advice] } # 薬にcategoryがない場合は消しておきます
          }
        ), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: '履歴が見つかりませんでした' }, status: :not_found
      end

      # rubocop:disable Metrics/AbcSize
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
          render json: { status: 'error', message: diagnosis_log.errors.full_messages }, status: :unprocessable_content
        end
      end
      # rubocop:enable all

      def destroy
        @log = current_user.diagnosis_logs.find(params[:id])
        if @log.destroy
          render json: { message: '履歴を削除しました' }, status: :ok
        else
          render json: { error: '削除に失敗しました' }, status: :unprocessable_content
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: '履歴が見つかりませんでした' }, status: :not_found
      end

      private

      # 【追加】ログインしていない場合に401を返すメソッド
      def ensure_logged_in
        return unless current_user.nil?

        render json: { error: 'ログインが必要です' }, status: :unauthorized
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/symptoms_controller.rb
 ```rb
module Api
  module V1
    class SymptomsController < ApplicationController
      def index
        # 1. 指定されたタイミングのデータを一括で取得する
        base_query = Symptom.where(timing: params[:timing])

        # 2. 取得したデータをカテゴリごとに振り分けて返却する
        render json: {
          symptoms: base_query.where(category: 0), # 症状
          constitutions: base_query.where(category: 1) # 体質
        }, status: :ok
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/auth/sessions_controller.rb
 ```rb
module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        # APIモードなのでJSON形式でレスポンスを返す
        respond_to :json

        # ログイン（サインイン）
        def create
          user = User.find_by(email: params[:user][:email])

          if user&.valid_password?(params[:user][:password])
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
          (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
          render json: {
            status: 'success',
            message: 'ログアウトしました'
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
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/auth/registrations_controller.rb
 ```rb
module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
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
            }, status: :unprocessable_content
          end
        end

        protected

        def configure_sign_up_params
          devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
        end

        def sign_up_params
          params.require(:user).permit(:name, :email, :password, :password_confirmation)
        end
      end
    end
  end
end
 ```

## File: ./app/controllers/api/v1/auth/passwords_controller.rb
 ```rb
module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # POST /api/v1/auth/password
        def create
          reset_params = params.require(:user).permit(:email)
          self.resource = resource_class.send_reset_password_instructions(reset_params)

          yield resource if block_given?

          if successfully_sent?(resource)
            render json: { message: 'パスワード再設定メールを送信しました。' }, status: :ok
          else
            render json: { error: resource.errors.full_messages }, status: :unprocessable_content
          end
        end

        # PUT /api/v1/auth/password (新パスワード設定)
        # rubocop:disable Metrics/AbcSize
        def update
          update_params = params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
          self.resource = resource_class.reset_password_by_token(update_params)

          yield resource if block_given?

          if resource.errors.empty?
            resource.unlock_access! if unlockable?(resource)
            render json: { message: 'パスワードが正しく変更されました。' }, status: :ok
          else
            render json: { error: resource.errors.full_messages }, status: :unprocessable_content
          end
        end
        # rubocop:enable all
      end
    end
  end
end
 ```

## File: ./app/controllers/application_controller.rb
 ```rb
class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  before_action :configure_permitted_parameters, if: :devise_controller?

  def current_user
    auth_header = request.headers['Authorization']
    token = auth_header.split.last if auth_header.present?

    # トークンがない（未ログイン・ゲスト）場合は nil を返す
    return nil if token.blank? || token == 'null'

    begin
      # トークンがあれば解読してユーザーを探す
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      User.find_by(id: payload['sub'])
    rescue StandardError
      # トークンの期限切れや不正な場合はゲスト（nil）として扱う
      nil
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
 ```

## File: ./app/services/diagnosis_service.rb
 ```rb
class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
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
          score += symptom.category == 1 ? 2 : 1
          matched_count += 1
        end
      end

      # 💊 禁忌・リスク回避ロジック（胃痛時のNSAIDs除外）
      score -= 10 if has_stomach_pain && drug.name == 'バファリンA'

      match_ratio = 0.0
      match_ratio = matched_count.to_f / drug.drug_symptoms.size if drug.drug_symptoms.size.positive? && score.positive?

      final_score = score + match_ratio

      { drug: drug, score: final_score, random: rand, symptom_count: drug.drug_symptoms.size }
    end

    # 🎯 スコアがマイナス（禁忌）の薬だけを除外する（スコア0の無難な薬は残す）
    safe_drugs = scored_drugs.reject { |item| item[:score].negative? }

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
    suggested_drugs = sorted_drugs.pluck(:drug).take(3)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end
  # rubocop:enable all

  private

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def generate_summary(symptoms)
    names = symptoms.map(&:name)
    advices = []

    advices << '空腹でお酒を飲むとアルコールの吸収が急激に進み、胃粘膜も荒れやすくなります。まずは何か軽く胃に入れてからお酒を楽しみましょう。' if names.any? { |n| n.include?('空腹') }

    if names.any? { |n| n.include?('頭痛') || n.include?('乾く') }
      advices << 'アルコールによる脱水が起きているサインです。お酒と同じかそれ以上の水分（水や経口補水液）をこまめに摂ることを強くおすすめします。'
    end

    if names.any? { |n| n.include?('胃') || n.include?('吐き気') || n.include?('ムカムカ') }
      advices << '胃腸がダメージを受けています。消化の良い温かいものを摂り、油物や刺激物は避けて胃を休ませてください。'
    end

    if names.any? { |n| n.include?('弱い') || n.include?('赤く') || n.include?('ふらつく') }
      advices << 'アルコールの分解が追いついていない可能性があります。自分のペースを守り、無理な飲酒や一気飲みは絶対に控えてください。'
    end

    advices << '肝臓の代謝を助ける成分を摂りつつ、こまめな水分補給と十分な休息を心がけてください。' if advices.empty?

    advices.join("\n\n")
  end
  # rubocop:enable all
end
 ```

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

## File: ./spec/models/user_spec.rb
 ```rb
require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーションのテスト' do
    context '正常系（保存できる場合）' do
      it 'すべての必須項目が正しく入力されていれば、ユーザーが保存されること' do
        user = build(:user)
        expect(user).to be_valid
      end
    end

    # ▼ ここから追加 ▼
    context '異常系（保存できない場合）' do
      it 'メールアドレスが空欄だと保存できないこと' do
        # わざとemailを空にしてダミーユーザーを作る
        user = build(:user, email: '')

        # userが valid? ではない（無効である）ことを期待する
        expect(user).not_to be_valid
      end
    end
    # ▲ ここまで追加 ▲
  end
end
 ```

## File: ./spec/rails_helper.rb
 ```rb
# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort('The Rails environment is running in production mode!') if Rails.env.production?
# Uncomment the line below in case you have `--require rails_helper` in the `.rspec` file
# that will avoid rails generators crashing because migrations haven't been run yet
# return unless Rails.env.test?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
# Rails.root.glob('spec/support/**/*.rb').sort_by(&:to_s).each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end
RSpec.configure do |config|
  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  config.fixture_paths = [
    Rails.root.join('spec/fixtures')
  ]

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true
  config.include FactoryBot::Syntax::Methods

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails uses metadata to mix in different behaviours to your tests,
  # for example enabling you to call `get` and `post` in request specs. e.g.:
  #
  #     RSpec.describe UsersController, type: :request do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://rspec.info/features/7-1/rspec-rails
  #
  # You can also this infer these behaviours automatically by location, e.g.
  # /spec/models would pull in the same behaviour as `type: :model` but this
  # behaviour is considered legacy and will be removed in a future version.
  #
  # To enable this behaviour uncomment the line below.
  # config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")
end
 ```

## File: ./spec/services/diagnosis_service_spec.rb
 ```rb
require 'rails_helper'

RSpec.describe DiagnosisService, type: :service do
  describe '#execute' do
    let!(:stomach_pain) { create(:symptom, name: '胃痛', category: 0) }
    let!(:headache) { create(:symptom, name: '頭痛', category: 0) }
    let!(:bufferin) { create(:drug, name: 'バファリンA') }
    let!(:other_drug) { create(:drug, name: '別の胃に優しい薬') }

    context '胃痛の症状が選択されている場合' do
      it 'バファリンAがおすすめ薬（safe_drugs）から除外されること' do
        # 1. Arrange（準備）
        # symptom_ids には症状の「ID」の配列を渡す
        symptom_ids = [stomach_pain.id]
        timing = 0 # 0: 飲酒前（例として設定）

        # 2. Act（実行）
        # newのときに、idの配列とタイミングを渡す！
        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        # 3. Assert（検証）
        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).not_to include('バファリンA')
      end
    end

    context '胃痛がなく、頭痛のみが選択されている場合' do
      it 'バファリンAが除外されずに提案されること' do
        # 1. Arrange（準備）
        symptom_ids = [headache.id]
        timing = 0

        # 2. Act（実行）
        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        # 3. Assert（検証）
        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).to include('バファリンA')
      end
    end
  end
end
 ```

## File: ./spec/factories/drugs.rb
 ```rb
# spec/factories/drugs.rb
FactoryBot.define do
  factory :drug do
    name { 'テスト薬' }
    description { 'テスト用の薬です' }
    pharmacist_advice { '用法用量を守ってください' }
    category { :medicine } # 0
    timing { :any }        # 3
  end
end
 ```

## File: ./spec/factories/users.rb
 ```rb
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "test#{n}@example.com" }
    password { 'password123' }
  end
end
 ```

## File: ./spec/factories/symptoms.rb
 ```rb
# spec/factories/symptoms.rb
FactoryBot.define do
  factory :symptom do
    name { 'テスト症状' }
    category { :symptom } # または 0
  end
end
 ```

## File: ./spec/requests/api/v1/auth/sessions_spec.rb
 ```rb
require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  before do
    host! 'localhost'
  end

  describe 'POST /api/v1/auth/login (ログインAPI)' do
    let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context '正しいメールアドレスとパスワードを送信した場合' do
      it 'ログインに成功し、ステータス200と認証トークンが返ってくること' do
        post '/api/v1/auth/login', params: {
          user: {
            email: user.email,
            password: user.password
          }
        }, as: :json

        # 1. ステータス200 (OK) が返ること
        expect(response).to have_http_status(:success)

        # 2. 返ってきたJSONテキストをRubyで扱えるように変換（パース）する
        json_response = response.parsed_body

        # 3. JSONの中に 'token' が存在していることを確認！
        expect(json_response['token']).to be_present
      end
    end

    context '間違ったパスワードを送信した場合' do
      it 'ログインに失敗し、ステータス401 (Unauthorized) が返ってくること' do
        post '/api/v1/auth/login', params: {
          user: {
            email: user.email,
            password: 'wrong_password'
          }
        }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
 ```

## File: ./spec/spec_helper.rb
 ```rb
# This file was generated by the `rails generate rspec:install` command. Conventionally, all
# specs live under a `spec` directory, which RSpec adds to the `$LOAD_PATH`.
# The generated `.rspec` file contains `--require spec_helper` which will cause
# this file to always be loaded, without a need to explicitly require it in any
# files.
#
# Given that it is always loaded, you are encouraged to keep this file as
# light-weight as possible. Requiring heavyweight dependencies from this file
# will add to the boot time of your test suite on EVERY test run, even for an
# individual file that may not need all of that loaded. Instead, consider making
# a separate helper file that requires the additional dependencies and performs
# the additional setup, and require it from the spec files that actually need
# it.
#
# See https://rubydoc.info/gems/rspec-core/RSpec/Core/Configuration
RSpec.configure do |config|
  # rspec-expectations config goes here. You can use an alternate
  # assertion/expectation library such as wrong or the stdlib/minitest
  # assertions if you prefer.
  config.expect_with :rspec do |expectations|
    # This option will default to `true` in RSpec 4. It makes the `description`
    # and `failure_message` of custom matchers include text for helper methods
    # defined using `chain`, e.g.:
    #     be_bigger_than(2).and_smaller_than(4).description
    #     # => "be bigger than 2 and smaller than 4"
    # ...rather than:
    #     # => "be bigger than 2"
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  # rspec-mocks config goes here. You can use an alternate test double
  # library (such as bogus or mocha) by changing the `mock_with` option here.
  config.mock_with :rspec do |mocks|
    # Prevents you from mocking or stubbing a method that does not exist on
    # a real object. This is generally recommended, and will default to
    # `true` in RSpec 4.
    mocks.verify_partial_doubles = true
  end

  # This option will default to `:apply_to_host_groups` in RSpec 4 (and will
  # have no way to turn it off -- the option exists only for backwards
  # compatibility in RSpec 3). It causes shared context metadata to be
  # inherited by the metadata hash of host groups and examples, rather than
  # triggering implicit auto-inclusion in groups with matching metadata.
  config.shared_context_metadata_behavior = :apply_to_host_groups

  # The settings below are suggested to provide a good initial experience
  # with RSpec, but feel free to customize to your heart's content.
  #   # This allows you to limit a spec run to individual examples or groups
  #   # you care about by tagging them with `:focus` metadata. When nothing
  #   # is tagged with `:focus`, all examples get run. RSpec also provides
  #   # aliases for `it`, `describe`, and `context` that include `:focus`
  #   # metadata: `fit`, `fdescribe` and `fcontext`, respectively.
  #   config.filter_run_when_matching :focus
  #
  #   # Allows RSpec to persist some state between runs in order to support
  #   # the `--only-failures` and `--next-failure` CLI options. We recommend
  #   # you configure your source control system to ignore this file.
  #   config.example_status_persistence_file_path = "spec/examples.txt"
  #
  #   # Limits the available syntax to the non-monkey patched syntax that is
  #   # recommended. For more details, see:
  #   # https://rspec.info/features/3-12/rspec-core/configuration/zero-monkey-patching-mode/
  #   config.disable_monkey_patching!
  #
  #   # Many RSpec users commonly either run the entire suite or an individual
  #   # file, and it's useful to allow more verbose output when running an
  #   # individual spec file.
  #   if config.files_to_run.one?
  #     # Use the documentation formatter for detailed output,
  #     # unless a formatter has already been configured
  #     # (e.g. via a command-line flag).
  #     config.default_formatter = "doc"
  #   end
  #
  #   # Print the 10 slowest examples and example groups at the
  #   # end of the spec run, to help surface which specs are running
  #   # particularly slow.
  #   config.profile_examples = 10
  #
  #   # Run specs in random order to surface order dependencies. If you find an
  #   # order dependency and want to debug it, you can fix the order by providing
  #   # the seed, which is printed after each run.
  #   #     --seed 1234
  #   config.order = :random
  #
  #   # Seed global randomization in this process using the `--seed` CLI option.
  #   # Setting this allows you to use `--seed` to deterministically reproduce
  #   # test failures related to randomization by passing the same `--seed` value
  #   # as the one that triggered the failure.
  #   Kernel.srand config.seed
end
 ```

