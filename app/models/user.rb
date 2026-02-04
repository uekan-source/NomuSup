class User < ApplicationRecord
  has_many :diagnosis_logs, dependent: :destroy
end
