## File: ./config/database.yml
 ```yml
# PostgreSQL. Versions 9.3 and up are supported.
#
# Install the pg driver:
#   gem install pg
# On macOS with Homebrew:
#   gem install pg -- --with-pg-config=/usr/local/bin/pg_config
# On Windows:
#   gem install pg
#       Choose the win32 build.
#       Install PostgreSQL and put its /bin directory on your path.
#
# Configure Using Gemfile
# gem "pg"
#
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  host: db
  port: 5432
  username: postgres
  password: password

development:
  <<: *default
  database: app_development

  # The specified database role being used to connect to PostgreSQL.
  # To create additional roles in PostgreSQL see `$ createuser --help`.
  # When left blank, PostgreSQL will use the default role. This is
  # the same name as the operating system user running Rails.
  #username: app

  # The password associated with the PostgreSQL role (username).
  #password:

  # Connect on a TCP socket. Omitted by default since the client uses a
  # domain socket that doesn't need configuration. Windows does not have
  # domain sockets, so uncomment these lines.
  #host: localhost

  # The TCP port the server listens on. Defaults to 5432.
  # If your server runs on a different port number, change accordingly.
  #port: 5432

  # Schema search path. The server defaults to $user,public
  #schema_search_path: myapp,sharedapp,public

  # Minimum log levels, in increasing order:
  #   debug5, debug4, debug3, debug2, debug1,
  #   log, notice, warning, error, fatal, and panic
  # Defaults to warning.
  #min_messages: notice

# Warning: The database defined as "test" will be erased and
# re-generated from your development database when you run "rake".
# Do not set this db to the same as development or production.
test:
  <<: *default
  database: app_test

# As with config/credentials.yml, you never want to store sensitive information,
# like your database password, in your source code. If your source code is
# ever seen by anyone, they now have access to your database.
#
# Instead, provide the password or a full connection URL as an environment
# variable when you boot the app. For example:
#
#   DATABASE_URL="postgres://myuser:mypass@localhost/somedatabase"
#
# If the connection URL is provided in the special DATABASE_URL environment
# variable, Rails will automatically merge its configuration values on top of
# the values provided in this file. Alternatively, you can specify a connection
# URL environment variable explicitly:
#
#   production:
#     url: <%= ENV["MY_APP_DATABASE_URL"] %>
#
# Read https://guides.rubyonrails.org/configuring.html#configuring-a-database
# for a full overview on how database connection configuration can be specified.
#
production:
  <<: *default
  url: <%= ENV['DATABASE_URL'] %>
  database: app_production
  username: app
  password: <%= ENV["APP_DATABASE_PASSWORD"] %>
 ```

## File: ./config/initializers/inflections.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Add new inflection rules using the following format. Inflections
# are locale specific, and you may define rules for as many different
# locales as you wish. All of these examples are active by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.plural /^(ox)$/i, "\\1en"
#   inflect.singular /^(ox)en/i, "\\1"
#   inflect.irregular "person", "people"
#   inflect.uncountable %w( fish sheep )
# end

# These inflection rules are supported but not enabled by default:
# ActiveSupport::Inflector.inflections(:en) do |inflect|
#   inflect.acronym "RESTful"
# end
 ```

## File: ./config/initializers/devise.rb
 ```rb
# frozen_string_literal: true

# Assuming you have not yet modified this file, each configuration option below
# is set to its default value. Note that some are commented out while others
# are not: uncommented lines are intended to protect your configuration from
# breaking changes in upgrades (i.e., in the event that future versions of
# Devise change the default values for those options).
#
# Use this hook to configure devise mailer, warden hooks and so forth.
# Many of these configuration options can be set straight in your model.
Devise.setup do |config|
  config.jwt do |jwt|
    # 先ほどコピーした長い文字列をここに貼り付けます
    jwt.secret = '987ba70954a4ef34eff93e1318e3008619de5baed83a2b2cb9344c0292bac05290a79f55276b66b54dd3a72f58b8eef546b1799665363e0e48dcc80a4638a33c'
    
    # ログイン・ログアウトのURLパターン
    jwt.dispatch_requests = [
      ['POST', %r{^/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/logout$}]
    ]
    
    # 有効期限（1日）
    jwt.expiration_time = 1.day.to_i
  end
  # The secret key used by Devise. Devise uses this key to generate
  # random tokens. Changing this key will render invalid all existing
  # confirmation, reset password and unlock tokens in the database.
  # Devise will use the `secret_key_base` as its `secret_key`
  # by default. You can change it below and use your own secret key.
  # config.secret_key = '177d3b8dae307509b4b3a5e93e1fdad907b6714387ef8b38738dc310989b74c08ab22e4d3eec85359c79b4e803adac02cf6e42443595c892cdc92644ee7625c8'

  # ==> Controller configuration
  # Configure the parent class to the devise controllers.
  # config.parent_controller = 'DeviseController'

  # ==> Mailer Configuration
  # Configure the e-mail address which will be shown in Devise::Mailer,
  # note that it will be overwritten if you use your own mailer class
  # with default "from" parameter.
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  # Configure the class responsible to send e-mails.
  # config.mailer = 'Devise::Mailer'

  # Configure the parent class responsible to send e-mails.
  # config.parent_mailer = 'ActionMailer::Base'

  # ==> ORM configuration
  # Load and configure the ORM. Supports :active_record (default) and
  # :mongoid (bson_ext recommended) by default. Other ORMs may be
  # available as additional gems.
  require 'devise/orm/active_record'

  # ==> Configuration for any authentication mechanism
  # Configure which keys are used when authenticating a user. The default is
  # just :email. You can configure it to use [:username, :subdomain], so for
  # authenticating a user, both parameters are required. Remember that those
  # parameters are used only when authenticating and not when retrieving from
  # session. If you need permissions, you should implement that in a before filter.
  # You can also supply a hash where the value is a boolean determining whether
  # or not authentication should be aborted when the value is not present.
  # config.authentication_keys = [:email]

  # Configure parameters from the request object used for authentication. Each entry
  # given should be a request method and it will automatically be passed to the
  # find_for_authentication method and considered in your model lookup. For instance,
  # if you set :request_keys to [:subdomain], :subdomain will be used on authentication.
  # The same considerations mentioned for authentication_keys also apply to request_keys.
  # config.request_keys = []

  # Configure which authentication keys should be case-insensitive.
  # These keys will be downcased upon creating or modifying a user and when used
  # to authenticate or find a user. Default is :email.
  config.case_insensitive_keys = [:email]

  # Configure which authentication keys should have whitespace stripped.
  # These keys will have whitespace before and after removed upon creating or
  # modifying a user and when used to authenticate or find a user. Default is :email.
  config.strip_whitespace_keys = [:email]

  # Tell if authentication through request.params is enabled. True by default.
  # It can be set to an array that will enable params authentication only for the
  # given strategies, for example, `config.params_authenticatable = [:database]` will
  # enable it only for database (email + password) authentication.
  # config.params_authenticatable = true

  # Tell if authentication through HTTP Auth is enabled. False by default.
  # It can be set to an array that will enable http authentication only for the
  # given strategies, for example, `config.http_authenticatable = [:database]` will
  # enable it only for database authentication.
  # For API-only applications to support authentication "out-of-the-box", you will likely want to
  # enable this with :database unless you are using a custom strategy.
  # The supported strategies are:
  # :database      = Support basic authentication with authentication key + password
  # config.http_authenticatable = false

  # If 401 status code should be returned for AJAX requests. True by default.
  # config.http_authenticatable_on_xhr = true

  # The realm used in Http Basic Authentication. 'Application' by default.
  # config.http_authentication_realm = 'Application'

  # It will change confirmation, password recovery and other workflows
  # to behave the same regardless if the e-mail provided was right or wrong.
  # Does not affect registerable.
  # config.paranoid = true

  # By default Devise will store the user in session. You can skip storage for
  # particular strategies by setting this option.
  # Notice that if you are skipping storage for all authentication paths, you
  # may want to disable generating routes to Devise's sessions controller by
  # passing skip: :sessions to `devise_for` in your config/routes.rb
  config.skip_session_storage = [:http_auth, :params_auth]

  # By default, Devise cleans up the CSRF token on authentication to
  # avoid CSRF token fixation attacks. This means that, when using AJAX
  # requests for sign in and sign up, you need to get a new CSRF token
  # from the server. You can disable this option at your own risk.
  # config.clean_up_csrf_token_on_authentication = true

  # When false, Devise will not attempt to reload routes on eager load.
  # This can reduce the time taken to boot the app but if your application
  # requires the Devise mappings to be loaded during boot time the application
  # won't boot properly.
  # config.reload_routes = true

  # ==> Configuration for :database_authenticatable
  # For bcrypt, this is the cost for hashing the password and defaults to 12. If
  # using other algorithms, it sets how many times you want the password to be hashed.
  # The number of stretches used for generating the hashed password are stored
  # with the hashed password. This allows you to change the stretches without
  # invalidating existing passwords.
  #
  # Limiting the stretches to just one in testing will increase the performance of
  # your test suite dramatically. However, it is STRONGLY RECOMMENDED to not use
  # a value less than 10 in other environments. Note that, for bcrypt (the default
  # algorithm), the cost increases exponentially with the number of stretches (e.g.
  # a value of 20 is already extremely slow: approx. 60 seconds for 1 calculation).
  config.stretches = Rails.env.test? ? 1 : 12

  # Set up a pepper to generate the hashed password.
  # config.pepper = '52b64ad050cdea612e0447198e6adcb1b2d75e3eb74da3e5d2d2bb5774944913b96d8da5ce6e19b47ad9b60f90a759fabb250dd8803c2e5d48042c3ff5922446'

  # Send a notification to the original email when the user's email is changed.
  # config.send_email_changed_notification = false

  # Send a notification email when the user's password is changed.
  # config.send_password_change_notification = false

  # ==> Configuration for :confirmable
  # A period that the user is allowed to access the website even without
  # confirming their account. For instance, if set to 2.days, the user will be
  # able to access the website for two days without confirming their account,
  # access will be blocked just in the third day.
  # You can also set it to nil, which will allow the user to access the website
  # without confirming their account.
  # Default is 0.days, meaning the user cannot access the website without
  # confirming their account.
  # config.allow_unconfirmed_access_for = 2.days

  # A period that the user is allowed to confirm their account before their
  # token becomes invalid. For example, if set to 3.days, the user can confirm
  # their account within 3 days after the mail was sent, but on the fourth day
  # their account can't be confirmed with the token any more.
  # Default is nil, meaning there is no restriction on how long a user can take
  # before confirming their account.
  # config.confirm_within = 3.days

  # If true, requires any email changes to be confirmed (exactly the same way as
  # initial account confirmation) to be applied. Requires additional unconfirmed_email
  # db field (see migrations). Until confirmed, new email is stored in
  # unconfirmed_email column, and copied to email column on successful confirmation.
  # Also, when used in conjunction with `send_email_changed_notification`,
  # the notification is sent to the original email when the change is requested,
  # not when the unconfirmed email is confirmed.
  config.reconfirmable = true

  # Defines which key will be used when confirming an account
  # config.confirmation_keys = [:email]

  # ==> Configuration for :rememberable
  # The time the user will be remembered without asking for credentials again.
  # config.remember_for = 2.weeks

  # Invalidates all the remember me tokens when the user signs out.
  config.expire_all_remember_me_on_sign_out = true

  # If true, extends the user's remember period when remembered via cookie.
  # config.extend_remember_period = false

  # Options to be passed to the created cookie. For instance, you can set
  # secure: true in order to force SSL only cookies.
  # config.rememberable_options = {}

  # ==> Configuration for :validatable
  # Range for password length.
  config.password_length = 6..128

  # Email regex used to validate email formats. It simply asserts that
  # one (and only one) @ exists in the given string. This is mainly
  # to give user feedback and not to assert the e-mail validity.
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # ==> Configuration for :timeoutable
  # The time you want to timeout the user session without activity. After this
  # time the user will be asked for credentials again. Default is 30 minutes.
  # config.timeout_in = 30.minutes

  # ==> Configuration for :lockable
  # Defines which strategy will be used to lock an account.
  # :failed_attempts = Locks an account after a number of failed attempts to sign in.
  # :none            = No lock strategy. You should handle locking by yourself.
  # config.lock_strategy = :failed_attempts

  # Defines which key will be used when locking and unlocking an account
  # config.unlock_keys = [:email]

  # Defines which strategy will be used to unlock an account.
  # :email = Sends an unlock link to the user email
  # :time  = Re-enables login after a certain amount of time (see :unlock_in below)
  # :both  = Enables both strategies
  # :none  = No unlock strategy. You should handle unlocking by yourself.
  # config.unlock_strategy = :both

  # Number of authentication tries before locking an account if lock_strategy
  # is failed attempts.
  # config.maximum_attempts = 20

  # Time interval to unlock the account if :time is enabled as unlock_strategy.
  # config.unlock_in = 1.hour

  # Warn on the last attempt before the account is locked.
  # config.last_attempt_warning = true

  # ==> Configuration for :recoverable
  #
  # Defines which key will be used when recovering the password for an account
  # config.reset_password_keys = [:email]

  # Time interval you can reset your password with a reset password key.
  # Don't put a too small interval or your users won't have the time to
  # change their passwords.
  config.reset_password_within = 6.hours

  # When set to false, does not sign a user in automatically after their password is
  # reset. Defaults to true, so a user is signed in automatically after a reset.
  # config.sign_in_after_reset_password = true

  # ==> Configuration for :encryptable
  # Allow you to use another hashing or encryption algorithm besides bcrypt (default).
  # You can use :sha1, :sha512 or algorithms from others authentication tools as
  # :clearance_sha1, :authlogic_sha512 (then you should set stretches above to 20
  # for default behavior) and :restful_authentication_sha1 (then you should set
  # stretches to 10, and copy REST_AUTH_SITE_KEY to pepper).
  #
  # Require the `devise-encryptable` gem when using anything other than bcrypt
  # config.encryptor = :sha512

  # ==> Scopes configuration
  # Turn scoped views on. Before rendering "sessions/new", it will first check for
  # "users/sessions/new". It's turned off by default because it's slower if you
  # are using only default views.
  # config.scoped_views = false

  # Configure the default scope given to Warden. By default it's the first
  # devise role declared in your routes (usually :user).
  # config.default_scope = :user

  # Set this configuration to false if you want /users/sign_out to sign out
  # only the current scope. By default, Devise signs out all scopes.
  # config.sign_out_all_scopes = true

  # ==> Navigation configuration
  # Lists the formats that should be treated as navigational. Formats like
  # :html should redirect to the sign in page when the user does not have
  # access, but formats like :xml or :json, should return 401.
  #
  # If you have any extra navigational formats, like :iphone or :mobile, you
  # should add them to the navigational formats lists.
  #
  # The "*/*" below is required to match Internet Explorer requests.
  # config.navigational_formats = ['*/*', :html, :turbo_stream]

  # The default HTTP method used to sign out a resource. Default is :delete.
  config.sign_out_via = :delete

  # ==> OmniAuth
  # Add a new OmniAuth provider. Check the wiki for more information on setting
  # up on your models and hooks.
  # config.omniauth :github, 'APP_ID', 'APP_SECRET', scope: 'user,public_repo'

  # ==> Warden configuration
  # If you want to use other strategies, that are not supported by Devise, or
  # change the failure app, you can configure them inside the config.warden block.
  #
  # config.warden do |warden_config|
  #   warden_config.intercept_401 = false
  #   warden_config.default_strategies(scope: :user).unshift :some_external_strategy
  # end

  # ==> Mountable engine configurations
  # When using Devise inside an engine, let's call it `MyEngine`, and this engine
  # is mountable, there are some extra configurations to be taken into account.
  # The following options are available, assuming the engine is mounted as:
  #
  #     mount MyEngine, at: '/my_engine'
  #
  # The router that invoked `devise_for`, in the example above, would be:
  # config.router_name = :my_engine
  #
  # When using OmniAuth, Devise cannot automatically set OmniAuth path,
  # so you need to do it manually. For the users scope, it would be:
  # config.omniauth_path_prefix = '/my_engine/users/auth'

  # ==> Hotwire/Turbo configuration
  # When using Devise with Hotwire/Turbo, the http status for error responses
  # and some redirects must match the following. The default in Devise for existing
  # apps is `200 OK` and `302 Found` respectively, but new apps are generated with
  # these new defaults that match Hotwire/Turbo behavior.
  # Note: These might become the new default in future versions of Devise.
  config.responder.error_status = :unprocessable_content
  config.responder.redirect_status = :see_other

  # ==> Configuration for :registerable

  # When set to false, does not sign a user in automatically after their password is
  # changed. Defaults to true, so a user is signed in automatically after changing a password.
  # config.sign_in_after_change_password = true
end
 ```

## File: ./config/initializers/cors.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # VercelのURL、または開発用のlocalhostからのアクセスを許可
    origins "localhost:5173", "https://nomu-sup-frontend.vercel.app"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
 ```

## File: ./config/initializers/filter_parameter_logging.rb
 ```rb
# Be sure to restart your server when you modify this file.

# Configure parameters to be partially matched (e.g. passw matches password) and filtered from the log file.
# Use this to limit dissemination of sensitive information.
# See the ActiveSupport::ParameterFilter documentation for supported notations and behaviors.
Rails.application.config.filter_parameters += [
  :passw, :secret, :token, :_key, :crypt, :salt, :certificate, :otp, :ssn
]
 ```

## File: ./config/puma.rb
 ```rb
# This configuration file will be evaluated by Puma. The top-level methods that
# are invoked here are part of Puma's configuration DSL. For more information
# about methods provided by the DSL, see https://puma.io/puma/Puma/DSL.html.

# Puma can serve each request in a thread from an internal thread pool.
# The `threads` method setting takes two numbers: a minimum and maximum.
# Any libraries that use thread pools should be configured to match
# the maximum value specified for Puma. Default is set to 5 threads for minimum
# and maximum; this matches the default thread size of Active Record.
max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

rails_env = ENV.fetch("RAILS_ENV") { "development" }

if rails_env == "production"
  # If you are running more than 1 thread per process, the workers count
  # should be equal to the number of processors (CPU cores) in production.
  #
  # It defaults to 1 because it's impossible to reliably detect how many
  # CPU cores are available. Make sure to set the `WEB_CONCURRENCY` environment
  # variable to match the number of processors.
  worker_count = Integer(ENV.fetch("WEB_CONCURRENCY") { 1 })
  if worker_count > 1
    workers worker_count
  else
    preload_app!
  end
end
# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
port ENV.fetch("PORT") { 3000 }

# Specifies the `environment` that Puma will run in.
environment rails_env

# Specifies the `pidfile` that Puma will use.
pidfile ENV.fetch("PIDFILE") { "tmp/pids/server.pid" }

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart
 ```

## File: ./config/cable.yml
 ```yml
development:
  adapter: async

test:
  adapter: test

production:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: app_production
 ```

## File: ./config/routes.rb
 ```rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get 'health_check', to: 'health_check#index'
      resources :symptoms, only: [:index]
      resources :diagnosis_logs, only: [:index,:create]
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
end ```

## File: ./config/environments/development.rb
 ```rb
require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      "Cache-Control" => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Highlight code that enqueued background job in logs.
  config.active_job.verbose_enqueue_logs = true


  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true

  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
end
 ```

