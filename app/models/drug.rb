class Drug < ApplicationRecord
  has_many :diagnosis_log_drugs, dependent: :destroy
  has_many :diagnosis_logs, through: :diagnosis_log_drugs

  has_many :drug_ingredients, dependent: :destroy
  has_many :ingredients, through: :drug_ingredients

  has_many :drug_symptoms, dependent: :destroy
  has_many :symptoms, through: :drug_symptoms

  enum :category, { medicine: 0, food: 1 }
  enum :timing, { before: 0, during: 1, after: 2, any: 3 }
end
