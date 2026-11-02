# LMS Backend

O'quv markazi uchun LMS (Learning Management System) backend qismi. Xodimlar va o'qituvchilarni boshqarish, JWT orqali avtorizatsiya.

## Texnologiyalar

- Node.js, Express 5
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`), parollarni hashlash (`argon2`)
- Validatsiya (`joi`)

## Ishga tushirish

```bash
git clone <git@github.com:sirojiddinovbaxtiyor73-uz/lms_backend.git>
cd lms_backend
npm install
```

`.env.example` faylidan nusxa olib, `.env` yarating va qiymatlarni to'ldiring:

```env
PORT=
SECRET_KEY=
PG_HOST=
PG_PORT=
PG_NAME=
PG_PASSWORD=
PG_DATABASE=
```

Serverni ishga tushiring:

```bash
npm run start:dev
```

## Loyiha tuzilishi

```
src/
├── config/        # baza ulanishi
├── controllers/   # so'rovlarni qabul qiladi
├── services/      # biznes logika va SQL
├── routers/       # yo'nalishlar
├── middleware/    # validatsiya
├── guards/        # auth va role tekshiruvi
└── utils/         # jwt, xatolar, joi sxemalari
```

## API

Asosiy manzil: `http://localhost:9090/api/v1`

| Metod | Yo'l | Tavsif | Himoya |
|-------|------|--------|--------|
| POST | `/auth/login` | Login, token olish | - |
| GET | `/staff` | Barcha xodimlar | admin |
| POST | `/staff` | Xodim qo'shish | - |
| DELETE | `/staff/:userId` | Xodimni o'chirish | - |
| GET | `/teachers` | Barcha o'qituvchilar | admin |
| POST | `/teachers` | O'qituvchi qo'shish | - |

Himoyalangan yo'llarga so'rov yuborganda `token` headeriga login paytida olingan `accessToken` ni qo'shing.

## Muallif

Baxtiyor