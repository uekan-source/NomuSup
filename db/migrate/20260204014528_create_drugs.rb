class CreateDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :drugs, id: :uuid do |t|
      t.string :name
      t.integer :category
      t.integer :timing
      t.text :description

      t.timestamps
    end
  end
end
