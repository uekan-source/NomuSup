def execute
  # 1. 該当する薬と、その「症状のカテゴリ」を一緒に取得
  # drug_symptoms を通じて symptoms の情報を結合する
  matched_data = Drug.joins(drug_symptoms: :symptom)
                     .where(drug_symptoms: { symptom_id: @symptom_ids })
                     .select('drugs.*, symptoms.category AS symptom_category')

  # 2. スコアリングを行う
  # 症状(0)なら1点、体質(1)なら2点のように加点する
  drug_scores = Hash.new(0)
  matched_data.each do |drug|
    weight = (drug.symptom_category == 1) ? 2 : 1
    drug_scores[drug.id] += weight
  end

  # 3. スコアの高い順にIDを並び替える
  ranked_ids = drug_scores.sort_by { |_, score| -score }.map(&:first)

  # 4. ID順に取得して返却
  Drug.where(id: ranked_ids).in_order_of(:id, ranked_ids)
end