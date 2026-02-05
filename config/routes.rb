Rails.application.config.middleware.insert_before 0, Rack::Cors do
  # ... (先ほど書いたCORS設定)
end

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health_check', to: 'health_check#index'
    end
  end
end