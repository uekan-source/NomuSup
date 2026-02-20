class Api::V1::UsersController < ApplicationController
  def show
    # ApplicationController で作った current_user を呼ぶだけ！
    if current_user
      render json: { id: current_user.id, name: current_user.name, email: current_user.email }, status: :ok
    else
      render json: { error: "ユーザーが見つかりません" }, status: :unauthorized
    end
  end

  def update
    if current_user&.update(user_params)
      render json: { message: 'プロフィールを更新しました', user: current_user }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end
