# LMS Backend

**LMS (Learning Management System)** — o‘quv markazlari uchun ishlab chiqilgan ta'limni boshqarish tizimining backend qismi. Loyiha administratorlar, o‘qituvchilar va talabalarni boshqarish, kurslar yaratish, darslar, videolar, o‘quv materiallari, to‘lovlar va imtihonlarni boshqarish imkonini beradi.

## Technologies

- **Node.js** — JavaScript runtime
- **Express.js 5** — Backend framework
- **PostgreSQL** — Ma'lumotlar bazasi
- **pg** — PostgreSQL driver
- **JWT (jsonwebtoken)** — Authentication va Authorization
- **Argon2** — Password hashing
- **Joi** — Ma'lumotlarni validatsiya qilish
- **dotenv** — Environment variables
- **express-fileupload** — Fayl va video yuklash

## User Roles

Loyihada 3 xil foydalanuvchi roli mavjud:

| Role | Description |
|---|---|
| Admin | Tizimni to‘liq boshqarish |
| Teacher | O‘z kurslari va darslarini boshqarish |
| Student | Kurslarni ko‘rish, o‘qish va imtihon topshirish |

## Project Structure

```text
lms_backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── courses.js
│   │   ├── exams.js
│   │   ├── lessons.js
│   │   ├── materials.js
│   │   ├── payments.js
│   │   ├── section.js
│   │   ├── staff.js
│   │   ├── students.js
│   │   ├── tasks.js
│   │   └── teachers.js
│   │
│   ├── guards/
│   │   ├── auth.guard.js
│   │   └── role.guard.js
│   │
│   ├── middleware/
│   │   └── validation.js
│   │
│   ├── routers/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── courses.js
│   │   ├── exams.js
│   │   ├── index.js
│   │   ├── lessons.js
│   │   ├── materials.js
│   │   ├── payments.js
│   │   ├── sections.js
│   │   ├── staff.js
│   │   ├── students.js
│   │   ├── tasks.js
│   │   └── teachers.js
│   │
│   ├── services/
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── courses.js
│   │   ├── exams.js
│   │   ├── lessons.js
│   │   ├── materials.js
│   │   ├── payments.js
│   │   ├── sections.js
│   │   ├── staff.js
│   │   ├── students.js
│   │   ├── tasks.js
│   │   └── teachers.js
│   │
│   ├── uploads/
│   │   ├── banner/
│   │   ├── introVideo/
│   │   ├── lessons/
│   │   ├── materials/
│   │   └── tasks/
│   │
│   ├── utils/
│   │   ├── error.js
│   │   ├── jwt.js
│   │   └── validation.js
│   │
│   ├── log/
│   │   └── logger.txt
│   │
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Installation

Repository'ni clone qilish:

```bash
git clone <repository-url>
```

Project papkasiga kirish:

```bash
cd lms_backend
```

Dependencies o‘rnatish:

```bash
npm install
```

Development uchun nodemon o‘rnatish:

```bash
npm install --save-dev nodemon
```

## Environment Variables

Loyiha root papkasida `.env` faylini yarating.

Quyidagi environment variables'larni kiriting:

```env
PORT=
SECRET_KEY=

PG_HOST=
PG_PORT=
PG_NAME=
PG_PASSWORD=
PG_DATABASE=
```

**Environment variables:**

| Variable | Description |
|---|---|
| PORT | Backend server porti |
| SECRET_KEY | JWT secret key |
| PG_HOST | PostgreSQL host |
| PG_PORT | PostgreSQL porti |
| PG_NAME | PostgreSQL username |
| PG_PASSWORD | PostgreSQL password |
| PG_DATABASE | PostgreSQL database nomi |

**Eslatma:** `PG_NAME` — PostgreSQL foydalanuvchi nomi, `PG_DATABASE` esa ma'lumotlar bazasi nomi.

## Database

Loyiha PostgreSQL ma'lumotlar bazasidan foydalanadi.

Database ulanish sozlamalari:

```text
src/config/db.js
```

PostgreSQL ulanishi `pg` kutubxonasi orqali amalga oshiriladi.

## Run Project

Development rejimida ishga tushirish:

```bash
npm run start:dev
```

Yoki nodemon ishlatmasdan:

```bash
node src/server.js
```

Server ishga tushgandan so‘ng API quyidagi manzilda ishlaydi:

```text
http://localhost:PORT/api/v1
```

## API Documentation

Barcha API endpointlar `/api/v1` prefiksi orqali ishlaydi.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/login` | Login va token olish | Public |

