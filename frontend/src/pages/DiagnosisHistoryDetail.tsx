import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { 
  ChevronLeft, Pill, AlertCircle, Trash2, Loader2, 
  Lightbulb, MapPin, ShoppingCart, ExternalLink 
} from 'lucide-react';

import PharmacistImg from '../assets/images/pharmacist_advice.png';

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

  // 💡 診断時のタイミング（二日酔いモードかどうか）を判定してテーマカラーを変える
  const isHangoverMode = log.timing === 2;

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 animate-fadeIn">
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
          
          {/* 古いデータ（カラム追加前の診断履歴）でエラーにならないよう、log.result_summary がある時だけ表示 */}
          {log.result_summary && (
            <section>
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img src={PharmacistImg} alt="薬剤師" className="w-full h-full object-contain drop-shadow-sm" />
                  </div>
                  <span className={`text-[10px] font-bold ${isHangoverMode ? 'text-emerald-600' : 'text-blue-600'}`}>
                    薬剤師
                  </span>
                </div>

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
                    {log.result_summary}
                  </div>
                </div>
              </div>
            </section>
          )}

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
              {log.drugs?.map((drug: any) => {
                // 💡 医薬品か食品かの判定と、検索クエリの作成
                const isMedicine = String(drug.category) === 'medicine' || drug.category === 0;
                const mapQuery = isMedicine ? '薬局' : 'コンビニ';
                const amazonUrl = `https://www.amazon.co.jp/s?k=${encodeURIComponent(drug.name)}`;

                return (
                  <div key={drug.id} className="border border-gray-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex gap-4 items-start mb-4">
                      <div className="bg-gray-50 w-16 h-16 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center">
                        <Pill className="text-gray-400 w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">{drug.name}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 inline-block
                          ${isMedicine ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}
                        `}>
                          {isMedicine ? 'ドラッグストア等(医薬品)' : 'コンビニ等(食品・部外品)'}
                        </span>
                        <p className="text-sm text-gray-600 mt-2 font-medium">{drug.description}</p>
                      </div>
                    </div>
                    
                    {/* ▼ 薬ごとのワンポイントアドバイス ▼ */}
                    {drug.pharmacist_advice && (
                      <div className="bg-orange-50/50 p-4 rounded-xl flex items-start gap-3 border border-orange-100 mb-4">
                        <Lightbulb className="text-primary w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-primary block mb-1">薬剤師のワンポイント</span>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
                            {drug.pharmacist_advice}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 mt-2 border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                          target="_blank" rel="noopener noreferrer"
                          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors text-sm ${
                            isMedicine 
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          近くの{mapQuery}を探す
                        </a>
                        <a 
                          href={amazonUrl}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Amazonで探す <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DiagnosisHistoryDetail;