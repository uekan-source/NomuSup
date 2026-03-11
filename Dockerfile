FROM ruby:3.3.0

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs postgresql-client

WORKDIR /app

# 環境変数の設定 (本番モード)
ENV RAILS_ENV="production" \
    RAILS_SERVE_STATIC_FILES="true" \
    RAILS_LOG_TO_STDOUT="true"

COPY Gemfile Gemfile.lock /app/
RUN bundle config set --local without 'development test' && bundle install

COPY . /app

# bin配下の実行権限を付与
RUN chmod +x /app/bin/*

# サーバー起動設定
# サーバー起動設定（マイグレーションをしてから起動する）
CMD bash -c "bundle exec rails db:migrate && bundle exec rails s -p 3000 -b 0.0.0.0"
