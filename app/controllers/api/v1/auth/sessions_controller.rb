module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        # APIモードなのでJSON形式でレスポンスを返す
        respond_to :json

        # ログイン（サインイン）
        def create
          user = User.find_by(email: params[:user][:email])

          if user&.valid_password?(params[:user][:password])
            token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

            Rails.logger.info "Generated Token: #{token}"

            render json: {
              status: 'success',
              token: token,
              data: user
            }, status: :ok
          else
            render json: {
              status: 'error',
              message: 'メールアドレスまたはパスワードが間違っています。'
            }, status: :unauthorized
          end
        end

        # ログアウト（サインアウト）
        def destroy
          (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
          render json: {
            status: 'success',
            message: 'ログアウトしました'
          }, status: :ok
        end

        private

        # Deviseに渡すパラメーターの形式を定義
        def sign_in_params
          params.require(:user).permit(:email, :password)
        end

        # 認証失敗時の挙動をカスタマイズ（401 Unauthorizedを返す）
        def respond_to_on_destroy
          head :no_content
        end
      end
    end
  end
end