## File: ./config/environments/test.rb
 ```rb
require "active_support/core_ext/integer/time"

# The test environment is used exclusively to run your application's
# test suite. You never need to work with it otherwise. Remember that
# your test database is "scratch space" for the test suite and is wiped
# and recreated between test runs. Don't rely on the data there!

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # While tests run files are not watched, reloading is not necessary.
  config.enable_reloading = false

  # Eager loading loads your entire application. When running a single test locally,
  # this is usually not necessary, and can slow down your test suite. However, it's
  # recommended that you enable it in continuous integration systems to ensure eager
  # loading is working properly before deploying your code.
  config.eager_load = ENV["CI"].present?

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.hour.to_i}"
  }

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  # Render exception templates for rescuable exceptions and raise for other exceptions.
  config.action_dispatch.show_exceptions = :rescuable

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false

  # Store uploaded files on the local file system in a temporary directory.
  config.active_storage.service = :test

  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test

  # Print deprecation notices to the stderr.
  config.active_support.deprecation = :stderr

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raises error for missing translations.
  # config.i18n.raise_on_missing_translations = true

  # Annotate rendered view with file names.
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Raise error when a before_action's only/except options reference missing actions
  config.action_controller.raise_on_missing_callback_actions = true
end
 ```

## File: ./config/environments/production.rb
 ```rb
require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local = false

  # Ensures that a master key has been made available in ENV["RAILS_MASTER_KEY"], config/master.key, or an environment
  # key such as config/credentials/production.key. This key is used to decrypt credentials (and other encrypted files).
  # config.require_master_key = true

  # Disable serving static files from `public/`, relying on NGINX/Apache to do so instead.
  # config.public_file_server.enabled = false

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for Apache
  # config.action_dispatch.x_sendfile_header = "X-Accel-Redirect" # for NGINX

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Mount Action Cable outside main process or domain.
  # config.action_cable.mount_path = nil
  # config.action_cable.url = "wss://example.com/cable"
  # config.action_cable.allowed_request_origins = [ "http://example.com", /http:\/\/example.*/ ]

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  # Can be used together with config.force_ssl for Strict-Transport-Security and secure cookies.
  # config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Log to STDOUT by default
  config.logger = ActiveSupport::Logger.new(STDOUT)
    .tap  { |logger| logger.formatter = ::Logger::Formatter.new }
    .then { |logger| ActiveSupport::TaggedLogging.new(logger) }

  # Prepend all log lines with the following tags.
  config.log_tags = [ :request_id ]

  # "info" includes generic and useful information about system operation, but avoids logging too much
  # information to avoid inadvertent exposure of personally identifiable information (PII). If you
  # want to log everything, set the level to "debug".
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Use a real queuing backend for Active Job (and separate queues per environment).
  # config.active_job.queue_adapter = :resque
  # config.active_job.queue_name_prefix = "app_production"

  config.action_mailer.perform_caching = false

  # Ignore bad email addresses and do not raise email delivery errors.
  # Set this to true and configure the email server for immediate delivery to raise delivery errors.
  # config.action_mailer.raise_delivery_errors = false

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false

  # Enable DNS rebinding protection and other `Host` header attacks.
  # config.hosts = [
  #   "example.com",     # Allow requests from example.com
  #   /.*\.example\.com/ # Allow requests from subdomains like `www.example.com`
  # ]
  # Skip DNS rebinding protection for the default health check endpoint.
  # config.host_authorization = { exclude: ->(request) { request.path == "/up" } }
end
 ```

## File: ./config/locales/en.yml
 ```yml
# Files in the config/locales directory are used for internationalization and
# are automatically loaded by Rails. If you want to use locales other than
# English, add the necessary files in this directory.
#
# To use the locales, use `I18n.t`:
#
#     I18n.t "hello"
#
# In views, this is aliased to just `t`:
#
#     <%= t("hello") %>
#
# To use a different locale, set it with `I18n.locale`:
#
#     I18n.locale = :es
#
# This would use the information in config/locales/es.yml.
#
# To learn more about the API, please read the Rails Internationalization guide
# at https://guides.rubyonrails.org/i18n.html.
#
# Be aware that YAML interprets the following case-insensitive strings as
# booleans: `true`, `false`, `on`, `off`, `yes`, `no`. Therefore, these strings
# must be quoted to be interpreted as strings. For example:
#
#     en:
#       "yes": yup
#       enabled: "ON"

en:
  hello: "Hello world"
 ```

## File: ./config/locales/devise.en.yml
 ```yml
# Additional translations at https://github.com/heartcombo/devise/wiki/I18n

en:
  devise:
    confirmations:
      confirmed: "Your email address has been successfully confirmed."
      send_instructions: "You will receive an email with instructions for how to confirm your email address in a few minutes."
      send_paranoid_instructions: "If your email address exists in our database, you will receive an email with instructions for how to confirm your email address in a few minutes."
    failure:
      already_authenticated: "You are already signed in."
      inactive: "Your account is not activated yet."
      invalid: "Invalid %{authentication_keys} or password."
      locked: "Your account is locked."
      last_attempt: "You have one more attempt before your account is locked."
      not_found_in_database: "Invalid %{authentication_keys} or password."
      timeout: "Your session expired. Please sign in again to continue."
      unauthenticated: "You need to sign in or sign up before continuing."
      unconfirmed: "You have to confirm your email address before continuing."
    mailer:
      confirmation_instructions:
        subject: "Confirmation instructions"
      reset_password_instructions:
        subject: "Reset password instructions"
      unlock_instructions:
        subject: "Unlock instructions"
      email_changed:
        subject: "Email Changed"
      password_change:
        subject: "Password Changed"
    omniauth_callbacks:
      failure: "Could not authenticate you from %{kind} because \"%{reason}\"."
      success: "Successfully authenticated from %{kind} account."
    passwords:
      no_token: "You can't access this page without coming from a password reset email. If you do come from a password reset email, please make sure you used the full URL provided."
      send_instructions: "You will receive an email with instructions on how to reset your password in a few minutes."
      send_paranoid_instructions: "If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes."
      updated: "Your password has been changed successfully. You are now signed in."
      updated_not_active: "Your password has been changed successfully."
    registrations:
      destroyed: "Bye! Your account has been successfully cancelled. We hope to see you again soon."
      signed_up: "Welcome! You have signed up successfully."
      signed_up_but_inactive: "You have signed up successfully. However, we could not sign you in because your account is not yet activated."
      signed_up_but_locked: "You have signed up successfully. However, we could not sign you in because your account is locked."
      signed_up_but_unconfirmed: "A message with a confirmation link has been sent to your email address. Please follow the link to activate your account."
      update_needs_confirmation: "You updated your account successfully, but we need to verify your new email address. Please check your email and follow the confirmation link to confirm your new email address."
      updated: "Your account has been updated successfully."
      updated_but_not_signed_in: "Your account has been updated successfully, but since your password was changed, you need to sign in again."
    sessions:
      signed_in: "Signed in successfully."
      signed_out: "Signed out successfully."
      already_signed_out: "Signed out successfully."
    unlocks:
      send_instructions: "You will receive an email with instructions for how to unlock your account in a few minutes."
      send_paranoid_instructions: "If your account exists, you will receive an email with instructions for how to unlock it in a few minutes."
      unlocked: "Your account has been unlocked successfully. Please sign in to continue."
  errors:
    messages:
      already_confirmed: "was already confirmed, please try signing in"
      confirmation_period_expired: "needs to be confirmed within %{period}, please request a new one"
      expired: "has expired, please request a new one"
      not_found: "not found"
      not_locked: "was not locked"
      not_saved:
        one: "1 error prohibited this %{resource} from being saved:"
        other: "%{count} errors prohibited this %{resource} from being saved:"
 ```

