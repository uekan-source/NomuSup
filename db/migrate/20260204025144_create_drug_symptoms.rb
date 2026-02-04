class CreateDrugSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_symptoms, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
