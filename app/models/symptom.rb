class Symptom < ApplicationRecord
  has_many :diagnosis_log_symptoms
  has_many :diagnosis_logs, through: :diagnosis_log_symptoms

  has_many :drug_symptoms, dependent: :destroy
  has_many :drugs, through: :drug_symptoms
end
