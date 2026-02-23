class AddResultSummaryToDiagnosisLogs < ActiveRecord::Migration[7.1]
  def change
    add_column :diagnosis_logs, :result_summary, :text
  end
end
