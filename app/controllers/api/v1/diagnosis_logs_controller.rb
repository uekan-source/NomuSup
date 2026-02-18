class Api::V1::DiagnosisLogsController < ApplicationController
  # 一覧と詳細は「ログイン必須」にする（current_user が nil だとエラーになるため）
  # 診断（create）だけは未ログインでもできるようにスキップ設定をするのが一般的です
  before_action :authenticate_user!, only: [:index, :show]

  def index
    @logs = current_user.diagnosis_logs
                        .includes(:symptoms, :drugs)
                        .order(created_at: :desc)

    render json: @logs.as_json(
      include: {
        symptoms: { only: [:id, :name] },
        drugs: { only: [:id, :name, :description] }
      }
    ), status: :ok
  end
  
  def create
    symptom_ids = params[:symptom_ids]
    timing = params[:timing]

    # 【修正ポイント1】Serviceクラスの引数を2つ（ids と timing）にする
    # DiagnosisService.new(symptom_ids, timing) と定義されているため合わせる必要があります
    service = DiagnosisService.new(symptom_ids, timing)
    @suggested_drugs = service.execute

    diagnosis_log = DiagnosisLog.new(
      user_id: current_user&.id,
      timing: timing
    )

    if diagnosis_log.save
      diagnosis_log.symptom_ids = symptom_ids
      diagnosis_log.drug_ids = @suggested_drugs.pluck(:id)

      render json: {
        status: 'success',
        diagnosis_log_id: diagnosis_log.id,
        suggested_drugs: @suggested_drugs
      }, status: :created
    else
      render json: { status: 'error', message: diagnosis_log.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    # 【修正ポイント2】current_user が nil の場合に備え、ログインチェック済みのアクションにする
    @log = current_user.diagnosis_logs
                       .includes(:symptoms, :drugs)
                       .find(params[:id])

    render json: @log.as_json(
      include: {
        symptoms: { only: [:id, :name, :category] },
        drugs: { only: [:id, :name, :description, :category] }
      }
    ), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: '履歴が見つかりませんでした' }, status: :not_found
  end
end