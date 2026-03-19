import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface DiagnosisHeaderProps {
  currentStep: number;
  steps: { id: number; label: string }[];
  // テーマカラーを外から受け取れるようにする（デフォルトはオレンジ）
  theme?: 'orange' | 'blue'; 
}

const DiagnosisHeader = ({ currentStep, steps, theme = 'orange' }: DiagnosisHeaderProps) => {
  const navigate = useNavigate();

  //  テーマに応じたカラークラスを定義
  const isBlue = theme === 'blue';
  const bgLineColor = isBlue ? 'bg-blue-100' : 'bg-orange-100';
  const activeLineColor = isBlue ? 'bg-gradient-to-r from-blue-300 to-cyan-500' : 'bg-gradient-to-r from-orange-400 to-primary';
  const activeCircleBg = isBlue ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-200 ring-blue-50' : 'bg-gradient-to-br from-orange-400 to-primary shadow-orange-200 ring-orange-50';
  const currentTextColor = isBlue ? 'text-cyan-600' : 'text-primary';

  return (
    <div className="mb-10 relative z-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors mb-8 font-medium group bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        戻る
      </button>

      <div className="relative max-w-md mx-auto px-4">
        {/* 背景のグレーの線 */}
        <div className={`absolute left-0 top-4 w-full h-1 rounded-full z-0 transition-colors duration-500 ${bgLineColor}`}></div>
        
        {/* アクティブな色付きの線 */}
        <div
          className={`absolute left-0 top-4 h-1 rounded-full z-0 transition-all duration-500 ease-out shadow-sm ${activeLineColor}`}
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        <div className="relative z-10 flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? `${activeCircleBg} text-white shadow-md ring-4`
                      : 'bg-white text-gray-300 ring-4 ring-white border border-gray-100'
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`text-xs font-bold mt-2 whitespace-nowrap transition-colors duration-300 ${
                    isCurrent ? `${currentTextColor} drop-shadow-sm` : isActive ? 'text-gray-700' : 'text-gray-400'
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