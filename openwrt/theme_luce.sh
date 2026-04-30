cd /tmp
URL=$(curl -s https://api.github.com/repos/ChesterGoodiny/luci-theme-proton2025/releases/latest | grep browser_download_url | grep apk | cut -d '"' -f 4)
wget --no-check-certificate -O luci-theme-proton2025.apk "$URL"
apk add --allow-untrusted ./luci-theme-proton2025.apk
