# 既存データの削除
[DrugIngredient, DrugSymptom, Drug, Ingredient, Symptom].each(&:destroy_all)

# 1. 症状データの登録 (Symptoms)
# timing: 0:前, 1:中, 2:後 / category: 0:症状, 1:体質
symptoms_data = [
  # これから飲む (前)
  { name: '空腹である', timing: 0, category: 0 },
  { name: '今日はがっつり飲む予定', timing: 0, category: 0 },
  { name: 'ビールなど炭酸系を多く飲む', timing: 0, category: 0 },
  { name: 'お酒に弱い体質である', timing: 0, category: 1 },
  # 飲みすぎたかも (中)
  { name: '顔が赤くなっている', timing: 1, category: 0 },
  { name: '少しふらつく', timing: 1, category: 0 },
  { name: '喉が異常に乾く', timing: 1, category: 0 },
  { name: '締めを食べたい欲求がある', timing: 1, category: 0 },
  { name: 'すでに胃に違和感がある', timing: 1, category: 1 },
  # 翌朝がつらい (後)
  { name: 'ズキズキする頭痛', timing: 2, category: 0 },
  { name: 'ムカムカする吐き気', timing: 2, category: 0 },
  { name: '体がだるい', timing: 2, category: 0 },
  { name: 'むくみがひどい', timing: 2, category: 0 },
  { name: '現在、胃痛がある', timing: 2, category: 1 }
]
symptoms = {}
symptoms_data.each { |s| symptoms[s[:name]] = Symptom.create!(s) }

# 2. 成分データの登録 (Ingredients) - 25種類以上
ingredients_list = [
  "肝臓エキス", "クルクミン", "ウコンエキス", "オルニチン", "ビタミンB1", "ビタミンB2", "ビタミンB6", "ビタミンC",
  "ブドウ糖", "クエン酸", "タウリン", "ナイアシン", "L-システイン", "グリチルリチン酸", "アセトアミノフェン",
  "無水カフェイン", "イブプロフェン", "水酸化マグネシウム", "アルミナマグネシウム", "ウルソデオキシコール酸",
  "カンゾウエキス", "ケイヒ", "チョウジ", "バクモンドウ", "五苓散エキス", "半夏瀉心湯エキス", "芍薬甘草湯エキス"
]
ingredients = {}
ingredients_list.each { |name| ingredients[name] = Ingredient.create!(name: name, detail: "#{name}の代謝助長・保護作用") }

# 3. 商品データの登録 (Drugs) - 25種類 (コンビニ15個 / DS10個)
# category: 0:DS(医薬品等), 1:コンビニ(食品/指定医薬部外品)
# timing: 0:前, 1:中, 2:後, 3:いつでも
drugs_data = [
  # コンビニ系 (15個)
  { name: 'ヘパリーゼW', category: 1, timing: 0, description: '肝臓エキス100mg配合。飲む前の定番。' },
  { name: 'ウコンの力', category: 1, timing: 0, description: 'クルクミン30mg配合。秋ウコンエキス。' },
  { name: 'ウコンの力 超MAX', category: 1, timing: 0, description: 'クルクミン40mgに加え、肝臓エキスも配合。' },
  { name: 'カゴメ トマトジュース', category: 1, timing: 1, description: 'リコピンがアルコール代謝をサポート。' },
  { name: 'ラムネ', category: 1, timing: 1, description: 'ブドウ糖90%配合。低血糖予防に。' },
  { name: 'inゼリー エネルギー', category: 1, timing: 0, description: '空腹での飲酒を避けるためのエネルギー補給。' },
  { name: 'チョコラBBスパークリング', category: 1, timing: 2, description: 'ナイアシン配合。アセトアルデヒド分解を助ける。' },
  { name: 'ソルマック5', category: 1, timing: 1, description: '食べる前に飲む。胃の働きを整える。' },
  { name: '経口補水液OS-1', category: 1, timing: 3, description: '脱水状態の水分補給に最適。' },
  { name: 'ペパリーゼHi', category: 1, timing: 0, description: 'コンドロイチン配合。さらに元気を。' },
  { name: 'TBC 鉄分', category: 1, timing: 3, description: 'ミネラル補給。' },
  { name: 'ウィルキンソン炭酸水', category: 1, timing: 1, description: '水分補給とリフレッシュ。' },
  { name: 'ポカリスエット', category: 1, timing: 1, description: '電解質を素早く補給。' },
  { name: 'しじみ70個分のちから', category: 1, timing: 2, description: 'オルニチンたっぷり。翌朝の味噌汁代わりに。' },
  { name: 'リポビタンD', category: 1, timing: 0, description: 'タウリン1000mg。エネルギーチャージ。' },

  # ドラッグストア系 (10個)
  { name: 'ヘパリーゼGX', category: 0, timing: 0, description: '第3類医薬品。肝臓加水分解物600mg。' },
  { name: 'ハイチオールCプラス', category: 0, timing: 2, description: 'L-システインが代謝を促進し、二日酔いを改善。' },
  { name: 'ミラグレーン錠', category: 0, timing: 3, description: '知る人ぞ知る肝臓薬。牛黄配合。' },
  { name: '太田胃散', category: 0, timing: 1, description: '生薬の力で胃の違和感をスッキリ。' },
  { name: 'パンシロン01+', category: 0, timing: 1, description: '飲みすぎ・胃もたれに。' },
  { name: '五苓散', category: 0, timing: 2, description: '水分の巡りを整え、頭痛・むくみを改善。' },
  { name: '半夏瀉心湯', category: 0, timing: 2, description: '吐き気・下痢・二日酔いのむかつきに。' },
  { name: 'ガスター10', category: 0, timing: 1, description: 'H2ブロッカー。過剰な胃酸を抑える。' },
  { name: 'バファリンA', category: 0, timing: 2, description: '二日酔いの頭痛に。※胃障害注意。' },
  { name: 'ウルソ', category: 0, timing: 0, description: '胆汁酸の分泌を促進し、肝機能を改善。' }
]

drugs = drugs_data.map { |d| Drug.create!(d) }

# 4. 紐付け (DrugSymptom / DrugIngredient) - 代表的なもの
# ヘパリーゼW × 空腹、お酒に弱い / 肝臓エキス
hepa_w = Drug.find_by(name: 'ヘパリーゼW')
DrugSymptom.create!(drug: hepa_w, symptom: symptoms['空腹である'])
DrugSymptom.create!(drug: hepa_w, symptom: symptoms['お酒に弱い体質である'])
DrugIngredient.create!(drug: hepa_w, ingredient: ingredients['肝臓エキス'])

# 五苓散 × 頭痛、むくみ / 五苓散エキス
goreisan = Drug.find_by(name: '五苓散')
DrugSymptom.create!(drug: goreisan, symptom: symptoms['ズキズキする頭痛'])
DrugSymptom.create!(drug: goreisan, symptom: symptoms['むくみがひどい'])
DrugIngredient.create!(drug: goreisan, ingredient: ingredients['五苓散エキス'])

# ラムネ × ふらつく / ブドウ糖
ramune = Drug.find_by(name: 'ラムネ')
DrugSymptom.create!(drug: ramune, symptom: symptoms['少しふらつく'])
DrugIngredient.create!(drug: ramune, ingredient: ingredients['ブドウ糖'])

puts "Seedデータの投入が完了しました！"