## File: ./config/application.rb
 ```rb
require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end
  end
end
 ```

## File: ./config/environment.rb
 ```rb
# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!
 ```

## File: ./config/storage.yml
 ```yml
test:
  service: Disk
  root: <%= Rails.root.join("tmp/storage") %>

local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

# Use bin/rails credentials:edit to set the AWS secrets (as aws:access_key_id|secret_access_key)
# amazon:
#   service: S3
#   access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
#   secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
#   region: us-east-1
#   bucket: your_own_bucket-<%= Rails.env %>

# Remember not to checkin your GCS keyfile to a repository
# google:
#   service: GCS
#   project: your_project
#   credentials: <%= Rails.root.join("path/to/gcs.keyfile") %>
#   bucket: your_own_bucket-<%= Rails.env %>

# Use bin/rails credentials:edit to set the Azure Storage secret (as azure_storage:storage_access_key)
# microsoft:
#   service: AzureStorage
#   storage_account_name: your_account_name
#   storage_access_key: <%= Rails.application.credentials.dig(:azure_storage, :storage_access_key) %>
#   container: your_container_name-<%= Rails.env %>

# mirror:
#   service: Mirror
#   primary: local
#   mirrors: [ amazon, google, microsoft ]
 ```

## File: ./config/boot.rb
 ```rb
ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)

require "bundler/setup" # Set up gems listed in the Gemfile.
require "bootsnap/setup" # Speed up boot time by caching expensive operations.
 ```

## File: ./docker-compose.yml
 ```yml
services:
  db:
    image: postgres:16
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_HOST_AUTH_METHOD: trust
  web:
    build: .
    command: bundle exec rails s -p 3000 -b '0.0.0.0'
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      # ↓ ここが重要！開発モードに強制指定
      RAILS_ENV: development
      # ↓ コンソール等でも常にこのURLを使うように指示
      DATABASE_URL: postgres://postgres:password@db:5432/app_development
  frontend:
    image: node:20-slim
    volumes:
      - ./frontend:/app
    working_dir: /app
    ports:
      - "5173:5173"
    command: npm run dev
    tty: true
    stdin_open: true ```

## File: ./Gemfile
 ```/Gemfile
source "https://rubygems.org"

ruby "3.3.0"

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem "rails", "~> 7.1.6"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# gem "jbuilder"

# Use Redis adapter to run Action Cable in production
# gem "redis", ">= 4.0.1"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin Ajax possible
# gem "rack-cors"

gem "rack-cors"

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ]
end

group :development do
  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"
end

gem 'devise'

gem 'devise-jwt'
 ```

## File: ./app/models/diagnosis_log.rb
 ```rb
class DiagnosisLog < ApplicationRecord
  belongs_to :user, optional: true # ログインなしでも診断できる場合は optional: true
  has_many :diagnosis_log_symptoms, dependent: :destroy
  has_many :symptoms, through: :diagnosis_log_symptoms

  has_many :diagnosis_log_drugs, dependent: :destroy
  has_many :drugs, through: :diagnosis_log_drugs

  enum timing: { before_drinking: 0, during_drinking: 1, after_drinking: 2 }
end
 ```

## File: ./app/models/symptom.rb
 ```rb
class Symptom < ApplicationRecord
  has_many :diagnosis_log_symptoms
  has_many :diagnosis_logs, through: :diagnosis_log_symptoms

  has_many :drug_symptoms, dependent: :destroy
  has_many :drugs, through: :drug_symptoms
end
 ```

## File: ./app/models/ingredient.rb
 ```rb
class Ingredient < ApplicationRecord
  has_many :drug_ingredients, dependent: :destroy
  has_many :drugs, through: :drug_ingredients
end
 ```

## File: ./app/models/drug.rb
 ```rb
class Drug < ApplicationRecord
  has_many :diagnosis_log_drugs
  has_many :diagnosis_logs, through: :diagnosis_log_drugs

  has_many :drug_ingredients, dependent: :destroy
  has_many :ingredients, through: :drug_ingredients

  has_many :drug_symptoms, dependent: :destroy
  has_many :symptoms, through: :drug_symptoms

  enum category: { medicine: 0, food: 1 }
  enum timing: { before: 0, during: 1, after: 2, any: 3 }
end
 ```

## File: ./app/models/application_record.rb
 ```rb
class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class
end
 ```

## File: ./app/models/drug_ingredient.rb
 ```rb
class DrugIngredient < ApplicationRecord
  belongs_to :drug
  belongs_to :ingredient
end
 ```

## File: ./app/models/diagnosis_log_symptom.rb
 ```rb
class DiagnosisLogSymptom < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :symptom
end
 ```

## File: ./app/models/drug_symptom.rb
 ```rb
class DrugSymptom < ApplicationRecord
  belongs_to :drug
  belongs_to :symptom
end
 ```

## File: ./app/models/diagnosis_log_drug.rb
 ```rb
class DiagnosisLogDrug < ApplicationRecord
  belongs_to :diagnosis_log
  belongs_to :drug
end
 ```

## File: ./app/models/user.rb
 ```rb
class User < ApplicationRecord
# 1. JWTの廃棄戦略を読み込む（これも必要なので追加しておきましょう）
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # 2. カンマを正しく閉じ、JWTの設定も追加する
  devise :database_authenticatable, :registerable,
         :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
         
  has_many :diagnosis_logs, dependent: :destroy
end
 ```

## File: ./app/channels/application_cable/connection.rb
 ```rb
module ApplicationCable
  class Connection < ActionCable::Connection::Base
  end
end
 ```

## File: ./app/channels/application_cable/channel.rb
 ```rb
module ApplicationCable
  class Channel < ActionCable::Channel::Base
  end
end
 ```

