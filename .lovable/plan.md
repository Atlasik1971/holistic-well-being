

## Проблема

Логи показывают: вход на самом деле проходит успешно (Supabase вернул токен 200, роль admin подтверждена). Но юзеру кажется, что «кнопка не работает», потому что после входа происходит **неправильный редирект**: страница уходит не в `/admin`, а на главную `/`.

### Почему так

В `src/pages/Auth.tsx`:
```ts
useEffect(() => {
  if (!authLoading && session) {
    navigate(isAdmin ? from : "/", { replace: true });
  }
}, [session, isAdmin, authLoading, ...]);
```

Гонка состояний в `AuthProvider`:
1. `signInWithPassword` → срабатывает `onAuthStateChange` → `setSession(newSession)` мгновенно
2. `checkAdmin()` запускается через `setTimeout` и идёт в БД (~100–300 мс)
3. Между этими событиями реакт ререндерит `Auth.tsx`: `session=true`, `isAdmin=false` (старое значение), `authLoading=false`
4. Эффект отрабатывает первым → `navigate("/")` → юзер оказывается на главной
5. Через миг приходит роль admin — но пользователь уже не на `/auth`, и `Header` тихо показывает кнопку «Админка», которую он не замечает

Итог: с точки зрения пользователя кнопка «Войти» «ничего не делает» — он просто моргнул и снова на сайте.

## Решение

Чинно дождаться, пока роль реально проверится, прежде чем редиректить. Меняем два маленьких места — без изменений дизайна.

### 1. `src/components/auth/AuthProvider.tsx`

Добавить отдельный флаг `roleLoading`, чтобы понимать, закончилась ли проверка роли для текущей сессии:
- При появлении сессии: `setRoleLoading(true)` → `checkAdmin` → `setRoleLoading(false)` в `finally`
- При выходе: `setRoleLoading(false)`
- Экспортировать его в контексте (`roleLoading`)

### 2. `src/pages/Auth.tsx`

Изменить условие редиректа так, чтобы дождаться окончания проверки роли:
```ts
useEffect(() => {
  if (authLoading || roleLoading) return;
  if (!session) return;
  navigate(isAdmin ? from : "/", { replace: true });
}, [session, isAdmin, authLoading, roleLoading, from, navigate]);
```

Заодно после `signInWithPassword` НЕ делаем `setLoading(false)` сразу — оставляем спиннер на кнопке до момента, когда `roleLoading` станет `false` и редирект произойдёт. Это даст пользователю явный визуальный фидбэк «идёт вход», а не «ничего не происходит».

### 3. (бонус) `src/components/auth/RequireAdmin.tsx`

Тоже учитываем `roleLoading`, иначе он успеет показать «Нет доступа» в момент гонки:
```ts
if (loading || roleLoading) return <spinner />;
```

## Что НЕ меняем

- Дизайн `/auth`, footer, шапку
- Учётные данные `admin@example.com / Admin123!`
- Логику Supabase, роли, RLS
- Роуты

## Технические детали

- Файлы: `src/components/auth/AuthProvider.tsx`, `src/pages/Auth.tsx`, `src/components/auth/RequireAdmin.tsx`
- Новое поле в `AuthCtx`: `roleLoading: boolean`
- Спиннер на кнопке «Войти» держим до завершения редиректа

## Результат

- Жмёшь «Войти» → кнопка крутится → сразу попадаешь в `/admin` (а не на главную и обратно)
- Никаких визуальных «ничего не произошло»
- `RequireAdmin` больше не мигает страницей «Нет доступа» в момент проверки роли

