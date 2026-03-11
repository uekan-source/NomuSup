module Api
  module V1
    module Auth
      class OmniauthCallbacksController < Devise::OmniauthCallbacksController
        # Googleからのコールバックを受け取るアクション
        def google_oauth2
          handle_auth
        end

        def github
          handle_auth
        end

        def twitter
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

            # ▼ 環境変数からフロントエンドのURLを取得（設定されていなければlocalhostを使う）
            frontend_url = ENV['FRONTEND_URL'] || 'http://localhost:5173'

            # 【重要】React側の特定のURLへ、トークンをくっつけてリダイレクト！
            redirect_to "#{frontend_url}/oauth/callback?token=#{token}", allow_other_host: true
          else
            # 失敗した場合：Reactのログイン画面にエラーパラメータをつけてリダイレクト
            redirect_to "#{frontend_url}/login?error=oauth_failed", allow_other_host: true
          end
        end
      end
    end
  end
end
