class Ingredient < ApplicationRecord
  has_many :drug_ingredients, dependent: :destroy
  has_many :drugs, through: :drug_ingredients
end
