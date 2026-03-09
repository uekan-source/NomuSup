import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface DiagnosisHeaderProps {
  currentStep: number;
  steps: { id: number; label: string }[]; // ← ステップの定義を親コンポーネントから受け取るように変更
}

const DiagnosisHeader = ({ currentStep, steps }: DiagnosisHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-10 relative z-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 font-medium group bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        戻る
      </button>

      <div className="relative max-w-md mx-auto px-4">
        {/* 背景のグレーの線 */}
        <div className="absolute left-0 top-4 w-full h-1 bg-orange-100 rounded-full z-0"></div>
        
        {/* アクティブなオレンジの線 */}
        <div
          className="absolute left-0 top-4 h-1 bg-gradient-to-r from-orange-400 to-primary rounded-full z-0 transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* 各ステップの丸アイコンとテキスト */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-orange-400 to-primary text-white shadow-md shadow-orange-200 ring-4 ring-orange-50'
                      : 'bg-white text-gray-300 ring-4 ring-orange-50 border border-gray-100'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs font-bold mt-2 whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? 'text-primary drop-shadow-sm' : isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisHeader;