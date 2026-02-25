class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  before_action :configure_sign_up_params, only: [:create]

  def create
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)
      
      render json: {
        status: 'success',
        token: token, 
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
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end