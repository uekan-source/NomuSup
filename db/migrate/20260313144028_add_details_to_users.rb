class AddDetailsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :weight, :integer
    add_column :users, :gender, :string
    add_column :users, :constitution, :string
  end
end
