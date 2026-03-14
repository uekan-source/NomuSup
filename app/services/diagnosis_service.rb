# rubocop:disable Metrics/ClassLength
class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def execute
    selected_symptoms = Symptom.where(id: @symptom_ids).index_by(&:id)
    valid_drugs = Drug.where(timing: [@timing, 3]).includes(:drug_symptoms)

    has_stomach_trouble = selected_symptoms.values.any? do |s|
      s.name.include?('胃') || s.name.include?('吐き気') || s.name.include?('食欲不振')
    end
    has_diarrhea = selected_symptoms.values.any? { |s| s.name.include?('下痢') || s.name.include?('ゆるい') }

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

      # 💊 禁忌・リスク回避ロジック
      score -= 10 if has_stomach_trouble && drug.name == 'バファリンA'
      score -= 10 if has_diarrhea && drug.name.include?('牛乳')

      match_ratio = 0.0
      match_ratio = matched_count.to_f / drug.drug_symptoms.size if drug.drug_symptoms.size.positive? && score.positive?

      final_score = score + match_ratio

      { drug: drug, score: final_score, random: rand, symptom_count: drug.drug_symptoms.size }
    end

    safe_drugs = scored_drugs.reject { |item| item[:score] <= 0 }

    sorted_drugs = safe_drugs.sort_by do |item|
      [
        -item[:score],
        item[:symptom_count],
        item[:drug].category,
        item[:random]
      ]
    end

    suggested_drugs = select_realistic_drugs(sorted_drugs.pluck(:drug), @timing)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end
  # rubocop:enable all

  private

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def select_realistic_drugs(sorted_drug_objects, timing)
    return [] if sorted_drug_objects.empty?

    ds_drugs = sorted_drug_objects.select { |d| [0, 'medicine'].include?(d.category) }
    cvs_drugs = sorted_drug_objects.select { |d| [1, 'food'].include?(d.category) }

    selected = []

    case timing
    when 0
      selected = sorted_drug_objects.take(3)
      if selected.size == 3 && selected.all? { |d| d.category == selected.first.category }
        other_category = [0, 'medicine'].include?(selected.first.category) ? cvs_drugs : ds_drugs
        selected[2] = other_category.first if other_category.any?
      end

    when 1
      energy_keywords = %w[ヘパリーゼ ウコン ソルマック 液キャベ リポビタン チョコラBB]
      energy_drink = cvs_drugs.find { |d| energy_keywords.any? { |kw| d.name.include?(kw) } }

      if energy_drink
        selected << energy_drink
        cvs_drugs.delete(energy_drink)
      end

      selected << cvs_drugs.shift if cvs_drugs.any?
      selected << ds_drugs.shift if ds_drugs.any?
      selected << cvs_drugs.shift if selected.size < 3 && cvs_drugs.any?

      selected.sort_by! { |d| sorted_drug_objects.index(d) }

    when 2
      selected.concat(ds_drugs.take(2))
      ds_drugs = ds_drugs.drop(2)

      selected.concat(cvs_drugs.take(1))
      cvs_drugs = cvs_drugs.drop(1)

      remaining = ds_drugs + cvs_drugs
      remaining.sort_by! { |d| sorted_drug_objects.index(d) }
      selected << remaining.shift while selected.size < 3 && remaining.any?

      selected.sort_by! { |d| sorted_drug_objects.index(d) }
    end

    selected = selected.take(3)

    non_best_match_keywords = %w[牛乳 ラムネ]
    if selected.size > 1 && non_best_match_keywords.any? { |kw| selected.first.name.include?(kw) }
      swap_index = selected.find_index { |d| non_best_match_keywords.none? { |kw| d.name.include?(kw) } }
      selected[0], selected[swap_index] = selected[swap_index], selected[0] if swap_index&.positive?
    end

    selected
  end
  # rubocop:enable all

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def generate_summary(symptoms)
    names = symptoms.map(&:name)
    advices = []

    if names.any? { |n| n.include?('頭痛') || n.include?('渇く') || n.include?('水分') }
      advices << if @timing.zero?
                   'すでに脱水気味のようです。この状態でお酒を飲むと血中アルコール濃度が急上昇しやすくなります。チェイサー(水)を普段より多めに飲むよう心がけてください。'
                 else
                   'アルコールによる脱水が起きているサインです。お酒と同じかそれ以上の水分（水や経口補水液）をこまめに摂ることを強くおすすめします。'
                 end
    end

    if names.any? { |n| n.include?('胃') || n.include?('吐き気') || n.include?('食欲不振') }
      advices << if @timing.zero?
                   'すでに胃腸の調子が優れないようです。アルコールは胃粘膜を直接刺激するため、今日は度数の高いお酒や炭酸を控え、無理のない範囲で楽しみましょう。'
                 else
                   '胃腸が深刻なダメージを受けています。消化の良い温かいものを摂り、油物や刺激物は避けてまずは胃を休ませてください。'
                 end
    end

    if names.any? { |n| n.include?('下痢') || n.include?('ゆるい') }
      advices << 'アルコールが腸の粘膜を刺激し、水分の吸収がうまくできていません。冷たい飲み物は避け、常温の経口補水液などで脱水を防ぎつつ腸を休ませてください。'
    end

    advices << '空腹でお酒を飲むとアルコールの吸収が急激に進み、胃粘膜も荒れやすくなります。まずは何か軽く胃に入れてからお酒を楽しみましょう。' if names.any? { |n| n.include?('空腹') }

    if names.any? { |n| n.include?('弱い') || n.include?('赤く') || n.include?('ふらつく') || n.include?('残って') }
      advices << 'アルコールの分解が追いついていない可能性があります。自分のペースを守り、無理な飲酒や一気飲みは絶対に控えてください。'
    end

    if names.any? { |n| n.include?('深酒') || n.include?('チャンポン') || n.include?('飲み足りない') }
      advices << '多量・多種類のアルコールは、肝臓での解毒処理に非常に大きな負担をかけます。代謝を助ける成分をしっかり補給し、肝臓をサポートしましょう。'
    end

    if names.any? { |n| n.include?('脂っこい') || n.include?('締め') }
      advices << '脂質とアルコールが重なると、肝臓がパンクして翌朝の強い胃もたれに直結します。消化を助ける健胃薬や成分で早めにケアしておくのが吉です。'
    end

    if names.any? { |n| n.include?('だるい') || n.include?('重い') || n.include?('疲労') }
      advices << if @timing.zero?
                   '疲労が溜まっていると肝臓の働きも落ち、悪酔いしやすくなります。代謝を助ける成分をしっかり摂ってから飲み会に臨みましょう。'
                 else
                   '強いだるさは、分解しきれなかった疲労物質（アセトアルデヒド）が体内に残っている証拠です。L-システインなどの代謝促進成分と十分な休息が必要です。'
                 end
    end

    if names.any? { |n| n.include?('むくみ') }
      advices << '顔や体のむくみは、アルコールによって体内の水分バランスが崩れているサインです。水分の巡りを整える漢方や、カリウムを含む食品が効果的です。'
    end

    if names.any? { |n| n.include?('ボーッと') || n.include?('後悔') || n.include?('口内炎') }
      advices << 'アルコールの代謝には大量のビタミンが消費されます。頭が働かなかったり気分の落ち込みがある時は、ビタミンB群や脳の栄養（ブドウ糖）を補給しましょう。'
    end

    advices << '肝臓の代謝を助ける成分を摂りつつ、こまめな水分補給と十分な休息を心がけてください。' if advices.empty?

    advices.take(3).join("\n\n")
  end
  # rubocop:enable all
end
