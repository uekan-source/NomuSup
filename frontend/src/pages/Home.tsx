import { Link } from 'react-router-dom';
// 👇 新しく使うアイコン（GlassWater, ListChecks, Sparkles）を追加でインポートします
import { ShieldCheck, Zap, History, ChevronRight, GlassWater, ListChecks, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col animate-fadeIn">
      {/* ヒーローセクション：一番目立つメインビジュアル */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          今日の一杯を、<br />
          <span className="text-primary">明日への活力に。</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          薬剤師監修のロジックで、あなたの今のコンディションに最適な二日酔い対策を提案します。
        </p>
        <Link 
          to="/timing" 
          className="inline-flex items-center gap-2 bg-primary text-white text-xl font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          診断を始める
          <ChevronRight className="w-6 h-6" />
        </Link>
      </section>

      {/* ▼▼▼ ここから追加：使い方セクション ▼▼▼ */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">使い方は簡単３ステップ</h2>
          <p className="text-gray-500 mt-3">会員登録なしでも、今すぐ診断できます</p>
        </div>

        {/* md:grid-cols-3 で、スマホなら縦並び、PCなら横に3つ並ぶようになります */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Step 1 */}
          <div className="relative text-center p-8 border-2 border-orange-100 rounded-3xl bg-orange-50/30">
            {/* 上にはみ出す数字バッジ */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm">1</div>
            <div className="mt-2 mb-5 bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary">
              <GlassWater className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">いまの状態を選ぶ</h3>
            <p className="text-sm text-gray-600 leading-relaxed">「これから飲む」「二日酔い」など、あなたの状況を選択します。</p>
          </div>

          {/* Step 2 */}
          <div className="relative text-center p-8 border-2 border-orange-100 rounded-3xl bg-orange-50/30">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm">2</div>
            <div className="mt-2 mb-5 bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary">
              <ListChecks className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">症状をタップ</h3>
            <p className="text-sm text-gray-600 leading-relaxed">当てはまる症状や、あなたの体質をチェックリストから選びます。</p>
          </div>

          {/* Step 3 */}
          <div className="relative text-center p-8 border-2 border-orange-100 rounded-3xl bg-orange-50/30">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-4 border-white shadow-sm">3</div>
            <div className="mt-2 mb-5 bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg mb-2">最適な対策がわかる</h3>
            <p className="text-sm text-gray-600 leading-relaxed">薬剤師監修のロジックで、今すぐできるケアや市販薬をご提案します。</p>
          </div>

        </div>
      </section>
      {/* ▲▲▲ ここまで追加 ▲▲▲ */}

      {/* 特徴セクション：アプリの強みを3つ紹介（既存のコードそのまま） */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nomu-Supの特徴</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">薬剤師監修</h3>
              <p className="text-sm text-gray-500">あなたの体質や症状に合わせ、医学的視点から最適な薬や成分を提案。</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">直感的な診断</h3>
              <p className="text-sm text-gray-500">「飲む前・中・後」を選ぶだけ。たった数問で今のあなたに最適なケアが判明。</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">履歴を保存</h3>
              <p className="text-sm text-gray-500">ログインすれば過去の診断履歴を保存。自分に合う対策がいつでも見返せる。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;