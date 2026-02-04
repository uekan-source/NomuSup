class CreateSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :symptoms, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
