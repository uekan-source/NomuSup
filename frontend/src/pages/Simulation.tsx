import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Calculator, Scale, User, Activity, Beer, Wine, GlassWater, 
  Trash2, Plus, AlertTriangle, Clock, ChevronLeft, Zap, Martini, LogIn
} from 'lucide-react';

// APIからのレスポンスの型
interface SimulationResult {
  pure_alcohol_g: number;
  time_in_hours: number;
  formatted_time: string;
  advice: string;
}

// 追加したお酒の型
interface DrinkRecord {
  id: string;
  name: string;
  volume: number;
  abv: number;
}

// プリセットの定義（18種類）
const PRESETS = [
  // --- ビール・サワー系 ---
  { name: 'ビール(中ジョッキ)', volume: 500, abv: 5, icon: <Beer className="w-5 h-5" /> },
  { name: '缶ビール(350ml)', volume: 350, abv: 5, icon: <Beer className="w-5 h-5" /> },
  { name: '瓶ビール(中瓶)', volume: 500, abv: 5, icon: <Beer className="w-5 h-5" /> },
  { name: 'レモンサワー(ジョッキ)', volume: 400, abv: 5, icon: <GlassWater className="w-5 h-5" /> },
  { name: 'ウーロンハイ', volume: 400, abv: 4, icon: <GlassWater className="w-5 h-5" /> },
  
  // --- 缶チューハイ系 ---
  { name: 'チューハイ(缶)', volume: 350, abv: 5, icon: <GlassWater className="w-5 h-5" /> },
  { name: 'ストロング系(缶)', volume: 350, abv: 9, icon: <Zap className="w-5 h-5" /> },
  { name: 'ハイボール(缶/ジョッキ)', volume: 350, abv: 7, icon: <GlassWater className="w-5 h-5" /> },
  
  // --- ワイン系 ---
  { name: 'ワイン(グラス)', volume: 120, abv: 12, icon: <Wine className="w-5 h-5" /> },
  { name: 'ボトルワイン(1本)', volume: 750, abv: 12, icon: <Wine className="w-5 h-5" /> },
  
  // --- カクテル・梅酒 ---
  { name: 'カクテル(カシス等)', volume: 200, abv: 5, icon: <Martini className="w-5 h-5" /> },
  { name: '梅酒(ロック)', volume: 90, abv: 14, icon: <GlassWater className="w-5 h-5" /> },
  { name: '梅酒水割り', volume: 200, abv: 7, icon: <GlassWater className="w-5 h-5" /> },
  { name: '梅酒ソーダ割', volume: 200, abv: 7, icon: <GlassWater className="w-5 h-5" /> },
  
  // --- 焼酎・日本酒 ---
  { name: '日本酒(一合)', volume: 180, abv: 15, icon: <GlassWater className="w-5 h-5" /> },
  { name: '焼酎(水割り/お湯割り)', volume: 200, abv: 10, icon: <GlassWater className="w-5 h-5" /> },
  { name: '焼酎(ロック)', volume: 90, abv: 25, icon: <GlassWater className="w-5 h-5" /> },
  
  // --- ハードリカー ---
  { name: 'テキーラ/ウイスキー(ショット)', volume: 30, abv: 40, icon: <Martini className="w-5 h-5" /> },
];

