class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user! # ログイン必須

  # マイページ表示用
  def show
    render json: {
      id: current_user.id,
      email: current_user.email,
      name: current_user.name # usersテーブルにnameカラムを追加した場合
    }, status: :ok
  end

  # プロフィール更新用
  def update
    if current_user.update(user_params)
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
