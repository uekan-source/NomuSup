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

export default Result;