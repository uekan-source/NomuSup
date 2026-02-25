Rails.application.routes.draw do
  get 'magic_seed', to: proc {
    # サーバーの裏側でマイグレーションとシードを強制実行する
    result = `bin/rails db:migrate db:seed`
    [200, {'Content-Type' => 'text/plain; charset=utf-8'}, ["実行完了しました！\n\n#{result}"]]
  }
  namespace :api do
    namespace :v1 do
      get 'health_check', to: 'health_check#index'
      resources :symptoms, only: [:index]
      resources :diagnosis_logs, only: [:index, :show, :create, :destroy] do
        collection do
          post :calculate # 診断のみ（DB保存しない）
        end
      end
      get 'me', to: 'users#show'
      patch 'me', to: 'users#update'

      # DeviseのルートをAPIのパス配下に設定
      devise_for :users, skip: [:sessions, :registrations, :passwords], controllers: {
        sessions: 'api/v1/auth/sessions',
        registrations: 'api/v1/auth/registrations'
      }

      # パスを /api/v1/auth/signup などに明示的にマッピング
      devise_scope :api_v1_user do
        post 'auth/signup', to: 'auth/registrations#create'
        post 'auth/login', to: 'auth/sessions#create'
        delete 'auth/logout', to: 'auth/sessions#destroy'
        post 'auth/password', to: 'auth/passwords#create' # メール送信依頼用
        put 'auth/password', to: 'auth/passwords#update'  # 新パスワード設定用
      end
    end
  end
end