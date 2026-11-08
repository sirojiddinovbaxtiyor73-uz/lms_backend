import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class StudentService {
    async getAllStudents(req) {
        const { status } = req.query

        if (status && !["active", "inactive"].includes(status)) {
            throw new ErrorException(400, "Status must be active or inactive")
        }

        const students = await pool.query(
            `select s.id, s.fullname, s.phone, s.photo, s.created_at, s.status,
                coalesce(
                    json_agg(json_build_object('id', c.id, 'name', c.name) order by sc.id)
                        filter (where c.id is not null),
                    '[]'::json
                ) as courses
         from students s
         left join studentcourse sc on sc.student_id = s.id
         left join courses c on c.id = sc.courses_id
         where ($1::text is null or s.status = $1)
         group by s.id
         order by s.id`,
            [status ?? null]
        )

        return {
            status: 200,
            data: students.rows
        }
    }

    async getOneStudent(req) {
        const studentId = Number(req.params.studentId)
        if (!Number.isInteger(studentId) || studentId <= 0) {
            throw new ErrorException(400, "Invalid student id")
        }

        const student = await pool.query(
            `select s.photo, s.fullname, s.phone, s.created_at,
                (select count(*)::int from studentcourse sc where sc.student_id = s.id) as courses_count,
                (select count(*)::int from payments p where p.student_id = s.id) as payments_count
         from students s
         where s.id = $1`,
            [studentId]
        )

        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }

        return {
            status: 200,
            data: student.rows[0]
        }
    }

    async createStudent(req) {
        const { fullname, phone, password } = req.body

        const exist = await pool.query("select id from students where phone=$1", [phone])
        if (exist.rows.length) {
            throw new ErrorException(409, "Student already exist")
        }

        const hashPass = await argon.hash(password)

        try {
            await pool.query(
                `insert into students(fullname,phone,password)
            values($1,$2,$3)`, [fullname, phone, hashPass]
            )
        } catch (error) {
            if (error.code == "23505") {
                throw new ErrorException(409, "Student already exist")
            }
            throw error
        }

        return {
            status: 201,
            message: "Student added"
        }
    }

    async deleteStudent(req) {
        const studentId = Number(req.params.studentId)

        if (!Number.isInteger(studentId) || studentId <= 0) {
            throw new ErrorException(400, "Invalid student ID")
        }

        const student = await pool.query(`select id, status from students where id=$1`, [studentId])
        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }

        if (student.rows[0].status == "inactive") {
            throw new ErrorException(409, "Student already deleted")
        }

        await pool.query("update students set status='inactive' where id=$1", [studentId])

        return {
            status: 200,
            message: "Student deleted"
        }
    }

    async updateStudent(req) {
        const studentId = Number(req.params.studentId)
        if (!Number.isInteger(studentId) || studentId <= 0) {
            throw new ErrorException(400, "Invalid student id")
        }

        const { fullname, phone, course_id } = req.body

        const student = await pool.query("select id, status from students where id=$1", [studentId])
        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }

        if (phone !== undefined) {
            const existPhone = await pool.query(
                "select id from students where phone=$1 and id<>$2", [phone, studentId]
            )
            if (existPhone.rows.length) {
                throw new ErrorException(409, "Phone already used by another student")
            }
        }

        if (course_id !== undefined) {
            if (student.rows[0].status === "inactive") {
                throw new ErrorException(409, "Student is inactive")
            }

            const course = await pool.query("select id from courses where id=$1", [course_id])
            if (!course.rows.length) {
                throw new ErrorException(404, "Course not found")
            }

            const enrolled = await pool.query(
                "select id from studentcourse where student_id=$1 and courses_id=$2", [studentId, course_id]
            )
            if (enrolled.rows.length) {
                throw new ErrorException(409, "Student already enrolled to this course")
            }
        }

        try {
            await pool.query(
                `update students set
                fullname = coalesce($1, fullname),
                phone = coalesce($2, phone)
             where id = $3`,
                [fullname, phone, studentId]
            )
        } catch (error) {
            if (error.code == "23505") {
                throw new ErrorException(409, "Phone already used by another student")
            }
            throw error
        }

        if (course_id !== undefined) {
            try {
                await pool.query(
                    "insert into studentcourse(student_id, courses_id) values($1,$2)", [studentId, course_id]
                )
            } catch (error) {
                if (error.code == "23505") {
                    throw new ErrorException(409, "Student already enrolled to this course")
                }
                throw error
            }
        }

        return {
            status: 200,
            message: "Student updated"
        }
    }
}

const studentService = new StudentService()
export default studentService