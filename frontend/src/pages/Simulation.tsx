import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  Scale, User, Activity, Plus, AlertTriangle, Clock, ChevronLeft, LogIn, X 
} from 'lucide-react'; // 💡 X（バツ印）アイコンを追加

// 💡 画面トップ用のイラスト
import CalcImg from '../assets/images/calc.png';

// 💡 お酒のイラスト全16種類
import BeerMugImg from '../assets/images/beer_mug.png';
import BeerCanImg from '../assets/images/beer_can.png';
import BeerBottleImg from '../assets/images/beer_bottle.png';
import LemonSourImg from '../assets/images/lemon_sour.png';
import OolongHaiImg from '../assets/images/oolong_hai.png';
import ChuhaiCanImg from '../assets/images/chuhai_can.png';
import StrongCanImg from '../assets/images/strong_can.png';
import HighballImg from '../assets/images/highball.png';
import WineGlassImg from '../assets/images/wine_glass.png';
import WineBottleImg from '../assets/images/wine_bottle.png';
import CocktailImg from '../assets/images/cocktail.png';
import UmeshuRockImg from '../assets/images/umeshu_rock.png';
import UmeshuWaterImg from '../assets/images/umeshu_water.png';
import SakeImg from '../assets/images/sake.png';
import ShochuWaterImg from '../assets/images/shochu_water.png';
import ShochuRockImg from '../assets/images/shochu_rock.png';
import ShotImg from '../assets/images/shot.png';

// 💡 スクロールバーを隠すためのカスタムCSS
const customStyles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

interface SimulationResult {
  pure_alcohol_g: number;
  time_in_hours: number;
  formatted_time: string;
  advice: string;
}

interface DrinkRecord {
  id: string;
  name: string;
  volume: number;
  abv: number;
  image: string;
}

const PRESETS = [
  { name: 'ビール(中ジョッキ)', volume: 500, abv: 5, image: BeerMugImg },
  { name: '缶ビール(350ml)', volume: 350, abv: 5, image: BeerCanImg },
  { name: '瓶ビール(中瓶)', volume: 500, abv: 5, image: BeerBottleImg },
  { name: 'レモンサワー(ジョッキ)', volume: 400, abv: 5, image: LemonSourImg },
  { name: 'ウーロンハイ', volume: 400, abv: 4, image: OolongHaiImg },
  { name: 'チューハイ(缶)', volume: 350, abv: 5, image: ChuhaiCanImg },
  { name: 'ストロング系(缶)', volume: 350, abv: 9, image: StrongCanImg },
  { name: 'ハイボール(缶/ジョッキ)', volume: 350, abv: 7, image: HighballImg },
  { name: 'ワイン(グラス)', volume: 120, abv: 12, image: WineGlassImg },
  { name: 'ボトルワイン(1本)', volume: 750, abv: 12, image: WineBottleImg },
  { name: 'カクテル(カシス等)', volume: 200, abv: 5, image: CocktailImg },
  { name: '梅酒(ロック)', volume: 90, abv: 14, image: UmeshuRockImg },
  { name: '梅酒水割り', volume: 200, abv: 7, image: UmeshuWaterImg },
  { name: '梅酒ソーダ割', volume: 200, abv: 7, image: UmeshuWaterImg }, 
  { name: '日本酒(一合)', volume: 180, abv: 15, image: SakeImg },
  { name: '焼酎(水割り/お湯割り)', volume: 200, abv: 10, image: ShochuWaterImg },
  { name: '焼酎(ロック)', volume: 90, abv: 25, image: ShochuRockImg },
  { name: 'テキーラ/ウイスキー(ショット)', volume: 30, abv: 40, image: ShotImg },
];

