class AddOmniauthToUsers < ActiveRecord::Migration[7.1]
  def change
    # どのサービスからログインしたか（例: 'google_oauth2', 'github'）
    add_column :users, :provider, :string
    
    # そのサービスから渡される、ユーザーごとの絶対に被らないID番号
    add_column :users, :uid, :string

    # ▼ ここから追加 ▼
    # provider と uid の「組み合わせ」が絶対に被らないようにする（ユニーク制約）
    # さらに、ログイン時にこの2つの情報で爆速でユーザーを検索できるようにインデックス（目次）を貼る
    add_index :users, [:provider, :uid], unique: true
    # ▲ ここまで追加 ▲
  end
end