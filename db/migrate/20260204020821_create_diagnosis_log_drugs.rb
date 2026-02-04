class CreateDiagnosisLogDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_drugs, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :drug, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
