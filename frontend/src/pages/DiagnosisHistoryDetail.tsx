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

export default DiagnosisHistoryDetail;