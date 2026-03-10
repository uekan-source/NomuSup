class AlcoholSimulationService
  def initialize(weight:, gender:, constitution:, drinks:)
    # 体重が未入力または0の場合は、計算エラー（ゼロ除算）を防ぐため平均的な60kgをフォールバックに設定
    @weight = weight.to_f.positive? ? weight.to_f : 60.0
    @gender = gender
    @constitution = constitution
    @drinks = drinks.is_a?(Array) ? drinks : []
  end

  def execute
    pure_alcohol = calculate_pure_alcohol
    metabolism_rate = calculate_metabolism_rate

    # 分解時間を計算（ゼロ除算回避）
    time_in_hours = metabolism_rate.positive? ? pure_alcohol / metabolism_rate : 0

    # 薬剤師の視点でのアドバイス生成
    advice = generate_advice(pure_alcohol, time_in_hours)

    {
      pure_alcohol_g: pure_alcohol.round(1),
      time_in_hours: time_in_hours.round(2),
      formatted_time: format_time(time_in_hours),
      advice: advice
    }
  end

  private

  def calculate_pure_alcohol
    @drinks.sum do |drink|
      volume = drink[:volume].to_f
      abv = drink[:abv].to_f
      # 純アルコール量(g) = 容量(ml) × (アルコール度数(%) / 100) × 0.8(比重)
      volume * (abv / 100.0) * 0.8
    end
  end

  def calculate_metabolism_rate
    # 1時間あたりの分解量(g)の基本係数
    # 男性: 0.1g, 女性: 0.08g (一般的に女性は男性に比べて肝臓が小さく水分量も少ないため)
    base_rate = @gender == 'female' ? 0.08 : 0.1

    rate = @weight * base_rate

    # お酒に弱い体質（フラッシング体質など）の場合は分解能力を低めに見積もる (0.8倍)
    rate *= 0.8 if @constitution == 'weak'

    rate
  end

  def format_time(hours)
    return '0分' if hours <= 0

    h = hours.floor
    m = ((hours - h) * 60).round

    if h.positive? && m.positive?
      "約#{h}時間#{m}分"
    elsif h.positive?
      "約#{h}時間"
    else
      "約#{m}分"
    end
  end

  def generate_advice(alcohol_g, hours)
    advices = []

    # 純アルコール量に応じた厚労省基準の警告
    if alcohol_g >= 40
      advices << "⚠️ 【多量飲酒のサイン】\n" \
                 "純アルコール量が40gを超えています。厚生労働省が推奨する「節度ある適度な飲酒」の基準を" \
                 "大きく上回っており、肝機能への負担が懸念されます。脱水を防ぐため、同量以上の水分（和らぎ水）を必ず摂取してください。"
    elsif alcohol_g >= 20
      advices << "💡 【適量オーバーの目安】\n" \
                 "純アルコール量が20gを超えています。これ以上のペースで飲むと、翌朝にアルコールが残りやすくなります。" \
                 "チェイサーを挟みながらゆっくり楽しみましょう。"
    end

    # 分解時間に応じた運転等の警告（免責事項の強調）
    if hours.positive?
      advices << "🚗 【重要：運転について】\n" \
                 "アルコールが完全に抜けるまで【#{format_time(hours)}】ほどかかる見込みです。" \
                 "※この時間はあくまで計算上の目安であり、当日の体調や空腹状態によってさらに長引く可能性があります。" \
                 "完全に抜けるまでは、車の運転や危険な作業は絶対にお控えください。"
    else
      advices << '✅ 選択された量からはアルコールの影響は少ないと推測されますが、体調に異変を感じた場合は無理をしないでください。'
    end

    advices.join("\n\n")
  end
end