class Api::V1::Auth::PasswordsController < Devise::PasswordsController
  respond_to :json

  # POST /api/v1/auth/password
  def create
    # ❌ 修正前: Deviseのお任せ機能（ここで迷子になっていた）
    # self.resource = resource_class.send_reset_password_instructions(resource_params)

    # ✅ 修正後: Reactから送られてくる { user: { email: '...' } } を正確にキャッチする
    reset_params = params.require(:user).permit(:email)
    self.resource = resource_class.send_reset_password_instructions(reset_params)

    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { message: 'パスワード再設定メールを送信しました。' }, status: :ok
    else
      render json: { error: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /api/v1/auth/password (新パスワード設定)
  def update
    # こちらも同じく、React側の形に合わせて明示的に取得します
    update_params = params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
    self.resource = resource_class.reset_password_by_token(update_params)
    
    yield resource if block_given?

    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      render json: { message: 'パスワードが正しく変更されました。' }, status: :ok
    else
      render json: { error: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end