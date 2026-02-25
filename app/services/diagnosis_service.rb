class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  def execute
    selected_symptoms = Symptom.where(id: @symptom_ids).index_by(&:id)
    valid_drugs = Drug.where(timing: [@timing, 3]).includes(:drug_symptoms)

    has_stomach_pain = selected_symptoms.values.any? { |s| s.name.include?('胃痛') || s.name.include?('胃に違和感') }

    scored_drugs = valid_drugs.map do |drug|
      score = 0
      drug.drug_symptoms.each do |ds|
        symptom = selected_symptoms[ds.symptom_id]
        score += (symptom.category == 1) ? 2 : 1 if symptom
      end

      if has_stomach_pain && drug.name == 'バファリンA'
        score -= 10 
      end

      { drug: drug, score: score, random: rand }
    end

    sorted_drugs = scored_drugs.sort_by do |item|
      [-item[:score], item[:drug].category, item[:random]]
    end

    suggested_drugs = sorted_drugs.map { |item| item[:drug] }.take(3)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end

  private

  # 症状の名前からキーワードを拾って、最適なアドバイスを組み立てる
  def generate_summary(symptoms)
    names = symptoms.map(&:name)
    advices = []

    if names.any? { |n| n.include?('空腹') }
      advices << "空腹でお酒を飲むとアルコールの吸収が急激に進み、胃粘膜も荒れやすくなります。まずは何か軽く胃に入れてからお酒を楽しみましょう。"
    end
    
    if names.any? { |n| n.include?('頭痛') || n.include?('乾く') }
      advices << "アルコールによる脱水が起きているサインです。お酒と同じかそれ以上の水分（水や経口補水液）をこまめに摂ることを強くおすすめします。"
    end
    
    if names.any? { |n| n.include?('胃') || n.include?('吐き気') || n.include?('ムカムカ') }
      advices << "胃腸がダメージを受けています。消化の良い温かいものを摂り、油物や刺激物は避けて胃を休ませてください。"
    end
    
    if names.any? { |n| n.include?('弱い') || n.include?('赤く') || n.include?('ふらつく') }
      advices << "アルコールの分解が追いついていない可能性があります。自分のペースを守り、無理な飲酒や一気飲みは絶対に控えてください。"
    end

    if advices.empty?
      advices << "肝臓の代謝を助ける成分を摂りつつ、こまめな水分補給と十分な休息を心がけてください。"
    end

    # 複数のアドバイスが出た場合は改行で繋げる
    advices.join("\n\n")
  end
end