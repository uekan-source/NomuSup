module Api
  module V1
    class DiagnosisLogsController < ApplicationController
      # 【修正】自作の認証メソッドを使用するように変更
      before_action :ensure_logged_in, only: %i[index show create destroy]

      def index
        @logs = current_user.diagnosis_logs
                            .includes(:symptoms, :drugs)
                            .order(created_at: :desc)

        render json: @logs.as_json(
          include: {
            symptoms: { only: %i[id name] },
            drugs: { only: %i[id name description pharmacist_advice] }
          }
        ), status: :ok
      end

      def calculate
        symptom_ids = params[:symptom_ids] || []
        timing = params[:timing]

        service = DiagnosisService.new(symptom_ids, timing)
        result = service.execute # { drugs: [...], summary: "..." } が返ってくる

        render json: {
          status: 'success',
          suggested_drugs: result[:drugs],
          result_summary: result[:summary],
          symptom_ids: symptom_ids,
          timing: timing
        }, status: :ok
      end

      def show
        @log = current_user.diagnosis_logs
                           .includes(:symptoms, :drugs)
                           .find(params[:id])

        render json: @log.as_json(
          include: {
            symptoms: { only: %i[id name category] },
            drugs: { only: %i[id name description pharmacist_advice] } # 薬にcategoryがない場合は消しておきます
          }
        ), status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: '履歴が見つかりませんでした' }, status: :not_found
      end

      def create
        symptom_ids = params[:symptom_ids]
        timing = params[:timing]
        drug_ids = params[:drug_ids]
        result_summary = params[:result_summary]

        diagnosis_log = current_user.diagnosis_logs.build(
          timing: timing,
          result_summary: result_summary
        )

        if diagnosis_log.save
          diagnosis_log.symptom_ids = symptom_ids
          diagnosis_log.drug_ids = drug_ids

          render json: {
            status: 'success',
            diagnosis_log_id: diagnosis_log.id
          }, status: :created
        else
          render json: { status: 'error', message: diagnosis_log.errors.full_messages }, status: :unprocessable_content
        end
      end
      # rubocop:enable all

      def destroy
        @log = current_user.diagnosis_logs.find(params[:id])
        if @log.destroy
          render json: { message: '履歴を削除しました' }, status: :ok
        else
          render json: { error: '削除に失敗しました' }, status: :unprocessable_content
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: '履歴が見つかりませんでした' }, status: :not_found
      end

      private

      # 【追加】ログインしていない場合に401を返すメソッド
      def ensure_logged_in
        return unless current_user.nil?

        render json: { error: 'ログインが必要です' }, status: :unauthorized
      end
    end
  end
end
