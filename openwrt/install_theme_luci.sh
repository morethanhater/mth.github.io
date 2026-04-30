#!/bin/sh

set -e

cd /tmp

echo "Получаю ссылку..."
URL=$(curl -s https://api.github.com/repos/ChesterGoodiny/luci-theme-proton2025/releases/latest \
  | grep browser_download_url \
  | grep apk \
  | cut -d '"' -f 4)

if [ -z "$URL" ]; then
  echo "Ошибка: не удалось получить URL"
  exit 1
fi

echo "Скачиваю пакет..."
wget --no-check-certificate -O luci-theme-proton2025.apk "$URL"

echo "Устанавливаю..."
apk add --allow-untrusted ./luci-theme-proton2025.apk

echo "Готово!"
