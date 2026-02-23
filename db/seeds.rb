# 既存データの削除
[DiagnosisLog, DrugIngredient, DrugSymptom, Drug, Ingredient, Symptom].each(&:destroy_all)

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
  # --- コンビニ系 (15個) ---
  { 
    name: 'ヘパリーゼW', 
    category: 1, 
    timing: 0, 
    description: '肝臓エキス100mg配合。飲む前の定番。', 
    pharmacist_advice: '飲み会の30分〜1時間前に飲んでおくのが最も効果的です。成分が吸収され、肝臓が準備運動を始めます。' 
  },
  { 
    name: 'ウコンの力', 
    category: 1, 
    timing: 0, 
    description: 'クルクミン30mg配合。秋ウコンエキス。', 
    pharmacist_advice: '沈殿しやすいので、よく振ってから飲みましょう。乾杯の直前に飲むのがおすすめです。' 
  },
  { 
    name: 'ウコンの力 超MAX', 
    category: 1, 
    timing: 0, 
    description: 'クルクミン40mgに加え、肝臓エキスも配合。', 
    pharmacist_advice: '「今日は長丁場になりそうだ」という時の切り札です。ドロっとしていますが、一気に飲み干して気合を入れましょう。' 
  },
  { 
    name: 'カゴメ トマトジュース', 
    category: 1, 
    timing: 1, 
    description: 'リコピンがアルコール代謝をサポート。', 
    pharmacist_advice: 'お酒と交互に飲む「チェイサー」として優秀です。血中のアルコール濃度の上昇を緩やかにしてくれます。' 
  },
  { 
    name: 'ラムネ', 
    category: 1, 
    timing: 1, 
    description: 'ブドウ糖90%配合。低血糖予防に。', 
    pharmacist_advice: '飲酒により消費された脳のエネルギー（ブドウ糖）を素早く補給できます。酔いが回ってフラフラする時に数粒どうぞ。' 
  },
  { 
    name: 'inゼリー エネルギー', 
    category: 1, 
    timing: 0, 
    description: '空腹での飲酒を避けるためのエネルギー補給。', 
    pharmacist_advice: '空腹で飲むお酒は、胃壁を荒らす最大の原因です。食事をする時間がない時は、これで胃に膜を作ってから挑みましょう。' 
  },
  { 
    name: 'チョコラBBスパークリング', 
    category: 1, 
    timing: 2, 
    description: 'ナイアシン配合。アセトアルデヒド分解を助ける。', 
    pharmacist_advice: '「ナイアシン」は二日酔いの原因物質を分解する補酵素です。翌朝、肌荒れとだるさが気になる女性に特におすすめです。' 
  },
  { 
    name: 'ソルマック5', 
    category: 1, 
    timing: 1, 
    description: '食べる前に飲む。胃の働きを整える。', 
    pharmacist_advice: '苦味が強いですが、それが胃薬の証です。脂っこいおつまみを食べる前に飲んでおくと、翌日の胃もたれが軽減します。' 
  },
  { 
    name: '経口補水液OS-1', 
    category: 1, 
    timing: 3, 
    description: '脱水状態の水分補給に最適。', 
    pharmacist_advice: '二日酔いの頭痛は「脳の脱水」が原因なことが多いです。ガブ飲みせず、少しずつ点滴のように身体に染み渡らせてください。' 
  },
  { 
    name: 'ヘパリーゼHi', 
    category: 1, 
    timing: 0, 
    description: 'コンドロイチン配合。さらに元気を。', 
    pharmacist_advice: '疲れが溜まっている状態での飲み会にはこちら。代謝促進成分が強化されているので、元気を底上げしてくれます。' 
  },
  { 
    name: 'TBC 鉄分', 
    category: 1, 
    timing: 3, 
    description: 'ミネラル補給。', 
    pharmacist_advice: 'アルコールの利尿作用でミネラルも失われます。だるさが抜けない時は、水分と一緒に鉄分などのミネラルを補いましょう。' 
  },
  { 
    name: 'ウィルキンソン炭酸水', 
    category: 1, 
    timing: 1, 
    description: '水分補給とリフレッシュ。', 
    pharmacist_advice: '胃の中で発泡することで満腹感を与え、お酒のペースを落とせます。レモン入りならクエン酸効果も期待できます。' 
  },
  { 
    name: 'ポカリスエット', 
    category: 1, 
    timing: 1, 
    description: '電解質を素早く補給。', 
    pharmacist_advice: '帰宅後、寝る前にコップ1杯飲むだけで翌朝のラクさが違います。アルコールによる脱水を寝ている間に防ぎます。' 
  },
  { 
    name: 'しじみ70個分のちから', 
    category: 1, 
    timing: 2, 
    description: 'オルニチンたっぷり。翌朝の味噌汁代わりに。', 
    pharmacist_advice: '温かい汁物は弱った胃腸を温め、血流を良くします。飲んだ後の締め、または翌朝の朝食に最適です。' 
  },
  { 
    name: 'リポビタンD', 
    category: 1, 
    timing: 0, 
    description: 'タウリン1000mg。エネルギーチャージ。', 
    pharmacist_advice: 'タウリンは肝細胞の修復を助けます。カフェインが含まれるので、これから飲むぞ！という気合入れのタイミングで。' 
  },

  # --- ドラッグストア系 (10個) ---
  { 
    name: 'ヘパリーゼGX', 
    category: 0, 
    timing: 0, 
    description: '第3類医薬品。肝臓加水分解物600mg。', 
    pharmacist_advice: 'ドリンクタイプより成分量が多い医薬品です。頻繁に飲む方は、こちらを常備しておくとコストパフォーマンスが良いです。' 
  },
  { 
    name: 'ハイチオールCプラス', 
    category: 0, 
    timing: 2, 
    description: 'L-システインが代謝を促進し、二日酔いを改善。', 
    pharmacist_advice: '本来は肌の薬ですが、二日酔いの原因物質（アセトアルデヒド）を無毒化する力が強力です。だるさが残る朝に。' 
  },
  { 
    name: 'ミラグレーン錠', 
    category: 0, 
    timing: 3, 
    description: '知る人ぞ知る肝臓薬。牛黄配合。', 
    pharmacist_advice: 'お酒好きの間で「最強」との呼び声高い薬です。飲む前なら2錠、二日酔いになってしまった後なら2錠服用してください。' 
  },
  { 
    name: '太田胃散', 
    category: 0, 
    timing: 1, 
    description: '生薬の力で胃の違和感をスッキリ。', 
    pharmacist_advice: '飲みすぎ特有の「胸焼け」「胃の不快感」にはこれ。独特の香りは生薬（シナモン等）によるもので、胃の動きを高めます。' 
  },
  { 
    name: 'パンシロン01+', 
    category: 0, 
    timing: 1, 
    description: '飲みすぎ・胃もたれに。', 
    pharmacist_advice: '荒れた胃粘膜を修復する成分が入っています。「食べ過ぎ」も併発している時の胃もたれによく効きます。' 
  },
  { 
    name: '五苓散', 
    category: 0, 
    timing: 2, 
    description: '水分の巡りを整え、頭痛・むくみを改善。', 
    pharmacist_advice: '「喉が渇くのに吐いてしまう」「頭が痛い」という、水分の偏りによる二日酔いに特効薬です。お湯に溶かして飲むと効果倍増。' 
  },
  { 
    name: '半夏瀉心湯', 
    category: 0, 
    timing: 2, 
    description: '吐き気・下痢・二日酔いのむかつきに。', 
    pharmacist_advice: 'お腹がゴロゴロする、下痢気味、口内炎ができている等の胃腸トラブルを伴う二日酔いに適しています。' 
  },
  { 
    name: 'ガスター10', 
    category: 0, 
    timing: 1, 
    description: 'H2ブロッカー。過剰な胃酸を抑える。', 
    pharmacist_advice: '胃酸の分泌を強力に止めます。「胃がキリキリ痛む」時に有効ですが、消化機能も落ちるため、服用後は食事を控えめに。' 
  },
  { 
    name: 'バファリンA', 
    category: 0, 
    timing: 2, 
    description: '二日酔いの頭痛に。※胃障害注意。', 
    pharmacist_advice: '【重要】空腹時に飲むと胃を荒らします。アルコールで胃が弱っている時は特に注意し、必ず水多めか、何か食べてから服用してください。' 
  },
  { 
    name: 'ウルソ', 
    category: 0, 
    timing: 0, 
    description: '胆汁酸の分泌を促進し、肝機能を改善。', 
    pharmacist_advice: '脂っこい食事と一緒に飲むお酒にはこれ。胆汁の働きを助け、油ものの消化と肝臓の解毒をダブルでサポートします。' 
  }
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
