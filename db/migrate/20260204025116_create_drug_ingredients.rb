class CreateDrugIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_ingredients, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :ingredient, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
