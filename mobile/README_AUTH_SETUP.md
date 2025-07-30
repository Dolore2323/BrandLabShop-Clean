# Настройка реальной аутентификации

## 1. Google OAuth Setup

### Шаг 1: Создание проекта в Google Cloud Console
1. Перейдите на https://console.developers.google.com/
2. Создайте новый проект или выберите существующий
3. Включите Google+ API

### Шаг 2: Создание OAuth 2.0 credentials
1. Перейдите в "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
2. Выберите "Web application"
3. Добавьте authorized redirect URIs:
   - `exp://localhost:8088/--/auth`
   - `exp://YOUR_LOCAL_IP:8088/--/auth` (замените на ваш IP)
4. Скопируйте Client ID и Client Secret

## 2. Apple OAuth Setup

### Шаг 1: Создание App ID
1. Перейдите на https://developer.apple.com/
2. Создайте App ID с Bundle ID: `com.brandlabshop.app`
3. Включите "Sign In with Apple"

### Шаг 2: Создание Service ID
1. Создайте Service ID
2. Настройте redirect URLs
3. Сгенерируйте Client Secret

## 3. Supabase Setup (для SMS аутентификации)

### Шаг 1: Создание проекта
1. Перейдите на https://supabase.com/
2. Создайте новый проект
3. Скопируйте URL и anon key

### Шаг 2: Настройка SMS провайдера
1. В настройках Authentication включите Phone Auth
2. Настройте SMS провайдера (Twilio, MessageBird и т.д.)

## 4. Настройка переменных окружения

Создайте файл `.env` в папке `mobile`:

```env
# Google OAuth
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# Apple OAuth
EXPO_PUBLIC_APPLE_CLIENT_ID=com.brandlabshop.app
EXPO_PUBLIC_APPLE_CLIENT_SECRET=your-apple-client-secret

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Настройка app.json

Добавьте в `app.json`:

```json
{
  "expo": {
    "scheme": "brandlabshop",
    "ios": {
      "bundleIdentifier": "com.brandlabshop.app"
    },
    "android": {
      "package": "com.brandlabshop.app"
    }
  }
}
```

## 6. Тестирование

После настройки:
1. Перезапустите Expo сервер
2. Протестируйте Google OAuth
3. Протестируйте Apple OAuth (только на iOS)
4. Протестируйте SMS аутентификацию

## Примечания

- Apple OAuth работает только на iOS устройствах
- Для продакшена нужно настроить реальные домены в OAuth провайдерах
- SMS аутентификация требует настройки реального SMS провайдера 