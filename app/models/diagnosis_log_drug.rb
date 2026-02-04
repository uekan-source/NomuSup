class DiagnosisLogDrug < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :drug
end
