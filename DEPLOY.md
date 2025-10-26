# OPT STOCK Website

## Быстрый деплой на различные платформы

### 1. GitHub Pages

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

### 2. Netlify

Создайте файл `netlify.toml`:

```toml
[build]
  publish = "."
  command = "echo 'No build required'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Vercel

Файл `vercel.json`:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Переменные окружения

Создайте файл `.env` (НЕ коммитьте его в Git!):

```
PHONE_NUMBER=996555123456
INSTAGRAM_USERNAME=optstock_kg
TIKTOK_USERNAME=optstock_kg
```

Добавьте `.env` в `.gitignore`
