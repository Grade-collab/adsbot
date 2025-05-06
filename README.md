# 📢 **Ads Bot** 🚀

---

## 📝 **Требования**  
- Node.js v14 или выше  
- npm или Yarn  
- Cloudflare API Token  
- PostgreSQL (если требуется для базы данных)  

---

## 📂 **Как запустить проект?**

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/your-username/ads-bot.git
```

### 2. Перейдите в папку проекта

```bash
cd ads-bot
```

### 3. Скопируйте `.env.example` в `.env`

```bash
cp .env.example .env
```

### 4. Заполните данные в `.env` файле

Откройте `.env` и заполните необходимые параметры:

```ini
NODE_ENV="test"

POSTGRES_USER="user"
POSTGRES_HOST="localhost"
POSTGRES_PASSWORD="password"
POSTGRES_DB="test_db"
POSTGRES_PORT="5432"

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

CLOUDFLARE_API_TOKEN="your_cloudflare_api_token"

TELEGRAM_BOT_TOKEN=""
TELEGRAM_SUPPORT="https://t.me/support"
TELEGRAM_LOG=""
```

---

## 🚀 **Запуск проекта**

### 🔹 **Для продакшн окружения**

Для запуска проекта в продакшен-режиме:

```bash
bash ./start_prod.sh
```

---

### 🔹 **Для тестового окружения**

Для запуска проекта в тестовом окружении:

```bash
bash ./start_test.sh
```

---

## 🔌 **Дополнительные команды**


- **Проверка линтинга**:  

```bash
npm run lint
```

---

## 📜 **Технологии**

- **NestJS** — мощный фреймворк для создания приложений на Node.js  
- **Cloudflare API** — интеграция для управления доменами  
- **PostgreSQL** — для работы с базой данных  
- **dotenv** — для управления переменными окружения  

---

## 🛠️ **Проект поддерживается**

Если у вас возникли вопросы или предложения по улучшению, вы можете обратиться:

- **GitHub**: [https://github.com/your-username/ads-bot](https://github.com/your-username/ads-bot)  
- **Email**: your@example.com  

---

## 📜 **Лицензия**

Проект распространяется под лицензией MIT.
