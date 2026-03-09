import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Symptom } from '../types';
import DiagnosisHeader from '../components/shared/DiagnosisHeader';
// 項目に割り当てるアイコンを大量にインポート
import { 
  CheckCircle2, Loader2, ArrowRight, Sparkles, 
  Utensils, Calendar, Beer, Activity, ThermometerSun, 
  Wind, Droplets, Soup, AlertTriangle, Brain, Frown, 
  BatteryWarning, CloudRain, HeartPulse
} from 'lucide-react';

const Diagnosis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timing = searchParams.get('timing') || '0';

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [constitutions, setConstitutions] = useState<Symptom[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ウィザードのステップ（1〜3）
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

  // --- 💡 データの振り分けロジック ---
  // DBのカテゴリは「0:症状, 1:体質」のみなので、フロントエンドの文字一致で「予定」「気分」などを抽出します
  const getStepData = () => {
    if (timing === '0') {
      // これから飲む: 1.予定, 2.気分(状況), 3.体質
      return {
        header: [{ id: 1, label: '予定' }, { id: 2, label: '気分' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }],
        step1: symptoms.filter(s => s.name.includes('予定') || s.name.includes('炭酸')),
        step2: symptoms.filter(s => s.name.includes('空腹')),
        step3: constitutions,
        title1: '今日の予定は？', title2: '今の気分・状況は？', title3: 'あなたの体質は？'
      };
    } else {
      // 飲みすぎた・翌朝: 1.気分(感覚), 2.症状, 3.体質
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

  // --- 💡 アイコンの自動マッピング ---
  // 選択肢のテキストに含まれるキーワードから、モダンなアイコンを割り当てます
  const getIconForText = (text: string, isSelected: boolean) => {
    const iconClass = `w-7 h-7 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-primary'}`;
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
    return <Sparkles className={iconClass} />; // デフォルト
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-primary">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    // 背景をほんのりオレンジのグラデーションにしてモダンに
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 pt-6 pb-32 px-6">
      <div className="max-w-xl mx-auto">
        
        {/* 動的ステップヘッダー */}
        <DiagnosisHeader currentStep={wizardStep} steps={currentConfig.header} />

        <div className="animate-fadeIn">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3 drop-shadow-sm">{currentTitle}</h2>
            <p className="text-orange-600/80 text-sm font-medium">当てはまるものをすべて選んでください</p>
          </div>
          
          {/* --- 💡 縦並びのモダンなカードUI --- */}
          {/* flex-col で縦に並べ、gap-4 で隙間を空ける */}
          <div className="flex flex-col gap-4">
            {currentItems.length === 0 ? (
              <p className="text-center text-gray-400 py-10">該当する項目がありません</p>
            ) : (
              currentItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <button 
                    key={item.id} 
                    onClick={() => toggleSymptom(item.id)} 
                    className={`group flex items-center p-5 rounded-3xl border-2 text-left transition-all duration-300 w-full overflow-hidden relative
                      ${isSelected 
                        ? 'border-transparent bg-white shadow-lg shadow-orange-200/50 transform scale-[1.02] ring-2 ring-primary' 
                        : 'border-white bg-white shadow-sm hover:shadow-md hover:border-orange-100'
                      }`}
                  >
                    {/* 選択時の背景アクセント（左側の色付き帯） */}
                    <div className={`absolute left-0 top-0 h-full w-2 transition-all duration-300 ${isSelected ? 'bg-primary' : 'bg-transparent'}`}></div>

                    {/* アイコン部分（選択時はオレンジ背景に白アイコン） */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 transition-all duration-300 z-10
                      ${isSelected ? 'bg-gradient-to-br from-orange-400 to-primary shadow-inner' : 'bg-orange-50 group-hover:bg-orange-100'}
                    `}>
                      {getIconForText(item.name, isSelected)}
                    </div>

                    <span className={`text-lg font-bold flex-grow z-10 transition-colors duration-300 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {item.name}
                    </span>

                    {/* 右端のチェックマーク */}
                    <CheckCircle2 className={`w-6 h-6 z-10 transition-all duration-300 ${isSelected ? 'text-primary scale-110 opacity-100' : 'text-gray-200 scale-90 opacity-0 group-hover:opacity-50'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* --- Sticky（画面下部固定）ナビゲーションボタン --- */}
        <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 z-50 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-xl mx-auto flex gap-3">
            
            {wizardStep > 1 && (
              <button 
                onClick={() => setWizardStep(prev => (prev - 1) as 1 | 2 | 3)} 
                className="px-6 py-4 rounded-full font-bold text-gray-500 bg-white border-2 border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-all whitespace-nowrap shadow-sm"
              >
                前へ
              </button>
            )}

            <button 
              onClick={wizardStep < 3 ? () => setWizardStep(prev => (prev + 1) as 1 | 2 | 3) : handleSubmit}
              className={`flex-grow py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2
                ${selectedIds.length === 0 && wizardStep === 3 // 最後のステップで何も選ばれていない時だけ無効化
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200' 
                  : 'bg-gradient-to-r from-orange-500 to-primary text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:-translate-y-1'
                }`}
            >
              {wizardStep < 3 ? (
                <>次へ進む （{selectedIds.length}件選択中）<ArrowRight className="w-5 h-5" /></>
              ) : selectedIds.length === 0 ? (
                '1つ以上選択してください'
              ) : (
                <>診断結果を見る （{selectedIds.length}件選択中<Sparkles className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Diagnosis;