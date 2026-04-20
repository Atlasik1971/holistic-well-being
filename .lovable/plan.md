

## План: создать админ-аккаунт `admin@example.com / Admin123!`

Вся инфраструктура авторизации уже на месте — страница входа `/auth`, защита `/admin/*` через `RequireAdmin`, кнопка выхода в `AdminLayout`, роли в таблице `user_roles` с RLS, проверка через `has_role()`. Менять код не нужно. Нужно только создать пользователя и выдать ему роль `admin`.

## Что сделаю

**1. Создам пользователя через миграцию**
- Вставлю запись в `auth.users` с email `admin@example.com`, паролем `Admin123!` (хеш через `crypt()` + `gen_salt('bf')`), флагом `email_confirmed_at = now()` — чтобы можно было войти сразу без письма
- Заполню обязательные служебные поля (`instance_id`, `aud='authenticated'`, `role='authenticated'`, `raw_app_meta_data`, `raw_user_meta_data`, идентичность в `auth.identities`)
- Если такой email уже существует — миграция мягко пропустит вставку (`ON CONFLICT DO NOTHING`)

**2. Выдам роль admin**
- Вставлю в `public.user_roles` запись `(user_id, 'admin')` для созданного пользователя
- `ON CONFLICT DO NOTHING` — повторный запуск безопасен

**3. Проверю результат**
- Сделаю SELECT по `auth.users` + `user_roles`, чтобы подтвердить, что пользователь создан и роль выдана

## Где потом заменить временные данные на реальные

В сообщении после деплоя дам короткую инструкцию — три варианта на выбор:

**Вариант A. Сменить пароль из админки** (проще всего)
- Зайти на `/auth` под `admin@example.com / Admin123!`
- Открою кнопку «Сменить пароль» в `AdminLayout` (если попросите — добавлю отдельным шагом)

**Вариант B. Сменить email/пароль через Lovable Cloud → Users**
- Кнопка «Открыть бэкенд» → раздел Users → найти `admin@example.com` → Edit → поменять email и/или сбросить пароль

**Вариант C. Создать второго админа и удалить тестового**
- Добавить новую запись в Users с реальным email
- Выдать ему роль через миграцию: `INSERT INTO user_roles (user_id, role) VALUES ('<новый-uuid>', 'admin')`
- Удалить `admin@example.com` из Users

## Технические детали

```text
Миграция:
1. INSERT INTO auth.users (...) ON CONFLICT (email) DO NOTHING
2. INSERT INTO auth.identities (...) ON CONFLICT DO NOTHING
3. INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin' FROM auth.users WHERE email='admin@example.com'
   ON CONFLICT DO NOTHING
```

- Пароль хешируется на сервере БД через `crypt('Admin123!', gen_salt('bf'))` — открытый пароль нигде в коде не остаётся
- Email сразу подтверждён (`email_confirmed_at = now()`, `confirmation_token = ''`)
- Никаких изменений в `.tsx` файлах, дизайне или роутах

## Что НЕ меняем

- Дизайн страницы `/auth` и админки — без изменений
- Логика `AuthProvider`, `RequireAdmin`, `AdminLayout` — уже корректная
- Никаких хардкод-паролей в клиентском коде нет и не появится

## После одобрения

1. Применю миграцию (создание пользователя + роль)
2. Проверю, что запись на месте
3. Дам вам строку для входа: `admin@example.com / Admin123!` и инструкцию, как поменять данные