## File: ./app/jobs/application_job.rb
 ```rb
class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that encountered a deadlock
  # retry_on ActiveRecord::Deadlocked

  # Most jobs are safe to ignore if the underlying records are no longer available
  # discard_on ActiveJob::DeserializationError
end
 ```

## File: ./app/mailers/application_mailer.rb
 ```rb
class ApplicationMailer < ActionMailer::Base
  default from: "from@example.com"
  layout "mailer"
end
 ```

## File: ./app/controllers/users/sessions_controller.rb
 ```rb
class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: resource
    }, status: :ok
  end

  def respond_to_on_destroy(resource = nil)
    render json: {
      status: 200,
      message: 'Logged out successfully.'
    }, status: :ok
  end
end ```

## File: ./app/controllers/users/registrations_controller.rb
 ```rb
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: { code: 200, message: 'Signed up successfully.' },
        data: resource
      }, status: :ok
    else
      render json: {
        status: { message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
      }, status: :unprocessable_entity
    end
  end
end ```

## File: ./app/controllers/api/v1/health_check_controller.rb
 ```rb
class Api::V1::HealthCheckController < ApplicationController
  def index
    render json: { message: "Rails APIとの接続に成功しました！" }, status: :ok
  end
end
 ```

## File: ./app/controllers/api/v1/diagnosis_logs_controller.rb
 ```rb
class Api::V1::DiagnosisLogsController < ApplicationController
  # 診断履歴の一覧を取得
  def index
    # 1. ログインユーザーに紐づく履歴を取得
    # .includes を使って「N+1問題」を回避し、関連する症状と薬を一括ロードする
    @logs = current_user.diagnosis_logs
                        .includes(:symptoms, :drugs)
                        .order(created_at: :desc)

    # 2. JSON形式で返却
    # 履歴本体だけでなく、紐づく symptoms と drugs の name なども含める
    render json: @logs.as_json(
      include: {
        symptoms: { only: [:id, :name] },
        drugs: { only: [:id, :name, :description] }
      }
    ), status: :ok
  end
  
  def create
    # 1. フロントから送られてきた症状IDリストを受け取る
    symptom_ids = params[:symptom_ids]
    timing = params[:timing]

    # 2. Serviceクラス（専門家）を呼び出して、推奨薬を判定する
    service = DiagnosisService.new(symptom_ids)
    @suggested_drugs = service.execute

    # 3. 診断結果をDBに保存する（DiagnosisLog と中間テーブル）
    # user_id はログインしていれば current_user.id、していなければ nil になります
    diagnosis_log = DiagnosisLog.new(
      user_id: current_user&.id,
      timing: timing
    )

    if diagnosis_log.save
      # 診断に紐づく症状と薬を中間テーブルに保存
      diagnosis_log.symptom_ids = symptom_ids
      diagnosis_log.drug_ids = @suggested_drugs.pluck(:id)

      # 4. 判定された薬の情報をJSONで返す
      render json: {
        status: 'success',
        diagnosis_log_id: diagnosis_log.id,
        suggested_drugs: @suggested_drugs
      }, status: :created
    else
      render json: { status: 'error', message: diagnosis_log.errors.full_messages }, status: :unprocessable_entity
    end
  end
end ```

## File: ./app/controllers/api/v1/symptoms_controller.rb
 ```rb
class Api::V1::SymptomsController < ApplicationController
  def index
    # 1. 指定されたタイミングのデータを一括で取得する
    base_query = Symptom.where(timing: params[:timing])

    # 2. 取得したデータをカテゴリごとに振り分けて返却する
    render json: {
      symptoms: base_query.where(category: 0),     # 症状
      constitutions: base_query.where(category: 1)  # 体質
    }, status: :ok
  end
end ```

## File: ./app/controllers/application_controller.rb
 ```rb
class ApplicationController < ActionController::API
end
 ```

## File: ./app/services/diagnosis_service.rb
 ```rb
class DiagnosisService
  def initialize(symptom_ids)
    @symptom_ids = symptom_ids
  end

  def execute
    # 1. 該当する薬を「重複を含めて」すべて取得する
    # ※あえて .distinct を外して、ヒットした数だけ取得します
    all_matched_drugs = Drug.joins(:drug_symptoms)
                            .where(drug_symptoms: { symptom_id: @symptom_ids })

    # 2. ヒットした回数を集計し、多い順（降順）に並び替える
    # 薬のIDをキー、ヒット回数を値とするハッシュを作成し、ソートします
    ranked_drug_ids = all_matched_drugs.group(:id)
                                       .count # { "drug_id_1" => 3, "drug_id_2" => 1 } のような形式
                                       .sort_by { |_, count| -count } # ヒット数が多い順にソート
                                       .map { |id, _| id } # IDだけの配列に戻す

    # 3. ソートされたIDの順序を維持したまま、薬の情報を取得して返す
    # Rails 7以降では in_order_of が使えます
    Drug.where(id: ranked_drug_ids).in_order_of(:id, ranked_drug_ids)
  end
end ```

## File: ./app/views/layouts/mailer.text.erb
 ```erb
<%= yield %>
 ```

## File: ./app/views/layouts/mailer.html.erb
 ```erb
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <style>
      /* Email styles need to be inline */
    </style>
  </head>

  <body>
    <%= yield %>
  </body>
</html>
 ```

## File: ./test/fixtures/diagnosis_logs.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  user_id: 
  timing: 1

two:
  user_id: 
  timing: 1
 ```

## File: ./test/fixtures/drugs.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  name: MyString
  category: 1
  timing: 1
  description: MyText

two:
  name: MyString
  category: 1
  timing: 1
  description: MyText
 ```

## File: ./test/fixtures/symptoms.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  name: MyString

two:
  name: MyString
 ```

## File: ./test/fixtures/ingredients.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  name: MyString
  detail: MyText

two:
  name: MyString
  detail: MyText
 ```

## File: ./test/fixtures/drug_symptoms.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  drug: one
  symptom: one

two:
  drug: two
  symptom: two
 ```

## File: ./test/fixtures/diagnosis_log_symptoms.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  diagnosis_log: one
  symptom: one

two:
  diagnosis_log: two
  symptom: two
 ```

## File: ./test/fixtures/users.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  email: MyString
  password_digest: MyString

two:
  email: MyString
  password_digest: MyString
 ```

## File: ./test/fixtures/drug_ingredients.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  drug: one
  ingredient: one

two:
  drug: two
  ingredient: two
 ```

