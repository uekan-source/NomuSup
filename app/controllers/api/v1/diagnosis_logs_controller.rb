class Api::V1::DiagnosisLogsController < ApplicationController
  # 診断履歴の一覧を取得
  def index
    # 1. ログインユーザーに紐づく履歴を取得
    # .includes を使って「N+1問題」を回避し、関連する症状と薬を一括ロードする
    @logs = current_user.diagnosis_logs
                        .includes(:symptoms, :drugs)
                        .order(created_at: :desc)

    # 2. JSON形式で返却
    # 履歴本体だけでなく、紐づく symptoms と drugs の name なども含める
    render json: @logs.as_json(
      include: {
        symptoms: { only: [:id, :name] },
        drugs: { only: [:id, :name, :description] }
      }
    ), status: :ok
  end
  
  def create
    # 1. フロントから送られてきた症状IDリストを受け取る
    symptom_ids = params[:symptom_ids]
    timing = params[:timing]

    # 2. Serviceクラス（専門家）を呼び出して、推奨薬を判定する
    service = DiagnosisService.new(symptom_ids)
    @suggested_drugs = service.execute

    # 3. 診断結果をDBに保存する（DiagnosisLog と中間テーブル）
    # user_id はログインしていれば current_user.id、していなければ nil になります
    diagnosis_log = DiagnosisLog.new(
      user_id: current_user&.id,
      timing: timing
    )

    if diagnosis_log.save
      # 診断に紐づく症状と薬を中間テーブルに保存
      diagnosis_log.symptom_ids = symptom_ids
      diagnosis_log.drug_ids = @suggested_drugs.pluck(:id)

      # 4. 判定された薬の情報をJSONで返す
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
  # ログインユーザーの履歴から、指定されたIDのものを1件取得
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