Login uchun JSON:

```json
{
    "phone": "",
    "password": ""
}
```

Login muvaffaqiyatli bo‘lsa, quyidagilar qaytariladi:

- accessToken
- refreshToken
- role

Access token orqali himoyalangan endpointlarga murojaat qilinadi.

Header:

```text
token: ACCESS_TOKEN
```

Access token amal qilish muddati — 3 soat.

### Staff

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/staff` | Barcha xodimlarni olish | Admin |
| POST | `/staff` | Yangi xodim qo‘shish | Admin |
| DELETE | `/staff/:userId` | Xodimni o‘chirish | Admin |

### Teachers

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/teachers` | Barcha o‘qituvchilar | Admin |
| POST | `/teachers` | O‘qituvchi qo‘shish | Admin |
| GET | `/teachers/:teacherId/courses` | O‘qituvchi kurslari | Admin, Teacher |
| PATCH | `/teachers/:teacherId` | O‘qituvchi ma'lumotlarini yangilash | Admin |
| DELETE | `/teachers/:teacherId` | O‘qituvchini o‘chirish | Admin |

### Students

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/students` | Talaba ro‘yxatdan o‘tkazish | Public |
| GET | `/students/all` | Barcha talabalarni olish | Admin |
| GET | `/students/:studentId` | Bitta talabani olish | Admin, Student |
| GET | `/students/:studentId/courses` | Talabaning kurslarini olish | Admin, Student |
| PATCH | `/students/:studentId` | Talaba ma'lumotlarini yangilash | Admin |
| DELETE | `/students/:studentId` | Talabani o‘chirish | Admin |

### Categories

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/categories` | Barcha kategoriyalar | Admin |
| POST | `/categories` | Kategoriya yaratish | Admin |
| DELETE | `/categories/:categoryId` | Kategoriyani o‘chirish | Admin |

### Courses

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/courses` | Barcha kurslarni olish | Admin |
| POST | `/courses` | Yangi kurs yaratish | Admin, Teacher |
| PATCH | `/courses/:courseId` | Kursni yangilash | Admin, Teacher |
| DELETE | `/courses/:courseId` | Kursni o‘chirish | Admin, Teacher |

Course yaratishda quyidagi ma'lumotlardan foydalaniladi:

- name
- description
- level
- price
- category_id
- teacher_id
- banner
- introVideo

`banner` va `introVideo` fayllari multipart/form-data orqali yuboriladi.

### Sections

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/sections` | Barcha sectionlarni olish | Admin, Teacher |
| POST | `/sections` | Section yaratish | Admin, Teacher |
| PATCH | `/sections/:id` | Sectionni yangilash | Admin, Teacher |
| DELETE | `/sections/:id` | Sectionni o‘chirish | Admin, Teacher |

Section yaratish uchun:

```json
{
    "name": "",
    "course_id": 0
}
```

### Lessons

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/lessons/:sectionId` | Section darslarini olish | Admin, Teacher |
| POST | `/lessons` | Yangi dars yaratish | Admin, Teacher |
| PATCH | `/lessons/:lessonId` | Darsni yangilash | Admin, Teacher |
| DELETE | `/lessons/:lessonId` | Darsni o‘chirish | Admin, Teacher |

Lesson yaratishda:

- name
- description
- section_id
- video

Video fayli `multipart/form-data` orqali `video` nomi bilan yuboriladi.

Qo‘llab-quvvatlanadigan video formatlari: MP4 va MOV.

Maksimal video hajmi: 100 MB.

### Materials

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/materials/:lessonId` | Dars materiallarini olish | Admin, Teacher |
| POST | `/materials` | Material yaratish | Admin, Teacher |
| PATCH | `/materials/:materialId` | Materialni yangilash | Admin, Teacher |
| DELETE | `/materials/:materialId` | Materialni o‘chirish | Admin, Teacher |

