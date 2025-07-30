# BrandLabShop Mobile App

## Описание
Мобильное приложение для интернет-магазина BrandLabShop на Expo + React Native. Поддержка аутентификации через Supabase, каталог товаров, корзина, оформление заказа (Stripe), история заказов, загрузка изображений (Cloudinary), push-уведомления.

## Основные возможности
- Аутентификация через Supabase (email/пароль, Google, Apple)
- Каталог товаров с загрузкой из Supabase
- Экран товара: фото, описание, добавление в корзину
- Корзина: просмотр, изменение, оформление заказа
- Оформление заказа: адрес, оплата (Stripe), доставка
- Профиль пользователя: история заказов, настройки
- Загрузка изображений (Cloudinary)
- Push-уведомления (Expo Notifications)

## Структура проекта
- `app/` — экраны приложения (file-based routing)
- `components/` — переиспользуемые компоненты (ImageUploader, UI)
- `constants/` — цвета и константы
- `hooks/` — кастомные хуки
- `supabaseClient.js` — инициализация Supabase

## Запуск и настройка
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте файл `.env` в корне mobile и добавьте:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Для загрузки изображений настройте Cloudinary:
   - Получите CLOUD_NAME и создайте unsigned upload preset
   - В `components/ImageUploader.tsx` укажите CLOUDINARY_URL и UPLOAD_PRESET
4. Для оплаты Stripe — настройте ключи в Supabase/Stripe (mock для MVP)
5. Запустите приложение:
   ```bash
   npx expo start
   ```

## Push-уведомления
- Используется Expo Notifications. Для работы на устройстве — настройте Expo Push Token.

## Важно
- Для работы с Supabase настройте таблицы: products, categories, users, orders, order_items
- Для Google/Apple входа настройте провайдеры в Supabase Auth

## Команды
- `npm start` — запуск Expo
- `npm run reset-project` — сбросить проект до чистого состояния

## Документация
- [Expo](https://docs.expo.dev/)
- [Supabase](https://supabase.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)
- [Stripe](https://stripe.com/docs)
