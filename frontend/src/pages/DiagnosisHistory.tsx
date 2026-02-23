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

export default DiagnosisHistory;