class DiagnosisService
  def initialize(symptom_ids)
    @symptom_ids = symptom_ids
  end

  def execute
    # 1. 該当する薬を「重複を含めて」すべて取得する
    # ※あえて .distinct を外して、ヒットした数だけ取得します
    all_matched_drugs = Drug.joins(:drug_symptoms)
                            .where(drug_symptoms: { symptom_id: @symptom_ids })

    # 2. ヒットした回数を集計し、多い順（降順）に並び替える
    # 薬のIDをキー、ヒット回数を値とするハッシュを作成し、ソートします
    ranked_drug_ids = all_matched_drugs.group(:id)
                                       .count # { "drug_id_1" => 3, "drug_id_2" => 1 } のような形式
                                       .sort_by { |_, count| -count } # ヒット数が多い順にソート
                                       .map { |id, _| id } # IDだけの配列に戻す

    # 3. ソートされたIDの順序を維持したまま、薬の情報を取得して返す
    # Rails 7以降では in_order_of が使えます
    Drug.where(id: ranked_drug_ids).in_order_of(:id, ranked_drug_ids)
  end
end