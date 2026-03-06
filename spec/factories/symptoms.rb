# spec/factories/symptoms.rb
FactoryBot.define do
  factory :symptom do
    name { 'テスト症状' }
    category { :symptom } # または 0
  end
end
