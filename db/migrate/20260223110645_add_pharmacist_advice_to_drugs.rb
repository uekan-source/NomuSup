class AddPharmacistAdviceToDrugs < ActiveRecord::Migration[7.1]
  def change
    add_column :drugs, :pharmacist_advice, :text
  end
end
