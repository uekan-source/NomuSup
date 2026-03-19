class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: self,
         omniauth_providers: %i[google_oauth2 github twitter]

  has_many :diagnosis_logs, dependent: :destroy

  def self.jwt_revocation_strategy
    self
  end

  # OmniAuthのデータからユーザーを探す、または作るメソッド
  def self.from_omniauth(auth)
    provider_email = auth.info.email || "#{auth.uid}-#{auth.provider}@example.com"
    where(email: provider_email).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name || 'ユーザー'
    end
  end
end
