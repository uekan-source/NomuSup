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

// ==========================================
// 💡 全30枚のイラストをインポート
// ==========================================
// 1. 予定 (timing=0)
import PlanHeavyDrinkingImg from '../assets/images/plan_heavy_drinking.png';
import PlanCarbonatedImg from '../assets/images/plan_carbonated.png';
import PlanMixingDrinksImg from '../assets/images/plan_mixing_drinks.png';
import PlanOilyFoodImg from '../assets/images/plan_oily_food.png';
import PlanImportantEventImg from '../assets/images/plan_important_event.png';

// 2. コンディション (timing=0)
import CondYesterdayHangoverImg from '../assets/images/cond_yesterday_hangover.png';
import CondHungryImg from '../assets/images/cond_hungry.png';
import CondStomachIssueImg from '../assets/images/cond_stomach_issue.png';
import CondDehydratedImg from '../assets/images/cond_dehydrated.png';
import CondMouthSkinImg from '../assets/images/cond_mouth_skin.png';

// 3. 体質 (timing=0, 1)
import CondFlushImg from '../assets/images/cond_flush.png';
import CondHangoverImg from '../assets/images/cond_hangover.png';
import CondStomachImg from '../assets/images/cond_stomach.png';
import CondEdemaImg from '../assets/images/cond_edema.png';
import CondHeadacheImg from '../assets/images/cond_headache.png';

// 4. 飲みすぎた: 気分 (timing=1)
import MoodRamenImg from '../assets/images/mood_ramen.png';
import MoodRefreshImg from '../assets/images/mood_refresh.png';
import MoodTipsyImg from '../assets/images/mood_tipsy.png';
import MoodThirstyImg from '../assets/images/mood_thirsty.png';
import MoodTiredImg from '../assets/images/mood_tired.png';

// 5. 飲みすぎた: 症状 (timing=1)
import CondNauseaImg from '../assets/images/cond_nausea.png';
import CondDizzinessImg from '../assets/images/cond_dizziness.png';
import CondThirstImg from '../assets/images/cond_thirst.png';
import CondStomachAcheImg from '../assets/images/cond_stomach_ache.png';
import CondFeverImg from '../assets/images/cond_fever.png';

// 6. 翌朝: 気分 (timing=2)
import MoodHangoverHeavyBodyImg from '../assets/images/mood_hangover_heavy_body.png';
import MoodHangoverThirstImg from '../assets/images/mood_hangover_thirst.png';
import MoodHangoverNoAppetiteImg from '../assets/images/mood_hangover_no_appetite.png';
import MoodHangoverRegretImg from '../assets/images/mood_hangover_regret.png';
import MoodHangoverBrainFogImg from '../assets/images/mood_hangover_brain_fog.png';

// 7. 翌朝: 症状 (timing=2)
import CondHangoverHeadacheImg from '../assets/images/cond_hangover_headache.png';
import CondHangoverNauseaImg from '../assets/images/cond_hangover_nausea.png';
import CondHangoverLethargyImg from '../assets/images/cond_hangover_lethargy.png';
import CondHangoverEdemaImg from '../assets/images/cond_hangover_edema.png';
import CondHangoverDiarrheaImg from '../assets/images/cond_hangover_diarrhea.png';


