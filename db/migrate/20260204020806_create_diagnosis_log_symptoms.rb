class CreateDiagnosisLogSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_symptoms, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
