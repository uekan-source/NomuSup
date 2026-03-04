module Api
  module V1
    class HealthCheckController < ApplicationController
      def index
        render json: { message: 'Rails APIとの接続に成功しました！' }, status: :ok
      end
    end
  end
end