const Diagnosis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timing = searchParams.get('timing') || '0';

  const isHangoverMode = timing === '2';

  const [moods, setMoods] = useState<Symptom[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [constitutions, setConstitutions] = useState<Symptom[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const maxStep = isHangoverMode ? 2 : 3;
  const [wizardStep, setWizardStep] = useState<number>(1);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await client.get(`/symptoms?timing=${timing}`);
        setMoods(response.data.moods);
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
      return {
        header: [{ id: 1, label: '気分' }, { id: 2, label: '症状' }, { id: 3, label: '結果' }],
        step1: moods,
        step2: symptoms,
        step3: [],
        title1: '今の気分は？', title2: '具体的な症状は？', title3: ''
      };
    }
  };

  const currentConfig = getStepData();
  const currentItems = wizardStep === 1 ? currentConfig.step1 : wizardStep === 2 ? currentConfig.step2 : currentConfig.step3;
  const currentTitle = wizardStep === 1 ? currentConfig.title1 : wizardStep === 2 ? currentConfig.title2 : currentConfig.title3;

  // ==========================================
  // 💡 テキストと画像を紐づけるロジック
  // ==========================================
  const getImageForText = (text: string) => {
    // --- 1. 予定 ---
    if (text.includes('深酒')) return PlanHeavyDrinkingImg;
    if (text.includes('炭酸')) return PlanCarbonatedImg;
    if (text.includes('チャンポン') || text.includes('種類')) return PlanMixingDrinksImg;
    if (text.includes('脂っこい')) return PlanOilyFoodImg;
    if (text.includes('外せない')) return PlanImportantEventImg;

    // --- 2. コンディション ---
    if (text.includes('残っている')) return CondYesterdayHangoverImg;
    if (text.includes('空腹')) return CondHungryImg;
    if (text.includes('胃の調子')) return CondStomachIssueImg;
    if (text.includes('渇いている・脱水')) return CondDehydratedImg;
    if (text.includes('口内炎')) return CondMouthSkinImg;

    // --- 3. 体質 ---
    if (text.includes('赤くなる体質')) return CondFlushImg;
    if (text.includes('残りやすくなった体質')) return CondHangoverImg;
    if (text.includes('もたれやすい体質')) return CondStomachImg;
    if (text.includes('むくむ体質')) return CondEdemaImg;
    if (text.includes('頭痛が起きる体質')) return CondHeadacheImg;

    // --- 4. 飲みすぎた: 気分 ---
    if (text.includes('締めを食べたい')) return MoodRamenImg;
    if (text.includes('ガブ飲み')) return MoodRefreshImg;
    if (text.includes('フワフワ')) return MoodTipsyImg;
    if (text.includes('飲み足りない')) return MoodThirstyImg;
    if (text.includes('横になりたい・だるい')) return MoodTiredImg;

    // --- 5. 飲みすぎた: 症状 ---
    if (text.includes('ムカムカする吐き気')) return CondNauseaImg;
    if (text.includes('足元がふらつく')) return CondDizzinessImg;
    if (text.includes('異常に喉が渇く')) return CondThirstImg;
    if (text.includes('胃がキリキリ')) return CondStomachAcheImg;
    if (text.includes('異常に熱い')) return CondFeverImg;

    // --- 6. 翌朝: 気分 ---
    if (text.includes('起き上がれない')) return MoodHangoverHeavyBodyImg;
    if (text.includes('とにかく水分が欲しい')) return MoodHangoverThirstImg;
    if (text.includes('何も食べたくない')) return MoodHangoverNoAppetiteImg;
    if (text.includes('記憶が曖昧')) return MoodHangoverRegretImg;
    if (text.includes('頭がボーッと')) return MoodHangoverBrainFogImg;

    // --- 7. 翌朝: 症状 ---
    if (text.includes('ズキズキ')) return CondHangoverHeadacheImg;
    if (text.includes('吐き気・胃もたれ')) return CondHangoverNauseaImg;
    if (text.includes('極度にだるい')) return CondHangoverLethargyImg;
    if (text.includes('むくみがひどい')) return CondHangoverEdemaImg;
    if (text.includes('下痢')) return CondHangoverDiarrheaImg;

    return null; // 画像がない場合はnull
  };

  // 万が一画像がない場合のフォールバックアイコン
  const getIconForText = (text: string, isSelected: boolean) => {
    const defaultColor = isHangoverMode ? 'text-cyan-500' : 'text-primary';
    const iconClass = `w-7 h-7 flex-shrink-0 transition-colors duration-300 ${isSelected ? 'text-white' : defaultColor}`;
    
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
                // 💡 アイテム名から対応する画像を取得
                const imageSrc = getImageForText(item.name);

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

                    {/* 画像がある場合はイラストを、ない場合はフォールバックのアイコンを表示 */}
                    {imageSrc ? (
                      <div className={`w-16 h-16 flex items-center justify-center mr-5 transition-transform duration-300 group-hover:scale-110 z-10`}>
                        <img src={imageSrc} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 transition-all duration-300 z-10
                        ${isHangoverMode 
                          ? (isSelected ? 'bg-gradient-to-br from-blue-400 to-cyan-400 shadow-inner' : 'bg-blue-50 group-hover:bg-blue-100')
                          : (isSelected ? 'bg-gradient-to-br from-orange-400 to-primary shadow-inner' : 'bg-orange-50 group-hover:bg-orange-100')
                        }
                      `}>
                        {getIconForText(item.name, isSelected)}
                      </div>
                    )}

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