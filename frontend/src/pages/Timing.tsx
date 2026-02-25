import { useNavigate } from 'react-router-dom';
import { GlassWater, Beer, Coffee, ChevronRight } from 'lucide-react';

const Timing = () => {
  const navigate = useNavigate();

  const options = [
    { id: 0, label: 'これから飲む！', icon: <GlassWater />, description: '事前の準備で明日の自分を救おう' },
    { id: 1, label: '飲みすぎたかも...', icon: <Beer />, description: '今のうちにできるケアを提案' },
    { id: 2, label: '翌朝がつらい', icon: <Coffee />, description: '二日酔いの症状を緩和したい' },
  ];

  const handleSelect = (id: number) => {
    navigate(`/diagnosis?timing=${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6 animate-fadeIn">
      <h2 className="text-3xl font-bold text-center mb-2">今の状態は？</h2>
      <p className="text-center text-gray-500 mb-10">状況に合わせて最適なアドバイスを行います</p>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className="w-full flex items-center p-6 bg-white border-2 border-gray-100 rounded-2xl text-left hover:border-primary hover:bg-orange-50 transition-all group"
          >
            <div className="bg-orange-100 text-primary p-4 rounded-xl mr-6 group-hover:bg-primary group-hover:text-white transition-colors">
              {option.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Timing;