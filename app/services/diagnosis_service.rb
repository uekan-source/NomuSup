# rubocop:disable Metrics/ClassLength
class DiagnosisService
  def initialize(symptom_ids, timing)
    @symptom_ids = symptom_ids || []
    @timing = timing.to_i
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def execute
    selected_symptoms = Symptom.where(id: @symptom_ids).index_by(&:id)

    # 選択されたタイミング、または「3(いつでも)」の薬を候補にする
    valid_drugs = Drug.where(timing: [@timing, 3]).includes(:drug_symptoms)

    has_stomach_trouble = selected_symptoms.values.any? do |s|
      s.name.include?('胃') || s.name.include?('吐き気') || s.name.include?('食欲不振')
    end
    has_diarrhea = selected_symptoms.values.any? { |s| s.name.include?('下痢') || s.name.include?('ゆるい') }

    # 💡 頭痛フラグ（'頭痛'という文字が含まれている症状が選ばれているか）
    has_headache = selected_symptoms.values.any? { |s| s.name.include?('頭痛') }

    scored_drugs = valid_drugs.map do |drug|
      score = 0
      matched_count = 0

      # ==========================================
      # 1. 直接的な症状マッチング (高得点を加算)
      # ==========================================
      drug.drug_symptoms.each do |ds|
        symptom = selected_symptoms[ds.symptom_id]
        if symptom
          score += symptom.category == 1 ? 30 : 20
          matched_count += 1
        end
      end

      # ==========================================
      # 2. 禁忌・リスク回避ロジック (絶対に表示させない)
      # ==========================================
      is_contraindicated = false
      is_contraindicated = true if has_stomach_trouble && drug.name.include?('バファリン')
      is_contraindicated = true if has_diarrhea && drug.name.include?('牛乳')
      is_contraindicated = true if has_stomach_trouble && drug.name.include?('ウィルキンソン')
      is_contraindicated = true if @timing.zero? && drug.name.include?('OS-1')

      # 💡 頭痛がない時は「タイレノール」と「バファリン」を確実に弾く！
      is_contraindicated = true if !has_headache && (drug.name.include?('タイレノール') || drug.name.include?('バファリン'))

      # 禁忌に該当する場合は、スコアを大きくマイナスにして確実に除外する
      score = -9999 if is_contraindicated

      # ==========================================
      # 3. 汎用的なおすすめ度 (0点問題の解決・底上げ)
      # ==========================================
      if score.zero? && !is_contraindicated
        score += 5 if drug.timing == @timing
        universal_keywords = %w[ポカリスエット カゴメ]
        score += 3 if universal_keywords.any? { |kw| drug.name.include?(kw) }
      end

      # ==========================================
      # 4. 同点時の微調整 (マッチ率)
      # ==========================================
      match_ratio = 0.0
      match_ratio = matched_count.to_f / drug.drug_symptoms.size if drug.drug_symptoms.size.positive? && score.positive?
      final_score = score + match_ratio

      { drug: drug, score: final_score, random: rand, symptom_count: drug.drug_symptoms.size }
    end

    # 💡 マイナススコア（禁忌）を確実に排除
    safe_drugs = scored_drugs.reject { |item| item[:score].negative? }

    # スコアが高い順 ＞ カバーできる症状数が多い順 ＞ ランダム の優先順位で並び替え
    sorted_drugs = safe_drugs.sort_by do |item|
      [
        -item[:score],
        -item[:symptom_count],
        item[:random]
      ]
    end

    # 上位の薬から、バランスを考慮して3つ選抜する
    suggested_drugs = select_realistic_drugs(sorted_drugs.pluck(:drug), @timing)
    summary = generate_summary(selected_symptoms.values)

    { drugs: suggested_drugs, summary: summary }
  end
  # rubocop:enable all

  private

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
  def select_realistic_drugs(sorted_drug_objects, _timing)
    return [] if sorted_drug_objects.empty?

    # ==========================================
    # 💡 同系統アイテム（肝臓サポート系）の重複排除ロジック
    # ==========================================
    liver_support_group = ['ヘパリーゼGX', 'ヘパリーゼW', 'ウコンの力', 'ウコンの力 超MAX', 'ヘパリーゼHi']
    already_has_liver_support = false

    filtered_drugs = []
    sorted_drug_objects.each do |drug|
      if liver_support_group.include?(drug.name)
        # すでに肝臓系アイテムが選ばれていたらスキップ
        next if already_has_liver_support

        # まだ選ばれていなければフラグを立てて採用
        already_has_liver_support = true
      end
      filtered_drugs << drug
    end

    # フィルタリングされたクリーンなリストから上位3つをピックアップ
    selected = filtered_drugs.take(3)

    # 💡 バランス調整ロジック：
    # もし上位3つが「すべて医薬品」または「すべてコンビニ商品」のように偏ってしまった場合、
    # 4位以降の候補から「違うカテゴリの商品」を探して、3番目の商品と入れ替える。
    if selected.size == 3 && selected.map(&:category).uniq.size == 1
      dominant_category = selected.first.category
      alternative_drug = filtered_drugs.drop(3).find { |d| d.category != dominant_category }
      selected[2] = alternative_drug if alternative_drug
    end

    # 💡 1位（BEST MATCH）の見栄え調整ロジック：
    # 牛乳やラムネは優秀だが、BEST MATCHに表示されるとインパクトが弱いため、
    # 2位や3位に「薬」や「ドリンク剤」があれば、1位と順番を入れ替える
    non_best_match_keywords = %w[牛乳 ラムネ バナナ 鉄分 キレートレモン]
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