## File: ./test/fixtures/diagnosis_log_drugs.yml
 ```yml
# Read about fixtures at https://api.rubyonrails.org/classes/ActiveRecord/FixtureSet.html

one:
  diagnosis_log: one
  drug: one

two:
  diagnosis_log: two
  drug: two
 ```

## File: ./test/models/symptom_test.rb
 ```rb
require "test_helper"

class SymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/user_test.rb
 ```rb
require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/ingredient_test.rb
 ```rb
require "test_helper"

class IngredientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_symptom_test.rb
 ```rb
require "test_helper"

class DrugSymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_symptom_test.rb
 ```rb
require "test_helper"

class DiagnosisLogSymptomTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_ingredient_test.rb
 ```rb
require "test_helper"

class DrugIngredientTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_drug_test.rb
 ```rb
require "test_helper"

class DiagnosisLogDrugTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/drug_test.rb
 ```rb
require "test_helper"

class DrugTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/models/diagnosis_log_test.rb
 ```rb
require "test_helper"

class DiagnosisLogTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/channels/application_cable/connection_test.rb
 ```rb
require "test_helper"

module ApplicationCable
  class ConnectionTest < ActionCable::Connection::TestCase
    # test "connects with cookies" do
    #   cookies.signed[:user_id] = 42
    #
    #   connect
    #
    #   assert_equal connection.user_id, "42"
    # end
  end
end
 ```

## File: ./test/controllers/api/v1/health_check_controller_test.rb
 ```rb
require "test_helper"

class Api::V1::HealthCheckControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
end
 ```

## File: ./test/test_helper.rb
 ```rb
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end
 ```

## File: ./db/seeds.rb
 ```rb
# 既存データの削除
[DrugIngredient, DrugSymptom, Drug, Ingredient, Symptom].each(&:destroy_all)

# 1. 症状データの登録 (Symptoms)
# timing: 0:前, 1:中, 2:後 / category: 0:症状, 1:体質
symptoms_data = [
  # これから飲む (前)
  { name: '空腹である', timing: 0, category: 0 },
  { name: '今日はがっつり飲む予定', timing: 0, category: 0 },
  { name: 'ビールなど炭酸系を多く飲む', timing: 0, category: 0 },
  { name: 'お酒に弱い体質である', timing: 0, category: 1 },
  # 飲みすぎたかも (中)
  { name: '顔が赤くなっている', timing: 1, category: 0 },
  { name: '少しふらつく', timing: 1, category: 0 },
  { name: '喉が異常に乾く', timing: 1, category: 0 },
  { name: '締めを食べたい欲求がある', timing: 1, category: 0 },
  { name: 'すでに胃に違和感がある', timing: 1, category: 1 },
  # 翌朝がつらい (後)
  { name: 'ズキズキする頭痛', timing: 2, category: 0 },
  { name: 'ムカムカする吐き気', timing: 2, category: 0 },
  { name: '体がだるい', timing: 2, category: 0 },
  { name: 'むくみがひどい', timing: 2, category: 0 },
  { name: '現在、胃痛がある', timing: 2, category: 1 }
]
symptoms = {}
symptoms_data.each { |s| symptoms[s[:name]] = Symptom.create!(s) }

# 2. 成分データの登録 (Ingredients) - 25種類以上
ingredients_list = [
  "肝臓エキス", "クルクミン", "ウコンエキス", "オルニチン", "ビタミンB1", "ビタミンB2", "ビタミンB6", "ビタミンC",
  "ブドウ糖", "クエン酸", "タウリン", "ナイアシン", "L-システイン", "グリチルリチン酸", "アセトアミノフェン",
  "無水カフェイン", "イブプロフェン", "水酸化マグネシウム", "アルミナマグネシウム", "ウルソデオキシコール酸",
  "カンゾウエキス", "ケイヒ", "チョウジ", "バクモンドウ", "五苓散エキス", "半夏瀉心湯エキス", "芍薬甘草湯エキス"
]
ingredients = {}
ingredients_list.each { |name| ingredients[name] = Ingredient.create!(name: name, detail: "#{name}の代謝助長・保護作用") }

# 3. 商品データの登録 (Drugs) - 25種類 (コンビニ15個 / DS10個)
# category: 0:DS(医薬品等), 1:コンビニ(食品/指定医薬部外品)
# timing: 0:前, 1:中, 2:後, 3:いつでも
drugs_data = [
  # コンビニ系 (15個)
  { name: 'ヘパリーゼW', category: 1, timing: 0, description: '肝臓エキス100mg配合。飲む前の定番。' },
  { name: 'ウコンの力', category: 1, timing: 0, description: 'クルクミン30mg配合。秋ウコンエキス。' },
  { name: 'ウコンの力 超MAX', category: 1, timing: 0, description: 'クルクミン40mgに加え、肝臓エキスも配合。' },
  { name: 'カゴメ トマトジュース', category: 1, timing: 1, description: 'リコピンがアルコール代謝をサポート。' },
  { name: 'ラムネ', category: 1, timing: 1, description: 'ブドウ糖90%配合。低血糖予防に。' },
  { name: 'inゼリー エネルギー', category: 1, timing: 0, description: '空腹での飲酒を避けるためのエネルギー補給。' },
  { name: 'チョコラBBスパークリング', category: 1, timing: 2, description: 'ナイアシン配合。アセトアルデヒド分解を助ける。' },
  { name: 'ソルマック5', category: 1, timing: 1, description: '食べる前に飲む。胃の働きを整える。' },
  { name: '経口補水液OS-1', category: 1, timing: 3, description: '脱水状態の水分補給に最適。' },
  { name: 'ペパリーゼHi', category: 1, timing: 0, description: 'コンドロイチン配合。さらに元気を。' },
  { name: 'TBC 鉄分', category: 1, timing: 3, description: 'ミネラル補給。' },
  { name: 'ウィルキンソン炭酸水', category: 1, timing: 1, description: '水分補給とリフレッシュ。' },
  { name: 'ポカリスエット', category: 1, timing: 1, description: '電解質を素早く補給。' },
  { name: 'しじみ70個分のちから', category: 1, timing: 2, description: 'オルニチンたっぷり。翌朝の味噌汁代わりに。' },
  { name: 'リポビタンD', category: 1, timing: 0, description: 'タウリン1000mg。エネルギーチャージ。' },

  # ドラッグストア系 (10個)
  { name: 'ヘパリーゼGX', category: 0, timing: 0, description: '第3類医薬品。肝臓加水分解物600mg。' },
  { name: 'ハイチオールCプラス', category: 0, timing: 2, description: 'L-システインが代謝を促進し、二日酔いを改善。' },
  { name: 'ミラグレーン錠', category: 0, timing: 3, description: '知る人ぞ知る肝臓薬。牛黄配合。' },
  { name: '太田胃散', category: 0, timing: 1, description: '生薬の力で胃の違和感をスッキリ。' },
  { name: 'パンシロン01+', category: 0, timing: 1, description: '飲みすぎ・胃もたれに。' },
  { name: '五苓散', category: 0, timing: 2, description: '水分の巡りを整え、頭痛・むくみを改善。' },
  { name: '半夏瀉心湯', category: 0, timing: 2, description: '吐き気・下痢・二日酔いのむかつきに。' },
  { name: 'ガスター10', category: 0, timing: 1, description: 'H2ブロッカー。過剰な胃酸を抑える。' },
  { name: 'バファリンA', category: 0, timing: 2, description: '二日酔いの頭痛に。※胃障害注意。' },
  { name: 'ウルソ', category: 0, timing: 0, description: '胆汁酸の分泌を促進し、肝機能を改善。' }
]

