require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'バリデーションのテスト' do
    context '正常系（保存できる場合）' do
      it 'すべての必須項目が正しく入力されていれば、ユーザーが保存されること' do
        user = build(:user)
        expect(user).to be_valid
      end
    end

    # ▼ ここから追加 ▼
    context '異常系（保存できない場合）' do
      it 'メールアドレスが空欄だと保存できないこと' do
        # わざとemailを空にしてダミーユーザーを作る
        user = build(:user, email: '')

        # userが valid? ではない（無効である）ことを期待する
        expect(user).not_to be_valid
      end
    end
    # ▲ ここまで追加 ▲
  end
end