const Simulation = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  
  const [weight, setWeight] = useState<string>('60');
  const [gender, setGender] = useState<string>('male');
  const [constitution, setConstitution] = useState<string>('normal');
  const [drinks, setDrinks] = useState<DrinkRecord[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.weight) setWeight(user.weight.toString());
      if (user.gender) setGender(user.gender);
      if (user.constitution) setConstitution(user.constitution);
    } else {
      setWeight(localStorage.getItem('sim_weight') || '60');
      setGender(localStorage.getItem('sim_gender') || 'male');
      setConstitution(localStorage.getItem('sim_constitution') || 'normal');
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('sim_weight', weight);
      localStorage.setItem('sim_gender', gender);
      localStorage.setItem('sim_constitution', constitution);
    }
  }, [weight, gender, constitution, isLoggedIn]);

  const addPresetDrink = (preset: typeof PRESETS[0]) => {
    const newDrink: DrinkRecord = {
      id: Math.random().toString(36).substring(2, 9),
      name: preset.name,
      volume: preset.volume,
      abv: preset.abv,
      image: preset.image,
    };
    setDrinks([...drinks, newDrink]);
  };

  const removeDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
  };

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
      // 結果が出たら少し下にスクロールさせる
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    } catch (error) {
      console.error('シミュレーションに失敗しました', error);
      alert('計算に失敗しました。通信環境を確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 💡 フッターが被らないように pb-48（下の余白）を大きめに設定
    <div className="max-w-2xl mx-auto py-8 px-6 animate-fadeIn pb-48">
      <style>{customStyles}</style>

      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-6">
        <ChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </button>

      <div className="text-center mb-10">
        <div className="w-24 h-24 mx-auto mb-4 animate-bounce-slow">
          <img src={CalcImg} alt="シミュレーション" className="w-full h-full object-contain drop-shadow-sm" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">アルコール分解シミュレーター</h2>
        <p className="text-gray-500 text-sm">あなたの体格に合わせた、お酒が抜ける目安時間を計算します</p>
      </div>

      <div className="space-y-8">
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

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              あなたの情報
            </h3>
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

        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-5 flex items-center gap-2">
            <span className="bg-orange-100 p-2 rounded-lg text-primary text-xl">🍻</span>
            飲んだお酒をタップして追加
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => addPresetDrink(preset)}
                className="flex flex-col items-center justify-center p-4 bg-orange-50/50 border border-orange-100 rounded-2xl hover:bg-orange-100 hover:border-primary transition-colors group"
              >
                <div className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <img src={preset.image} alt={preset.name} className="w-full h-full object-contain drop-shadow-sm" />
                </div>
                <span className="text-xs font-bold text-gray-700 text-center leading-tight">{preset.name}</span>
                <span className="text-[10px] text-gray-500 mt-1">{preset.volume}ml / {preset.abv}%</span>
              </button>
            ))}
          </div>
        </section>

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

      {/* ==============================================================
          💡 ここからが新機能：画面下部に固定される「カート風フローティングバー」
      ============================================================== */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] z-50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          
          {/* 追加したお酒を横スクロールで表示 */}
          {drinks.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-3 mb-1 hide-scrollbar snap-x">
              {drinks.map((drink) => (
                <div key={drink.id} className="snap-start flex-shrink-0 relative bg-orange-50/80 rounded-2xl p-2.5 border border-orange-100 flex items-center gap-3 animate-fadeIn">
                  <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-sm">
                    <img src={drink.image} alt={drink.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="pr-4">
                    <p className="text-xs font-bold text-gray-800 whitespace-nowrap">{drink.name}</p>
                    <p className="text-[10px] text-gray-500">{drink.volume}ml / {drink.abv}%</p>
                  </div>
                  <button 
                    onClick={() => removeDrink(drink.id)} 
                    className="absolute -top-2 -right-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-md border border-gray-100 p-1.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 mb-3 font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4 opacity-50" />
              追加したお酒がここに表示されます
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={drinks.length === 0 || !weight || isLoading}
            className={`w-full py-4 rounded-full font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-2 ${
              drinks.length === 0 || !weight
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-orange-500 to-primary text-white hover:shadow-xl hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? '計算中...' : drinks.length > 0 ? `${drinks.length}杯で分解時間を計算する` : '分解時間を計算する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;