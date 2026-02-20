class Api::V1::Auth::SessionsController < Devise::SessionsController
  # APIモードなのでJSON形式でレスポンスを返す
  respond_to :json

  # ログイン（サインイン）
  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      # --- ここを修正：トークンを明示的に生成 ---
      # 第1引数はスコープ（通常は :user）、第2引数はユーザー、第3引数はaud（通常は nil）
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil)

      Rails.logger.info "Generated Token: #{token}"
      
      render json: {
        status: 'success',
        token: token, # 生成したトークンを直接入れる
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
    # トークンを無効化する処理（revoke）が走り、ログアウトが完了します
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    render json: {
      status: 'success',
      message: "ログアウトしました"
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