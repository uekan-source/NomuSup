class DiagnosisLogSymptom < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :symptom
end
