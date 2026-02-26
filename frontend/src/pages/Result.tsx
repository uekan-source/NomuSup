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

export default Result;