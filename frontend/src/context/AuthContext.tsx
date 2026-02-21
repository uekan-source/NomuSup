import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

// 1. 型定義に user を追加し、login がデータを受け取れるようにする
interface AuthContextType {
  isLoggedIn: boolean;
  user: any; // 必要に応じて { id: string; name: string; email: string } など定義してください
  login: (token: string, userData: any) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); // 2. ユーザー情報を保持するステートを追加

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

  // 3. ログイン時にユーザー情報もセットするように修正
  const login = (token: string, userData: any) => {
    localStorage.setItem('token', token);
    setUser(userData); 
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null); // 4. ログアウト時にクリア
    setIsLoggedIn(false);
    window.location.href = '/';
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
};