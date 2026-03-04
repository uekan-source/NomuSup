class DiagnosisLog < ApplicationRecord
  belongs_to :user, optional: true # ログインなしでも診断できる場合は optional: true
  has_many :diagnosis_log_symptoms, dependent: :destroy
  has_many :symptoms, through: :diagnosis_log_symptoms

  has_many :diagnosis_log_drugs, dependent: :destroy
  has_many :drugs, through: :diagnosis_log_drugs

  enum :timing, { before_drinking: 0, during_drinking: 1, after_drinking: 2 }
end
