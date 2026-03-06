require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Sessions', type: :request do
  before do
    host! 'localhost'
  end

  describe 'POST /api/v1/auth/login (ログインAPI)' do
    let(:user) { create(:user, email: 'test@example.com', password: 'password123') }

    context '正しいメールアドレスとパスワードを送信した場合' do
      it 'ログインに成功し、ステータス200と認証トークンが返ってくること' do
        post '/api/v1/auth/login', params: {
          user: {
            email: user.email,
            password: user.password
          }
        }, as: :json

        # 1. ステータス200 (OK) が返ること
        expect(response).to have_http_status(:success)

        # 2. 返ってきたJSONテキストをRubyで扱えるように変換（パース）する
        json_response = response.parsed_body

        # 3. JSONの中に 'token' が存在していることを確認！
        expect(json_response['token']).to be_present
      end
    end

    context '間違ったパスワードを送信した場合' do
      it 'ログインに失敗し、ステータス401 (Unauthorized) が返ってくること' do
        post '/api/v1/auth/login', params: {
          user: {
            email: user.email,
            password: 'wrong_password'
          }
        }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