Material yaratishda:

- lesson_id
- description
- files

Fayllar `multipart/form-data` orqali `files` nomi bilan yuboriladi.

Qo‘llab-quvvatlanadigan fayllar:

- PDF
- DOC
- DOCX
- XLS
- XLSX
- PPT
- PPTX

Maksimal fayl hajmi: 10 MB.

Bitta materialga maksimal 10 ta fayl yuklash mumkin.

### Payments

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/payments` | Barcha to‘lovlarni olish | Admin, Student |
| GET | `/payments/:studentId` | Talaba to‘lovlarini olish | Admin, Student |
| POST | `/payments` | To‘lov yaratish | Admin, Student |

Payment yaratish uchun:

```json
{
    "student_id": 0,
    "course_id": 0,
    "amount": 0,
    "type": "cash",
    "status": "paid"
}
```

Payment type qiymatlari:

- cash
- payme
- card

Payment status qiymatlari:

- paid
- pending
- cancelled

Agar `amount` yuborilmasa, kursning bazadagi narxi ishlatiladi.

### Tasks

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/tasks/:lessonId` | Dars vazifalarini olish | Admin, Teacher |
| GET | `/tasks/student/:studentId` | Talaba vazifalarini olish | Admin, Student |
| POST | `/tasks` | Yangi vazifa yaratish | Admin, Teacher |
| PATCH | `/tasks/:taskId` | Vazifani yangilash | Admin, Teacher |
| DELETE | `/tasks/:taskId` | Vazifani o‘chirish | Admin, Teacher |

### Exams

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/exams/:lessonId` | Dars imtihonlarini olish | Admin, Teacher |
| POST | `/exams` | Imtihon yaratish | Admin, Teacher |
| PATCH | `/exams/:examId` | Imtihonni yangilash | Admin, Teacher |
| DELETE | `/exams/:examId` | Imtihonni o‘chirish | Admin, Teacher |
| GET | `/exams/student/:lessonId` | Talaba uchun imtihonlarni olish | Student |
| POST | `/exams/student/:lessonId/submit` | Imtihon javoblarini yuborish | Student |

Imtihon yaratish uchun:

```json
{
    "lesson_id": 0,
    "question": "",
    "option_a": "",
    "option_b": "",
    "option_c": "",
    "option_d": "",
    "correct_answer": "A"
}
```

To‘g‘ri javob quyidagi qiymatlardan biri bo‘lishi kerak:

- A
- B
- C
- D

Imtihon topshirishda:

```json
{
    "answers": [
        {
            "exam_id": 0,
            "answer": "A"
        }
    ]
}
```

Natijada:

- total_questions
- correct_answers
- wrong_answers
- score

qaytariladi.

## File Uploads

Loyihada fayllar `express-fileupload` orqali yuklanadi.

Yuklangan fayllar quyidagi papkalarda saqlanadi:

| Folder | Description |
|---|---|
| uploads/banner | Kurs bannerlari |
| uploads/introVideo | Kurs tanishtiruv videolari |
| uploads/lessons | Dars videolari |
| uploads/materials | Dars materiallari |
| uploads/tasks | Vazifa fayllari |

Yuklangan fayllarga quyidagi URL orqali murojaat qilish mumkin:

```text
http://localhost:PORT/uploads/FILE_NAME
```

Static fayllar Express orqali taqdim etiladi.

## Error Handling

Loyihada umumiy error handling middleware mavjud.

HTTP status kodlari:

| Status | Description |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 413 | Payload Too Large |
| 415 | Unsupported Media Type |
| 500 | Internal Server Error |

Server xatoliklari quyidagi faylga yoziladi:

```text
src/log/logger.txt
```

## Security

- JWT orqali authentication.
- Role-based authorization.
- Argon2 orqali password hashing.
- Joi orqali request validation.
- Environment variables orqali maxfiy sozlamalarni saqlash.
- Fayl hajmi va formatini tekshirish.

## Author

**Baxtiyor Sirojiddinov**

LMS Backend Project

