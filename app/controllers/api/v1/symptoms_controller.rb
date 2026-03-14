module Api
  module V1
    class SymptomsController < ApplicationController
      def index
        base_query = Symptom.where(timing: params[:timing])

        render json: {
          moods: base_query.where(category: 2),        # 💡 追加：気分・予定
          symptoms: base_query.where(category: 0),     # 症状
          constitutions: base_query.where(category: 1) # 体質
        }, status: :ok
      end
    end
  end
end
