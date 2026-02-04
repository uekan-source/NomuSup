class AddDetailsToSymptoms < ActiveRecord::Migration[7.1]
  def change
    add_column :symptoms, :timing, :integer
    add_column :symptoms, :category, :integer
  end
end
