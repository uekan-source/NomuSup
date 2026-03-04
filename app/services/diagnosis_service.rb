class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def execute
    selected_symptoms = Symptom.where(id: @symptom_ids).index_by(&:id)
    valid_drugs = Drug.where(timing: [@timing, 3]).includes(:drug_symptoms)

    has_stomach_pain = selected_symptoms.values.any? { |s| s.name.include?('胃痛') || s.name.include?('胃に違和感') }

    scored_drugs = valid_drugs.map do |drug|
      score = 0
      matched_count = 0

      drug.drug_symptoms.each do |ds|
        symptom = selected_symptoms[ds.symptom_id]
        if symptom
          score += symptom.category == 1 ? 2 : 1
          matched_count += 1
        end
      end

      # 💊 禁忌・リスク回避ロジック（胃痛時のNSAIDs除外）
      score -= 10 if has_stomach_pain && drug.name == 'バファリンA'

      match_ratio = 0.0
      match_ratio = matched_count.to_f / drug.drug_symptoms.size if drug.drug_symptoms.size.positive? && score.positive?

      final_score = score + match_ratio

      { drug: drug, score: final_score, random: rand, symptom_count: drug.drug_symptoms.size }
    end

    # 🎯 スコアがマイナス（禁忌）の薬だけを除外する（スコア0の無難な薬は残す）
    safe_drugs = scored_drugs.reject { |item| item[:score].negative? }

    # ランキングの並び替え
    sorted_drugs = safe_drugs.sort_by do |item|
      [
        -item[:score],         # 1. スコアが高い順（マッチしているものを最優先）
        item[:symptom_count],  # 2. 薬の守備範囲が狭い順（特化型を優先）
        item[:drug].category,  # 3. 医薬品優先
        item[:random]          # 4. 同点（スコア0同士など）はランダム
      ]
    end

    # 上位3つを確実に取得する（スコア0のものも穴埋めとして入る）
    suggested_drugs = sorted_drugs.pluck(:drug).take(3)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end
  # rubocop:enable all

  private

  # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def generate_summary(symptoms)
    names = symptoms.map(&:name)
    advices = []

    advices << '空腹でお酒を飲むとアルコールの吸収が急激に進み、胃粘膜も荒れやすくなります。まずは何か軽く胃に入れてからお酒を楽しみましょう。' if names.any? { |n| n.include?('空腹') }

    if names.any? { |n| n.include?('頭痛') || n.include?('乾く') }
      advices << 'アルコールによる脱水が起きているサインです。お酒と同じかそれ以上の水分（水や経口補水液）をこまめに摂ることを強くおすすめします。'
    end

    if names.any? { |n| n.include?('胃') || n.include?('吐き気') || n.include?('ムカムカ') }
      advices << '胃腸がダメージを受けています。消化の良い温かいものを摂り、油物や刺激物は避けて胃を休ませてください。'
    end

    if names.any? { |n| n.include?('弱い') || n.include?('赤く') || n.include?('ふらつく') }
      advices << 'アルコールの分解が追いついていない可能性があります。自分のペースを守り、無理な飲酒や一気飲みは絶対に控えてください。'
    end

    advices << '肝臓の代謝を助ける成分を摂りつつ、こまめな水分補給と十分な休息を心がけてください。' if advices.empty?

    advices.join("\n\n")
  end
  # rubocop:enable all
end
