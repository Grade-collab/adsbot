# Настройка Nginx для работы с локальным IP и Cloudflare

Эта инструкция поможет настроить Nginx таким образом, чтобы сайт отображался как по локальному IP-адресу на порту 80, так и через Cloudflare.

## Шаг 1: Установка Nginx

Если Nginx еще не установлен, выполните следующие команды:

```bash
sudo apt update
sudo apt install nginx
```

## Шаг 2: Настройка конфигурации Nginx

1. Откройте файл конфигурации Nginx:

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. Замените содержимое файла на следующее:

   ```nginx
   upstream server_log{
      server 127.0.0.1:3000;
   }

   server {
       listen 80;
       server_name _ default_server;

       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /log{
         proxy_pass http://server_log;
         proxy_http_version 1.1;
         proxy_set_header Upgrade $http_upgrade;
         proxy_set_header Connection 'upgrade';
         proxy_set_header Host $host;
         proxy_cache_bypass $http_upgrade;

         real_ip_header X-Forwarded-For;
         real_ip_recursive on;
       }

   }
   ```

3. Сохраните изменения и закройте файл.

## Шаг 3: Проверка и перезапуск Nginx

1. Проверьте корректность конфигурации:

   ```bash
   sudo nginx -t
   ```

2. Если ошибок нет, перезапустите Nginx:

   ```bash
   sudo systemctl restart nginx
   ```

## Шаг 4: Настройка Cloudflare

1. Войдите в [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Добавьте ваш домен, если он еще не добавлен.
3. Перейдите в раздел **DNS** и добавьте следующие записи:

   | Тип   | Имя | Значение       |
   | ----- | --- | -------------- |
   | A     | @   | 192.0.2.1      |
   | CNAME | www | yourdomain.com |

   **Примечание:** Замените `192.0.2.1` на ваш фактический IP-адрес.

4. Убедитесь, что Proxy Status в Cloudflare установлен на "Proxied" (значок облака оранжевого цвета).

## Шаг 5: Тестирование

1. Проверьте доступность сайта по вашему IP-адресу:

   ```text
   http://<ваш-ip-адрес>
   ```

2. Убедитесь, что сайт доступен через ваш домен, настроенный в Cloudflare:

   ```text
   https://yourdomain.com
   ```

## Дополнительная информация

- **Директория сайта:** Сайт по умолчанию должен находиться в `/var/www/html`.
- **Логи Nginx:** Если что-то не работает, проверьте логи:

  ```bash
  sudo tail -f /var/log/nginx/error.log
  ```

## Поддержка

Если у вас возникли вопросы или трудности, обратитесь к документации Nginx или свяжитесь с вашим администратором.
