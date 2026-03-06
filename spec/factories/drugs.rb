# spec/factories/drugs.rb
FactoryBot.define do
  factory :drug do
    name { 'テスト薬' }
    description { 'テスト用の薬です' }
    pharmacist_advice { '用法用量を守ってください' }
    category { :medicine } # 0
    timing { :any }        # 3
  end
end