drugs = drugs_data.map { |d| Drug.create!(d) }

# 4. 紐付け (DrugSymptom / DrugIngredient) - 代表的なもの
# ヘパリーゼW × 空腹、お酒に弱い / 肝臓エキス
hepa_w = Drug.find_by(name: 'ヘパリーゼW')
DrugSymptom.create!(drug: hepa_w, symptom: symptoms['空腹である'])
DrugSymptom.create!(drug: hepa_w, symptom: symptoms['お酒に弱い体質である'])
DrugIngredient.create!(drug: hepa_w, ingredient: ingredients['肝臓エキス'])

# 五苓散 × 頭痛、むくみ / 五苓散エキス
goreisan = Drug.find_by(name: '五苓散')
DrugSymptom.create!(drug: goreisan, symptom: symptoms['ズキズキする頭痛'])
DrugSymptom.create!(drug: goreisan, symptom: symptoms['むくみがひどい'])
DrugIngredient.create!(drug: goreisan, ingredient: ingredients['五苓散エキス'])

# ラムネ × ふらつく / ブドウ糖
ramune = Drug.find_by(name: 'ラムネ')
DrugSymptom.create!(drug: ramune, symptom: symptoms['少しふらつく'])
DrugIngredient.create!(drug: ramune, ingredient: ingredients['ブドウ糖'])

puts "Seedデータの投入が完了しました！"
 ```

## File: ./db/migrate/20260204020414_create_diagnosis_logs.rb
 ```rb
class CreateDiagnosisLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_logs, id: :uuid do |t|
      t.uuid :user_id
      t.integer :timing

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204020821_create_diagnosis_log_drugs.rb
 ```rb
class CreateDiagnosisLogDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_drugs, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :drug, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260212025335_add_devise_to_users.rb
 ```rb
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
 ```

## File: ./db/migrate/20260204025027_create_ingredients.rb
 ```rb
class CreateIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients, id: :uuid do |t|
      t.string :name
      t.text :detail

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260203022540_enable_pgcrypto.rb
 ```rb
class EnablePgcrypto < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto' # PostgreSQLのUUID生成機能をONにする
  end
end
 ```

## File: ./db/migrate/20260204024135_create_users.rb
 ```rb
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :password_digest

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204025116_create_drug_ingredients.rb
 ```rb
class CreateDrugIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_ingredients, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :ingredient, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260212024435_add_jti_to_users.rb
 ```rb
class AddJtiToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :jti, :string
    add_index :users, :jti
  end
end
 ```

## File: ./db/migrate/20260204032858_add_details_to_symptoms.rb
 ```rb
class AddDetailsToSymptoms < ActiveRecord::Migration[7.1]
  def change
    add_column :symptoms, :timing, :integer
    add_column :symptoms, :category, :integer
  end
end
 ```

## File: ./db/migrate/20260204014528_create_drugs.rb
 ```rb
class CreateDrugs < ActiveRecord::Migration[7.1]
  def change
    create_table :drugs, id: :uuid do |t|
      t.string :name
      t.integer :category
      t.integer :timing
      t.text :description

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204020806_create_diagnosis_log_symptoms.rb
 ```rb
class CreateDiagnosisLogSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :diagnosis_log_symptoms, id: :uuid do |t|
      t.references :diagnosis_log, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204015552_create_symptoms.rb
 ```rb
class CreateSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :symptoms, id: :uuid do |t|
      t.string :name

      t.timestamps
    end
  end
end
 ```

## File: ./db/migrate/20260204025144_create_drug_symptoms.rb
 ```rb
class CreateDrugSymptoms < ActiveRecord::Migration[7.1]
  def change
    create_table :drug_symptoms, id: :uuid do |t|
      t.references :drug, null: false, foreign_key: true, type: :uuid
      t.references :symptom, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
 ```

## File: ./db/schema.rb
 ```rb
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_02_12_025335) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "diagnosis_log_drugs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "diagnosis_log_id", null: false
    t.uuid "drug_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["diagnosis_log_id"], name: "index_diagnosis_log_drugs_on_diagnosis_log_id"
    t.index ["drug_id"], name: "index_diagnosis_log_drugs_on_drug_id"
  end

  create_table "diagnosis_log_symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "diagnosis_log_id", null: false
    t.uuid "symptom_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["diagnosis_log_id"], name: "index_diagnosis_log_symptoms_on_diagnosis_log_id"
    t.index ["symptom_id"], name: "index_diagnosis_log_symptoms_on_symptom_id"
  end

  create_table "diagnosis_logs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.integer "timing"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "drug_ingredients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "drug_id", null: false
    t.uuid "ingredient_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drug_id"], name: "index_drug_ingredients_on_drug_id"
    t.index ["ingredient_id"], name: "index_drug_ingredients_on_ingredient_id"
  end

  create_table "drug_symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "drug_id", null: false
    t.uuid "symptom_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["drug_id"], name: "index_drug_symptoms_on_drug_id"
    t.index ["symptom_id"], name: "index_drug_symptoms_on_symptom_id"
  end

  create_table "drugs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "category"
    t.integer "timing"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "ingredients", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.text "detail"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "symptoms", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "timing"
    t.integer "category"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "diagnosis_log_drugs", "diagnosis_logs"
  add_foreign_key "diagnosis_log_drugs", "drugs"
  add_foreign_key "diagnosis_log_symptoms", "diagnosis_logs"
  add_foreign_key "diagnosis_log_symptoms", "symptoms"
  add_foreign_key "drug_ingredients", "drugs"
  add_foreign_key "drug_ingredients", "ingredients"
  add_foreign_key "drug_symptoms", "drugs"
  add_foreign_key "drug_symptoms", "symptoms"
end
 ```

