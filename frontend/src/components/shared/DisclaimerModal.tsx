import { useState, useEffect } from 'react';
import { DisclaimerContent } from './DisclaimerContent'; // さっき作った文章をインポート

const DisclaimerModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // まだ同意していない場合のみ開く
    const hasAgreed = localStorage.getItem('disclaimer_agreed');
    if (!hasAgreed) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    // 同意フラグを保存
    localStorage.setItem('disclaimer_agreed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            安全にご利用いただくために
          </h2>
        </div>

        {/* コンテンツ（スクロール可能領域） */}
        <div className="p-6 overflow-y-auto flex-grow">
          <DisclaimerContent />
        </div>

        {/* フッター（同意ボタン） */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <button
            onClick={handleAgree}
            className="w-full bg-primary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all"
          >
            内容を確認し、同意して利用する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;