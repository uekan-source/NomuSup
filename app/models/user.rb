class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # ▼ :omniauthable, omniauth_providers: [:google_oauth2] を追加
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: self, omniauth_providers: [:google_oauth2]

  has_many :diagnosis_logs, dependent: :destroy

  def self.jwt_revocation_strategy
    self
  end

  # OmniAuthのデータからユーザーを探す、または作るメソッド
  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      # Googleログインの場合、パスワードはGoogleが担保するのでランダムな文字列を設定
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name || "ユーザー"
    end
  end
end