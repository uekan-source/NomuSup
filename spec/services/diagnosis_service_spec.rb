require 'rails_helper'

RSpec.describe DiagnosisService, type: :service do
  describe '#execute' do
    let!(:stomach_pain) { create(:symptom, name: '胃痛', category: 0) }
    let!(:headache) { create(:symptom, name: '頭痛', category: 0) }
    let!(:bufferin) { create(:drug, name: 'バファリンA') }
    let!(:other_drug) { create(:drug, name: '別の胃に優しい薬') }

    context '胃痛の症状が選択されている場合' do
      it 'バファリンAがおすすめ薬（safe_drugs）から除外されること' do
        # 1. Arrange（準備）
        # symptom_ids には症状の「ID」の配列を渡す
        symptom_ids = [stomach_pain.id]
        timing = 0 # 0: 飲酒前（例として設定）

        # 2. Act（実行）
        # newのときに、idの配列とタイミングを渡す！
        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        # 3. Assert（検証）
        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).not_to include('バファリンA')
      end
    end

    context '胃痛がなく、頭痛のみが選択されている場合' do
      it 'バファリンAが除外されずに提案されること' do
        # 1. Arrange（準備）
        symptom_ids = [headache.id]
        timing = 0

        # 2. Act（実行）
        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute

        # 3. Assert（検証）
        suggested_drug_names = result[:drugs].map(&:name)
        expect(suggested_drug_names).to include('バファリンA')
      end
    end
  end
end
