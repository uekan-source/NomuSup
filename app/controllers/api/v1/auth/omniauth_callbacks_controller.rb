module Api
  module V1
    module Auth
      class OmniauthCallbacksController < Devise::OmniauthCallbacksController
        # Googleからのコールバックを受け取るアクション
        def google_oauth2
          handle_auth
        end

        private

        def handle_auth
          # Googleから送られてきたユーザー情報
          auth = request.env['omniauth.auth']
          
          # 先ほどUserモデルに書いたメソッドでユーザーを検索・作成
          user = User.from_omniauth(auth)

          if user.persisted?
            # ログイン成功：JWTトークンを発行（既存のログインと同じ処理）
            token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)
            
            # 【重要】React側の特定のURL（後で作ります）へ、トークンをくっつけてリダイレクト！
            redirect_to "http://localhost:5173/oauth/callback?token=#{token}", allow_other_host: true
          else
            # 失敗した場合：Reactのログイン画面にエラーパラメータをつけてリダイレクト
            redirect_to "http://localhost:5173/login?error=oauth_failed", allow_other_host: true
          end
        end
      end
    end
  end
end