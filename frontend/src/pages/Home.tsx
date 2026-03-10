import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, History, ChevronRight, GlassWater, ListChecks, Sparkles, Beer, Coffee, Calculator } from 'lucide-react';

const Home = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 1, title: 'いまの状態を選ぶ', desc: '「これから飲む」「二日酔い」など、あなたの状況を選択します。', icon: <GlassWater className="w-10 h-10" /> },
    { id: 2, title: '症状をタップ', desc: '当てはまる症状や、あなたの体質をチェックリストから選びます。', icon: <ListChecks className="w-10 h-10" /> },
    { id: 3, title: '最適な対策がわかる', desc: '薬剤師監修のロジックで、今すぐできるケアや市販薬をご提案します。', icon: <Sparkles className="w-10 h-10" /> }
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % steps.length), 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="flex flex-col animate-fadeIn bg-white">
      
      {/* 1. ヒーローセクション（ビタミンオレンジのグラデーション） */}
      <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300 pt-20 pb-36 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/30 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
            最高の一杯と、<br className="md:hidden" />
            最高の翌朝を。
          </h1>
          <p className="text-lg text-orange-50 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            今のあなたの状態を選ぶだけ。<br className="hidden md:block"/>
            薬剤師監修のロジックが、最適な対策を即座に導き出します。
          </p>
        </div>
      </section>

      {/* 2. ダイレクト分岐カード */}
      <section className="relative z-20 max-w-5xl mx-auto px-6 -mt-24 mb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <Link to="/diagnosis?timing=0" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <GlassWater className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">これから飲む</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">事前の準備で<br/>明日の自分を救う</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/diagnosis?timing=1" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Beer className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">飲みすぎた</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">今のうちにできる<br/>即効ケアを提案</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
          <Link to="/diagnosis?timing=2" className="group flex flex-col items-center bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-orange-200/50 border-2 border-transparent hover:border-orange-400 transition-all duration-300 hover:-translate-y-1 no-underline">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 text-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <Coffee className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">翌朝がつらい</h3>
            <p className="text-sm text-gray-500 text-center mb-6 flex-grow">二日酔いの症状を<br/>ピンポイントで緩和</p>
            <div className="flex items-center text-primary font-bold text-sm bg-orange-50 px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
              診断へ進む <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-20 w-full relative z-20">
        <Link to="/simulation" className="group block bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 no-underline">
          <div className="bg-gray-900 rounded-[1.4rem] px-6 py-8 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            {/* 背景の装飾光 */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex items-center gap-5 md:gap-6 relative z-10 w-full md:w-auto">
              <div className="bg-gradient-to-br from-orange-400 to-primary w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calculator className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-grow">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
                  アルコール分解シミュレーター
                  <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>
                </h3>
                <p className="text-gray-400 text-xs md:text-sm">
                  飲んだ量から、お酒が完全に抜ける時間を計算します
                </p>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex-shrink-0 relative z-10">
              <div className="bg-white/10 hover:bg-white/20 text-white w-full md:w-auto px-6 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-sm transition-colors border border-white/10">
                計算してみる <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 3. 使い方は簡単３ステップ */}
      {/* 【変更点】全幅で明るいグラデーションを敷き、装飾の光（blur）を追加 */}
      <section className="py-20 px-6 w-full bg-gradient-to-b from-orange-50 via-amber-100/60 to-orange-50 relative overflow-hidden">
        {/* 背景のうっすらとした円形アクセント */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-orange-200/50 border border-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">使い方は簡単３ステップ</h2>
              <p className="text-orange-600/80 mt-3 font-medium">会員登録なしでも、今すぐ診断できます</p>
            </div>
            <div className="relative h-64 w-full max-w-lg mx-auto">
              <div key={activeStep} className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-orange-50/50 to-white border border-orange-100/50 rounded-3xl animate-fadeIn">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-md">
                  {steps[activeStep].id}
                </div>
                <div className="mt-4 mb-5 bg-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary">
                  {steps[activeStep].icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-800">{steps[activeStep].title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{steps[activeStep].desc}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {steps.map((_, index) => (
                <button key={index} onClick={() => setActiveStep(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === index ? 'bg-primary w-8' : 'bg-orange-200 hover:bg-orange-300'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 特徴セクション */}
      <section className="py-16 px-6 bg-orange-50/30 border-t border-orange-100/50 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nomu-Supの特徴</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">薬剤師監修</h3>
              <p className="text-sm text-gray-500 leading-relaxed">あなたの体質や症状に合わせ、医学的視点から最適な薬や成分を提案。</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Zap className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">直感的な診断</h3>
              <p className="text-sm text-gray-500 leading-relaxed">「飲む前・中・後」を選ぶだけ。たった数問で今のあなたに最適なケアが判明。</p>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <History className="text-primary w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg mb-3 text-gray-800">履歴を保存</h3>
              <p className="text-sm text-gray-500 leading-relaxed">ログインすれば過去の診断履歴を保存。自分に合う対策がいつでも見返せる。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;