const Simulation = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  // ユーザーの基本情報（初期値は一旦固定、useEffectで上書きする）
  const [weight, setWeight] = useState<string>('60');
  const [gender, setGender] = useState<string>('male');
  const [constitution, setConstitution] = useState<string>('normal');
  
  // 飲んだお酒のリスト
  const [drinks, setDrinks] = useState<DrinkRecord[]>([]);
  
  // 結果とローディング状態
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // コンポーネントマウント時やユーザー情報変更時に値をセット
  useEffect(() => {
    if (isLoggedIn && user) {
      // ログインしていて、プロフに値があればそれを優先
      if (user.weight) setWeight(user.weight.toString());
      if (user.gender) setGender(user.gender);
      if (user.constitution) setConstitution(user.constitution);
    } else {
      // 未ログインならlocalStorageから復元
      setWeight(localStorage.getItem('sim_weight') || '60');
      setGender(localStorage.getItem('sim_gender') || 'male');
      setConstitution(localStorage.getItem('sim_constitution') || 'normal');
    }
  }, [isLoggedIn, user]);

  // ユーザーが手動で変更したら、未ログイン時用に一応localStorageにも保存
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('sim_weight', weight);
      localStorage.setItem('sim_gender', gender);
      localStorage.setItem('sim_constitution', constitution);
    }
  }, [weight, gender, constitution, isLoggedIn]);

  // プリセットからお酒を追加する関数
  const addPresetDrink = (preset: typeof PRESETS[0]) => {
    const newDrink: DrinkRecord = {
      id: Math.random().toString(36).substring(2, 9),
      name: preset.name,
      volume: preset.volume,
      abv: preset.abv,
    };
    setDrinks([...drinks, newDrink]);
  };

  // お酒をリストから削除する関数
  const removeDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
  };

  // 計算実行
  const handleCalculate = async () => {
    if (drinks.length === 0) {
      alert('お酒を追加してください');
      return;
    }
    
    setIsLoading(true);
    setResult(null);

    try {
      const response = await client.post('/simulations/calculate', {
        weight: Number(weight),
        gender,
        constitution,
        drinks: drinks.map(d => ({ volume: d.volume, abv: d.abv }))
      });
      
      setResult(response.data.data);
      // 結果が見やすいように少しスクロール
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } catch (error) {
      console.error('シミュレーションに失敗しました', error);
      alert('計算に失敗しました。通信環境を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 animate-fadeIn pb-32">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-6">
        <ChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </button>

      <div className="text-center mb-10">
        <div className="inline-block bg-orange-100 p-4 rounded-full mb-4 text-primary shadow-sm">
          <Calculator className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">アルコール分解シミュレーター</h2>
        <p className="text-gray-500 text-sm">あなたの体格に合わせた、お酒が抜ける目安時間を計算します</p>
      </div>

      <div className="space-y-8">
        
        {/* 未ログインユーザーへの訴求バナー */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-primary shadow-sm flex-shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">ログインして便利に使おう！</p>
                <p className="text-xs text-gray-600 mt-0.5">体重や体質が自動保存され、毎回の入力が不要になります。</p>
              </div>
            </div>
            <Link 
              to="/login" 
              className="whitespace-nowrap bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-600 transition-colors shadow-sm"
            >
              ログイン / 登録
            </Link>
          </div>
        )}

        {/* --- 1. あなたの情報 --- */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              あなたの情報
            </h3>
            {/* ログイン中で値が入っている場合のアピール */}
            {isLoggedIn && user?.weight && (
              <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">
                プロフィールから自動入力済み
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Scale className="w-4 h-4 text-gray-400" /> 体重 (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors ${gender === 'male' ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}
                >
                  男性
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors ${gender === 'female' ? 'bg-pink-50 text-pink-600 border-2 border-pink-200' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}
                >
                  女性
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Activity className="w-4 h-4 text-gray-400" /> お酒への強さ（体質）
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setConstitution('normal')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${constitution === 'normal' ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                >
                  普通・強い
                </button>
                <button
                  onClick={() => setConstitution('weak')}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${constitution === 'weak' ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}
                >
                  弱い・すぐ赤くなる
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- 2. 飲んだお酒 --- */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
            <Beer className="w-5 h-5 text-primary" />
            飲んだお酒を追加
          </h3>

          {/* プリセットボタン */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => addPresetDrink(preset)}
                className="flex flex-col items-center justify-center p-3 bg-orange-50/50 border border-orange-100 rounded-2xl hover:bg-orange-100 hover:border-primary transition-colors group"
              >
                <div className="text-primary mb-1 group-hover:scale-110 transition-transform">
                  {preset.icon}
                </div>
                <span className="text-xs font-bold text-gray-700">{preset.name}</span>
                <span className="text-[10px] text-gray-500">{preset.volume}ml / {preset.abv}%</span>
              </button>
            ))}
          </div>

          {/* 追加されたお酒リスト */}
          <div className="bg-gray-50 rounded-2xl p-4 min-h-[100px]">
            {drinks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6">
                <Plus className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">上から飲んだお酒をタップして追加</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {drinks.map((drink) => (
                  <li key={drink.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg text-primary">
                        <Beer className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{drink.name}</p>
                        <p className="text-xs text-gray-500">{drink.volume}ml / アルコール{drink.abv}%</p>
                      </div>
                    </div>
                    <button onClick={() => removeDrink(drink.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* --- 計算ボタン --- */}
        <button
          onClick={handleCalculate}
          disabled={drinks.length === 0 || !weight || isLoading}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${
            drinks.length === 0 || !weight
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-primary text-white hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1'
          }`}
        >
          {isLoading ? '計算中...' : '分解時間を計算する'}
        </button>

        {/* --- 3. 結果表示エリア --- */}
        {result && (
          <section className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-2xl animate-fadeSlideInUp text-white relative overflow-hidden mt-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10">
              <h3 className="text-center font-bold text-gray-300 mb-8 tracking-widest text-sm">SIMULATION RESULT</h3>
              
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                  <p className="text-gray-400 text-sm font-medium mb-1">摂取した純アルコール</p>
                  <p className="text-4xl font-extrabold text-white">
                    {result.pure_alcohol_g} <span className="text-lg text-gray-400 font-normal">g</span>
                  </p>
                </div>
                
                <div className="flex-1 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-primary h-full"></div>
                  <p className="text-gray-400 text-sm font-medium mb-1 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" /> 完全に抜けるまでの目安
                  </p>
                  <p className="text-3xl font-extrabold text-primary drop-shadow-md">
                    {result.formatted_time}
                  </p>
                </div>
              </div>

              <div className="bg-orange-500/20 border border-orange-500/30 p-5 rounded-2xl">
                <h4 className="flex items-center gap-2 font-bold text-orange-400 mb-3 text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  薬剤師からのアドバイス
                </h4>
                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap font-medium">
                  {result.advice}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Simulation;