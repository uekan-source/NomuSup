class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  def create
    # 【修正】sign_up_params は Devise のデフォルトで params[:user] を見てくれます
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      render json: {
        status: 'success',
        data: resource
      }, status: :ok
    else
      render json: {
        status: 'error',
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  protected

  def configure_sign_up_params
    # Devise のストロングパラメーター：user キーの中の name を許可
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  # 【削除】以前定義した sign_up_params メソッドが params.permit(...) で
  # フラットなデータを期待していたため、削除するか、以下のように書き換えます
  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end