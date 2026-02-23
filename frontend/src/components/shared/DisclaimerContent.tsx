import { AlertTriangle } from 'lucide-react';

export const DisclaimerContent = () => {
  return (
    <div className="space-y-6 text-gray-600 leading-relaxed">
      {/* 重要な警告（レッドフラッグ） */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-700 mb-2">【重要】利用を中止し、直ちに受診してください</h3>
            <p className="text-sm text-red-600 mb-2">
              以下の症状がある場合、命に関わる危険性があります。本アプリの利用を控え、直ちに救急車を呼ぶか、医療機関を受診してください。
            </p>
            <ul className="list-disc pl-5 text-sm text-red-700 font-bold space-y-1">
              <li>意識がもうろうとしている、呼びかけに応じない</li>
              <li>激しい頭痛、今までに経験したことのない頭痛</li>
              <li>血を吐く（吐血）、便に血が混じる（血便・黒色便）</li>
              <li>激しい腹痛、嘔吐が止まらない</li>
              <li>呼吸が苦しい、動悸が止まらない</li>
            </ul>
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">1. 本サービスの目的と情報の性質</h3>
        <p>
          「Nomu-Sup」（以下、本サービス）は、薬剤師監修のロジックに基づき、一般的な二日酔い対策や市販薬の情報を提供するものです。
          <br />
          <strong>提供される情報は医師による診断・治療行為に代わるものではありません。</strong>
          個人の体質や持病、服薬状況によっては適さない場合があります。
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">2. 利用者の責任</h3>
        <p>
          本サービスの情報に基づく判断および行動は、利用者の自己責任において行ってください。
          推奨された市販薬を使用する際は、必ず製品の添付文書（説明書）をよく読み、用法・用量を守って使用してください。
        </p>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 mb-2">3. 免責事項</h3>
        <p>
          本サービスの利用によって生じた体調不良、症状の悪化、またはその他の損害について、運営者は一切の責任を負いかねます。
          また、本サービスの情報は作成時点のものであり、最新の医学的知見と異なる場合があります。
        </p>
      </section>
    </div>
  );
};