class ApplicationController < ActionController::API
include ActionController::MimeResponds

  # Deviseのパラメーター許可設定（既存のコード）
  before_action :configure_permitted_parameters, if: :devise_controller?

  # --- 追加：自作の current_user メソッド ---
  # どのコントローラーからでも呼べるようにします
  def current_user
    auth_header = request.headers['Authorization']
    token = auth_header.split(' ').last if auth_header.present?

    # トークンがない（未ログイン・ゲスト）場合は nil を返す
    return nil if token.blank? || token == 'null'

    begin
      # トークンがあれば解読してユーザーを探す
      payload = Warden::JWTAuth::TokenDecoder.new.call(token)
      User.find_by(id: payload['sub'])
    rescue
      # トークンの期限切れや不正な場合はゲスト（nil）として扱う
      nil
    end
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end