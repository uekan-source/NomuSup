class AddDeviseToUsers < ActiveRecord::Migration[7.1]
  def self.up
    change_table :users do |t|
      # emailはすでにあるので、ここでは「encrypted_password」だけ追加します
      t.string :encrypted_password, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at
    end

    # emailカラム自体はあるはずなので、もしindexがなければ追加、
    # password_digest（古い欄）が不要なら削除します
    remove_column :users, :password_digest, :string
    
    # indexの追加（既存のemailにユニーク制約をかける）
    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
  end
end
