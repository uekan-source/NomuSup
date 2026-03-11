module Api
  module V1
    module Auth
      class PasswordsController < Devise::PasswordsController
        respond_to :json

        # POST /api/v1/auth/password
        def create
          reset_params = params.require(:user).permit(:email)
          self.resource = resource_class.send_reset_password_instructions(reset_params)

          yield resource if block_given?

          if successfully_sent?(resource)
            render json: { message: 'パスワード再設定メールを送信しました。' }, status: :ok
          else
            render json: { error: resource.errors.full_messages }, status: :unprocessable_content
          end
        end

        # PUT /api/v1/auth/password (新パスワード設定)
        def update
          update_params = params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
          self.resource = resource_class.reset_password_by_token(update_params)

          yield resource if block_given?

          if resource.errors.empty?
            resource.unlock_access! if unlockable?(resource)
            render json: { message: 'パスワードが正しく変更されました。' }, status: :ok
          else
            render json: { error: resource.errors.full_messages }, status: :unprocessable_content
          end
        end
        # rubocop:enable all
      end
    end
  end
end
