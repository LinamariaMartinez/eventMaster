# Configuración de Despliegue - Variables de Entorno

## Variables Requeridas para Vercel

Para que la aplicación funcione correctamente en producción, debes configurar las siguientes variables de entorno en tu panel de Vercel:

### Variables de Supabase (REQUERIDAS)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### Variables de Autenticación (REQUERIDAS)
```bash
NEXTAUTH_SECRET=catalina-lezama-eventos-2025-secret-key-production-ready
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### Variables de Google Sheets (OPCIONALES)
```bash
GOOGLE_CLIENT_EMAIL=catalina-sheets-service@catalina-lezama-events.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoP62n9niOaic9
rAgl/bMD33qBJJWk53F3bRZkhmHiLjPZnDjnuwLHfge5Cr+k/73V4ChIHSph6zPY
lKHe2cdjQi4RZQjkJMlJXpZRAYseO0FFsHD1YCjaWkvcUMiLhanff143KZqHBQcY
D/f4Wt+O607eHdB1AS4o0ScRLLwiPJ7XEW3vV6baMMAP1dj08PxyT5uveXh/j4zV
Uq8z21vM4LCN16MK0tHUFhDqI7+Wg1DAFmqDMBHBGJsaA5umiUrFKAS5nq7QOoyr
qSQEvqSc9V7wnBwEkbM3H+IHu6wQ6SH6pvvv2Tgr8lCw02SGCH15fJD1sXW/hjKq
KWqhuSwjAgMBAAECggEAJgC0JdMrKefaUzjPYl1qmP5ael8cGfJZE8OlIjGkXGVZ
Otbpl5YLK6pQ7j/6R7eoVm3aS2ejEhkBTfNMmLySJ95j73PlzTpt6M+fnk598Ocr
eCVBbns43xE0P2BT3Afl9eCcFFOmXscI8itxNDy6cFrAJrWPR05r8bZEX8G+APFY
iltK+T6DqZ7Rs0a2J6CvjGnnIBgErTUD1buZ3OINyO7rVLmmo8RlZCKYfn82h0m2V
H4UgPtLRJWuR2Iu/Qm8VAaw41eqAZd3BM/TP73teY0AiKwrvopqkf1aweECIfjzM
wEf9OYGgZfQeGEfy02A8GWLPtHqTIGuWcFLauHUKKQKBgQDWAAJ4Ymx/8vWKIHU1
CaUi9rPGC0/lzrfF9IsTEs7VmO5E6tMTC8v/kflWXEZrhgRTZs1ssvdlZDzUUgjT
To8Ny/5vCJQQGM3EFuPTlNVzXyEN56sxTNM/kznv8dHZYYDH2lHR8Z2iIUo8P6Gk
ts7b1tPF4fShgmHjNwThAjaYFwKBgQDJRP1D62QAGkA77ynuEAgoKc+jWsgQuHtz
YtSukIw52QhIBk3hzMzrXm/NqkGsZmwCQii1P954KnyRzuvlYHZ8iD9QceD0LRJs
GVPRIekgHCY64Od2daRsPSKiBC/rTFf+CRO3MDbiQzuhMH9cqJb5nY8pjE4ajjPp
av4GB3wH1QKBgEtVn4j/pRB52ERy3q/4IEEptemvC8ZrujgeuWLSiSuada6fOAUJ
bxweKDdlroilmho+I2zzp7Hy0pMv+dlhW2zQ9lXiIDV2deFk6XkPeQDvaTR67MIj
OG62BnxYlbY/49T3HzyYIRT1QSvqfp38mN+9RbnwrGy6+HjDYp1PaSarAoGBAIv2
7QU5gb5MgxTq2cbS4UlE4j9gVzbBhCAWv35xyQJFemvT7n8zE+IuNyPX3XnNdBkR
9wssUkJQkXY4ZnWJ4nvxp84Ck4Raf7Aq4M3TfjI1QSS62FvZrbETxqzSqpw/6AUi
PNKstc4dIS+T8U33c548wp0LFBmFgHY3UFXTCJ7NAoGBAMK7iDXBRdR85a6xW7fQ
vL54B/jNZTDdPzr371llqGgZ/i64zdesVhf25oEyvr/b8vA4Vg0z/pnI2Dz3u5mv
tJsHM2I6SN9eOziaZpspiZHMUu9P4SbrpGu6oUyf+0Cc+3IIGxXE9NqoT8oPVsch
JPw9QZM5Bo4iDPJtg97h2pY4
-----END PRIVATE KEY-----"
GOOGLE_SHEETS_CLIENT_ID=109730394222569028137
GOOGLE_SHEET_ID=b81187e693f321ca639167e28e20886e83309573
```

## Cómo Configurar en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Ve a Settings → Environment Variables**
3. **Agrega cada una de las variables mencionadas arriba**
4. **IMPORTANTE**: Configura las variables para todos los entornos (Production, Preview, Development)
5. **Redeploya tu aplicación**

## Variables Críticas

Las siguientes variables son **ABSOLUTAMENTE NECESARIAS** para que funcione el login:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Troubleshooting

Si sigues teniendo problemas:

1. Verifica que todas las variables estén escritas exactamente como se muestran
2. Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de Vercel
3. Redeploya después de agregar las variables
4. Revisa los logs de deployment en Vercel

## URL de Producción

Actualiza `NEXTAUTH_URL` con tu URL real de Vercel:
```bash
NEXTAUTH_URL=https://catalina-lezama-eventos.vercel.app
```
(Reemplaza con tu dominio real)