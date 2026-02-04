class DrugSymptom < ApplicationRecord
  belongs_to :drug
  belongs_to :symptom
end
