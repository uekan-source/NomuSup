class EnablePgcrypto < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto' # PostgreSQLのUUID生成機能をONにする
  end
end
