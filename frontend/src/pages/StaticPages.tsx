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
      <h2 className="text-lg font-bold text-gray-800 mb-2">第1条（適用）</h2>
      <p>本規約は、ユーザーと本サービス「Nomu-Sup」（以下「本サービス」）の利用に関わる一切の関係に適用されるものとします。</p>
      <p>なお、本サービスにおける情報提供の性質や健康被害に関する免責については、別途定めている「免責事項」の規定が適用されるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第2条（ユーザー登録）</h2>
      <p>本サービスの利用を希望する者は、本規約およびプライバシーポリシーに同意の上、運営者の定める方法によってユーザー登録を行うものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第3条（アカウントの管理）</h2>
      <p>ユーザーは、自己の責任において、本サービスのメールアドレスおよびパスワードを適切に管理するものとします。</p>
      <p>ユーザーは、いかなる場合にも、アカウントおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第4条（禁止事項）</h2>
      <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>法令または公序良俗に違反する行為</li>
        <li>犯罪行為に関連する行為</li>
        <li>本サービスのサーバーやネットワークの機能を破壊したり、妨害したりする行為</li>
        <li>本サービスの運営を妨害するおそれのある行為</li>
        <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
        <li>その他、運営者が不適切と判断する行為</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第5条（本サービスの提供の停止等）</h2>
      <p>運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
        <li>地震、落雷、火災、停電などの不可抗力により、本サービスの提供が困難となった場合</li>
        <li>コンピュータまたは通信回線等が事故により停止した場合</li>
        <li>その他、運営者が本サービスの提供が困難と判断した場合</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第6条（退会）</h2>
      <p>ユーザーは、運営者の定める退会手続により、本サービスから退会できるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第7条（サービス内容の変更等）</h2>
      <p>運営者は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害（本規約および免責事項に定めるものを除く）について一切の責任を負いません。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第8条（利用規約の変更）</h2>
      <p>運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第9条（準拠法・裁判管轄）</h2>
      <p>本規約の解釈にあたっては、日本法を準拠法とします。</p>
      <p>本サービスに関して紛争が生じた場合には、運営者の所在地を管轄する裁判所を専属的合意管轄とします。</p>
    </section>
  </StaticPageLayout>
);

// --- プライバシーポリシー ---
export const PrivacyPolicy = () => (
  <StaticPageLayout title="プライバシーポリシー" icon={ShieldCheck}>
    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第1条（取得する個人情報）</h2>
      <p>本サービスは、ユーザーが利用登録をする際に以下の個人情報を取得します。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>メールアドレス</li>
        <li>ニックネーム</li>
        <li>診断履歴（選択した症状や体質、提案された対策商品に関するデータ）</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第2条（個人情報の利用目的）</h2>
      <p>本サービスが個人情報を収集・利用する目的は、以下のとおりです。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>ユーザーのアカウント管理およびログイン認証のため</li>
        <li>ユーザーへ過去の診断履歴を提供・表示するため</li>
        <li>ユーザーの利用状況を分析し、本サービスの品質向上や機能改善に役立てるため</li>
        <li>上記の利用目的に付随する目的</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第3条（個人情報の第三者提供）</h2>
      <p>運営者は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。</p>
      <ul className="list-disc pl-6 space-y-1 mt-2">
        <li>法令に基づく場合</li>
        <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
      </ul>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第4条（個人情報の開示・訂正・削除）</h2>
      <p>ユーザーは、本サービスのマイページ等の機能を利用して、自身の個人情報（ニックネーム、メールアドレス）の確認および訂正を行うことができます。また、アカウントの削除（退会）機能を利用することで、個人情報および診断履歴の削除を行うことができます。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第5条（プライバシーポリシーの変更）</h2>
      <p>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。</p>
      <p>変更後のプライバシーポリシーは、本サービス内に掲示したときから効力を生じるものとします。</p>
    </section>

    <section>
      <h2 className="text-lg font-bold text-gray-800 mb-2">第6条（お問い合わせ窓口）</h2>
      <p>本ポリシーに関するお問い合わせは、本サービスのお問い合わせ窓口、または運営者宛にお願いいたします。</p>
    </section>
  </StaticPageLayout>
);

// --- 免責事項 ---
export const Disclaimer = () => (
  <StaticPageLayout title="免責事項" icon={AlertTriangle}>
    <DisclaimerContent />
  </StaticPageLayout>
);