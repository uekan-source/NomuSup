class Api::V1::DiagnosisLogsController < ApplicationController
  # 【修正】自作の認証メソッドを使用するように変更
  before_action :ensure_logged_in, only: [:index, :show, :destroy]

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

    service = DiagnosisService.new(symptom_ids, timing)
    @suggested_drugs = service.execute

    diagnosis_log = DiagnosisLog.new(
      user_id: current_user&.id, # ゲストの場合はnilが入る
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
    @log = current_user.diagnosis_logs
                       .includes(:symptoms, :drugs)
                       .find(params[:id])

    render json: @log.as_json(
      include: {
        symptoms: { only: [:id, :name, :category] },
        drugs: { only: [:id, :name, :description] } # 薬にcategoryがない場合は消しておきます
      }
    ), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: '履歴が見つかりませんでした' }, status: :not_found
  end

  def destroy
    @log = current_user.diagnosis_logs.find(params[:id])
    if @log.destroy
      render json: { message: '履歴を削除しました' }, status: :ok
    else
      render json: { error: '削除に失敗しました' }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: '履歴が見つかりませんでした' }, status: :not_found
  end

  private

  # 【追加】ログインしていない場合に401を返すメソッド
  def ensure_logged_in
    if current_user.nil?
      render json: { error: "ログインが必要です" }, status: :unauthorized
    end
  end
end