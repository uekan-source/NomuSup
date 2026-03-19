# APIモード特有のエラーを防ぐための設定（POSTリクエスト以外も許可する等）
OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true

Rails.application.config.middleware.use OmniAuth::Builder do
  # Google連携の設定
  # ※ 実際のIDとSecretは直接書かず、環境変数（ENV）から読み込む（セキュリティ対策）
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
    # 取得したい情報（メールアドレスと基本プロフィール）
    scope: 'email, profile',
    # 毎回アカウント選択画面を出す（複数アカウントを持っているユーザーへの配慮）
    prompt: 'select_account',
    # プロフィール画像のサイズ指定
    image_aspect_ratio: 'square',
    image_size: 50
  }

  # GitHubの設定（メアド取得の権限をリクエスト）
  provider :github, ENV['GITHUB_CLIENT_ID'], ENV['GITHUB_CLIENT_SECRET'], scope: 'user:email'
  
  # X(Twitter)の設定
  provider :twitter, ENV['TWITTER_API_KEY'], ENV['TWITTER_API_SECRET']
end