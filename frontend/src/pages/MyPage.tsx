import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { User, History, ChevronRight, LogOut, Loader2 } from 'lucide-react';

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
        // Railsの UsersController#show (get 'me') を叩く
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
        <button className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-primary transition-all group">
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-orange-50 transition-colors">
              <History className="text-gray-600 group-hover:text-primary w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">診断履歴を見る</span>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-primary" />
        </button>

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

export default MyPage;