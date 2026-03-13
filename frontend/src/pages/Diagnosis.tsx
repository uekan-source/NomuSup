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

  // 💡 category: 2 (気分・予定) 用のstateを追加
  const [moods, setMoods] = useState<Symptom[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [constitutions, setConstitutions] = useState<Symptom[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 💡 timing=2の時は、入力ステップを2つ（気分・症状）で終了させる
  const maxStep = isHangoverMode ? 2 : 3;
  const [wizardStep, setWizardStep] = useState<number>(1);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await client.get(`/symptoms?timing=${timing}`);
        setMoods(response.data.moods);                 // 💡 追加
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

  // 💡 複雑なフィルター処理がなくなり、APIのデータをそのまま渡すだけに！
  const getStepData = () => {
    if (timing === '0') {
      return {
        header: [{ id: 1, label: '予定' }, { id: 2, label: '症状' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }],
        step1: moods,
        step2: symptoms,
        step3: constitutions,
        title1: '今日の予定は？', title2: '今の状況・コンディションは？', title3: 'あなたの体質は？'
      };
    } else if (timing === '1') {
      return {
        header: [{ id: 1, label: '気分' }, { id: 2, label: '症状' }, { id: 3, label: '体質' }, { id: 4, label: '結果' }],
        step1: moods,
        step2: symptoms,
        step3: constitutions,
        title1: '今の気分は？', title2: '具体的な症状は？', title3: 'あなたの体質は？'
      };
    } else {
      // 💡 翌朝 (timing=2) は体質を省略し、全3ステップに変更
      return {
        header: [{ id: 1, label: '気分' }, { id: 2, label: '症状' }, { id: 3, label: '結果' }],
        step1: moods,
        step2: symptoms,
        step3: [], // 使用しない
        title1: '今の気分は？', title2: '具体的な症状は？', title3: ''
      };
    }
  };

  const currentConfig = getStepData();
  const currentItems = wizardStep === 1 ? currentConfig.step1 : wizardStep === 2 ? currentConfig.step2 : currentConfig.step3;
  const currentTitle = wizardStep === 1 ? currentConfig.title1 : wizardStep === 2 ? currentConfig.title2 : currentConfig.title3;

  const getIconForText = (text: string, isSelected: boolean) => {
    const defaultColor = isHangoverMode ? 'text-cyan-500' : 'text-primary';
    const iconClass = `w-7 h-7 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'text-white' : defaultColor}`;
    
    // キーワードによるアイコン出し分けはそのまま維持
    if (text.includes('空腹')) return <Utensils className={iconClass} />;
    if (text.includes('予定')) return <Calendar className={iconClass} />;
    if (text.includes('炭酸') || text.includes('お酒')) return <Beer className={iconClass} />;
    if (text.includes('弱い')) return <Activity className={iconClass} />;
    if (text.includes('赤く') || text.includes('熱い')) return <ThermometerSun className={iconClass} />;
    if (text.includes('ふらつく')) return <Wind className={iconClass} />;
    if (text.includes('渇く') || text.includes('水分')) return <Droplets className={iconClass} />;
    if (text.includes('締め') || text.includes('食事')) return <Soup className={iconClass} />;
    if (text.includes('違和感') || text.includes('残って')) return <AlertTriangle className={iconClass} />;
    if (text.includes('頭痛')) return <Brain className={iconClass} />;
    if (text.includes('吐き気') || text.includes('気分') || text.includes('後悔')) return <Frown className={iconClass} />;
    if (text.includes('だるい') || text.includes('重い')) return <BatteryWarning className={iconClass} />;
    if (text.includes('むくみ')) return <CloudRain className={iconClass} />;
    if (text.includes('胃痛') || text.includes('もたれ') || text.includes('下痢')) return <HeartPulse className={iconClass} />;
    return isHangoverMode ? <Droplet className={iconClass} /> : <Sparkles className={iconClass} />;
  };

  if (loading) return (
    <div className={`flex justify-center items-center h-screen ${isHangoverMode ? 'text-cyan-500 bg-blue-50/30' : 'text-primary'}`}>
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className={`min-h-screen pt-6 pb-32 px-6 transition-colors duration-500 ${
      isHangoverMode 
        ? 'bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80' 
        : 'bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30'
    }`}>
      <div className="max-w-xl mx-auto">
        
        <DiagnosisHeader 
          currentStep={wizardStep} 
          steps={currentConfig.header} 
          theme={isHangoverMode ? 'blue' : 'orange'} 
        />

        <div className="animate-fadeIn">
          <div className="text-center mb-10">
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

        {/* --- Sticky ナビゲーションボタン --- */}
        <div className={`fixed bottom-0 left-0 w-full p-4 z-50 transition-colors duration-500 bg-white/80 backdrop-blur-xl border-t ${
          isHangoverMode ? 'border-blue-50 shadow-[0_-10px_30px_-15px_rgba(0,100,255,0.05)]' : 'border-gray-100 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]'
        }`}>
          <div className="max-w-xl mx-auto flex gap-3">
            
            {wizardStep > 1 && (
              <button 
                onClick={() => setWizardStep(prev => prev - 1)} 
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
              // 💡 3ではなく、maxStep (2 または 3) で判定するように変更
              onClick={wizardStep < maxStep ? () => setWizardStep(prev => prev + 1) : handleSubmit}
              disabled={selectedIds.length === 0 && wizardStep === maxStep}
              className={`flex-grow py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2
                ${selectedIds.length === 0 && wizardStep === maxStep
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  : (isHangoverMode
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:-translate-y-1'
                      : 'bg-gradient-to-r from-orange-500 to-primary text-white shadow-lg shadow-orange-300/50 hover:shadow-xl hover:-translate-y-1')
                }`}
            >
              {wizardStep < maxStep ? (
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

export default Diagnosis;