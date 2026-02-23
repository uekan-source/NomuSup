import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import type { Symptom } from '../types';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Diagnosis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const timing = searchParams.get('timing') || '0';

  // 状態（State）の定義
  const [symptoms, setSymptoms] = useState<Symptom[]>([]); // 症状リスト
  const [constitutions, setConstitutions] = useState<Symptom[]>([]); // 体質リスト
  const [selectedIds, setSelectedIds] = useState<string[]>([]); // 選択されたID
  const [loading, setLoading] = useState(true);

  // 1. 画面表示時にRailsから質問を取得
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await client.get(`/symptoms?timing=${timing}`);
        setSymptoms(response.data.symptoms);
        setConstitutions(response.data.constitutions);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, [timing]);

  // チェックボックスの切り替え
  const toggleSymptom = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // 2. 診断実行（Railsのcreateアクションへ送る）
  const handleSubmit = async () => {
    try {
      const response = await client.post('/diagnosis_logs/calculate', {
        symptom_ids: selectedIds,
        timing: parseInt(timing)
      });
      // 結果画面へ（取得した薬のデータを渡す）
      navigate('/result', { state: { result: response.data } });
    } catch (error) {
      alert("診断に失敗しました。症状を選択してください。");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-primary">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h2 className="text-2xl font-bold mb-8 text-center">当てはまるものを教えてください</h2>

      {/* 症状セクション */}
      <div className="mb-10">
        <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-700">
          <AlertCircle className="text-orange-400 w-5 h-5" /> 今の症状
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {symptoms.map(s => (
            <label key={s.id} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedIds.includes(s.id) ? 'border-primary bg-orange-50' : 'border-gray-100 bg-white'}`}>
              <input type="checkbox" className="hidden" onChange={() => toggleSymptom(s.id)} />
              <CheckCircle2 className={`w-6 h-6 mr-3 ${selectedIds.includes(s.id) ? 'text-primary' : 'text-gray-200'}`} />
              <span className="font-medium">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 体質セクション */}
<div className="mb-12">
  <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-gray-700">
    <CheckCircle2 className="text-green-400 w-5 h-5" /> あなたの体質・傾向
  </h3>
  <div className="space-y-3">
    {constitutions.map(c => (
      <div 
        key={c.id} 
        onClick={() => toggleSymptom(c.id)}
        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
      >
        <span className="font-medium text-gray-700">{c.name}</span>
        
        {/* トグルスイッチ本体 */}
        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${selectedIds.includes(c.id) ? 'bg-primary' : 'bg-gray-200'}`}>
          {/* スイッチの中の白い丸 */}
          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 ${selectedIds.includes(c.id) ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      </div>
    ))}
  </div>
</div>

      <button 
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        className="w-full bg-primary text-white py-4 rounded-full text-xl font-bold shadow-lg hover:opacity-90 disabled:bg-gray-300 disabled:shadow-none transition-all"
      >
        診断結果を見る
      </button>
    </div>
  );
};

export default Diagnosis;