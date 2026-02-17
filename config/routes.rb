Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health_check', to: 'health_check#index'
      resources :symptoms, only: [:index]
    end
  end
  # Deviseの認証用ルートを作成
  # path: '' にすることで、デフォルトの /users/sign_in ではなく /login などの名前を使えるようにします
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
end