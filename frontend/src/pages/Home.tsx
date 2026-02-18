import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, History, ChevronRight } from 'lucide-react';

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

      {/* 特徴セクション：アプリの強みを3つ紹介 */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">薬剤師監修</h3>
            <p className="text-sm text-gray-500">あなたの体質や症状に合わせ、医学的視点から最適な薬や成分を提案。</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">直感的な診断</h3>
            <p className="text-sm text-gray-500">「飲む前・中・後」を選ぶだけ。たった数問で今のあなたに最適なケアが判明。</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">履歴を保存</h3>
            <p className="text-sm text-gray-500">ログインすれば過去の診断履歴を保存。自分に合う対策がいつでも見返せる。</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;