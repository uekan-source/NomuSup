require 'rails_helper'

RSpec.describe DiagnosisService, type: :service do
  describe '#execute' do
    let!(:stomach_pain) { create(:symptom, name: '胃痛', category: 0) }
    let!(:headache) { create(:symptom, name: '頭痛', category: 0) }
    let!(:bufferin) { create(:drug, name: 'バファリンA') }

    # 💡 追加：テスト環境でも薬と症状をしっかり紐付ける
    before do
      bufferin.symptoms << headache
      bufferin.symptoms << stomach_pain
    end

    context '胃痛の症状が選択されている場合' do
      it 'バファリンAがおすすめ薬（safe_drugs）から除外されること' do
        symptom_ids = [stomach_pain.id]
        timing = 0

        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).not_to include('バファリンA')
      end
    end

    context '胃痛がなく、頭痛のみが選択されている場合' do
      it 'バファリンAが除外されずに提案されること' do
        symptom_ids = [headache.id]
        timing = 0

        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).to include('バファリンA')
      end
    end
  end
end
