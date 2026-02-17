class Api::V1::SymptomsController < ApplicationController
  def index
    # 1. 指定されたタイミングのデータを一括で取得する
    base_query = Symptom.where(timing: params[:timing])

    # 2. 取得したデータをカテゴリごとに振り分けて返却する
    render json: {
      symptoms: base_query.where(category: 0),     # 症状
      constitutions: base_query.where(category: 1)  # 体質
    }, status: :ok
  end
end