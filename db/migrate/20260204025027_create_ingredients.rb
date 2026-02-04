class CreateIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients, id: :uuid do |t|
      t.string :name
      t.text :detail

      t.timestamps
    end
  end
end
