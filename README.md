Сущности:

- User
- Account
- Category
- Transaction

API endpoints:

- Auth:

POST /api/register - регистрация

POST /api/login - вход

POST /api/logout - выход


- Users:

GET /api/users/me - получить профиль

PUT /api/users/me - обновить профиль

PUT /api/users/currency - изменить валюту

PUT /api/users/password - изменить пароль

- Accounts:

GET /api/accounts - все счета

POST /api/accounts - создать счет

PUT /api/accounts/:id - обновить счет

DELETE /api/accounts/:id - удалить счет

- Categories:

GET /api/categories - все системные категории

GET /api/categories/default - инициализация категорий

GET /api/categories/type/:type - категории по типу

GET /api/categories/:id - категория по ID

- Transactions:

GET /api/transactions - все транзакции (с пагинацией)

GET /api/transactions/recent - последние транзакции

GET /api/transactions/account/:accountId - транзакции по счету

GET /api/transactions/category/:categoryId - транзакции по категории

GET /api/transactions/:id - транзакция по ID

POST /api/transactions - создать транзакцию

PUT /api/transactions/:id - обновить транзакцию

DELETE /api/transactions/:id - удалить транзакцию

- Summary:

GET /api/summary - Основная сводка с соотношением доходов/расходов

GET /api/summary/expenses-pie - Круговая диаграмма расходов по категориям

GET /api/summary/income-pie - Круговая диаграмма доходов по счетам

GET /api/summary/daily - Статистика по дням

GET /api/summary/trends - График трендов (упрощенный)