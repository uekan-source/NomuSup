class CreateDiagnosisLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_logs, id: :uuid do |t|
      t.uuid :user_id
      t.integer :timing

      t.timestamps
    end
  end
end
