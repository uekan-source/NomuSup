class User < ApplicationRecord
# 1. JWTの廃棄戦略を読み込む（これも必要なので追加しておきましょう）
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # 2. カンマを正しく閉じ、JWTの設定も追加する
  devise :database_authenticatable, :registerable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
         
  has_many :diagnosis_logs, dependent: :destroy
end
