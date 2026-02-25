import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Scale, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DisclaimerContent } from '../components/shared/DisclaimerContent';

const StaticPageLayout = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors">
        <ChevronLeft className="w-5 h-5" />
        <span>戻る</span>
      </button>
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <Icon className="text-primary w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 利用規約 ---
export const TermsOfService = () => (
  <StaticPageLayout title="利用規約" icon={Scale}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">1. はじめに</h2>
      <p>Nomu-Sup（以下「本サービス」）の利用規約を定めます。利用者は本規約に同意したものとみなします。</p>
    </section>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">2. 禁止事項</h2>
      <p>本サービスの解析、不正アクセス、または他の利用者の迷惑となる行為を禁止します。</p>
    </section>
  </StaticPageLayout>
);

// --- プライバシーポリシー ---
export const PrivacyPolicy = () => (
  <StaticPageLayout title="プライバシーポリシー" icon={ShieldCheck}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">1. 個人情報の収集</h2>
      <p>本サービスでは、アカウント作成時にメールアドレスおよび氏名を収集します。</p>
    </section>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">2. 利用目的</h2>
      <p>収集した情報は、診断履歴の保存および本人確認のためにのみ利用します。</p>
    </section>
  </StaticPageLayout>
);

// --- 免責事項 ---
// 【修正】直書きしていた<section>を消して、<DisclaimerContent />に置き換えます
export const Disclaimer = () => (
  <StaticPageLayout title="免責事項" icon={AlertTriangle}>
    <DisclaimerContent />
  </StaticPageLayout>
);