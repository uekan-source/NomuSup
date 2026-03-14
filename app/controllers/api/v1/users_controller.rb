module Api
  module V1
    class UsersController < ApplicationController
      def show
        if current_user
          render json: {
            id: current_user.id,
            name: current_user.name,
            email: current_user.email,
            weight: current_user.weight,
            gender: current_user.gender,
            constitution: current_user.constitution
          }, status: :ok
        else
          render json: { error: 'ユーザーが見つかりません' }, status: :unauthorized
        end
      end

      def update
        if current_user&.update(user_params)
          render json: { message: 'プロフィールを更新しました', user: current_user }, status: :ok
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_content
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :weight, :gender, :constitution)
      end
    end
  end
end
