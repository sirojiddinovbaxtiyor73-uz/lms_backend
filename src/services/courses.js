import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class CoursesService {

    async getAllCourses() {
        let courses = await pool.query("select * from courses")

        return {
            status: 200,
            data: courses.rows
        }
    }

    async createCourse(req, res, next) {
        try {
            const { name, description, level, price, category_id } = req.body
            const { banner, introVideo } = req.files
            const teacherId = req.user.id

            const exitCourse = await pool.query(`select * from courses where name=$1`, [name])

            if (exitCourse.rows.length) {
                return next(new ErrorException(409, "Course already exist!"))
            }

            if (!banner) {
                return next(new ErrorException(400, "Course banner must be upload"))
            }

            let fileNameBanner = Date.now() + "." + banner.mimetype.split("/")[1]

            const allowFileTypes = ["png", "jpg", "jpeg", "svg"]
            if (!allowFileTypes.includes(banner.mimetype.split("/")[1])) {
                return next(new ErrorException(415, "UnSupportedMediaType"))
            }

            banner.mv(process.cwd() + "/src/uploads/banner/" + fileNameBanner, (error) => {
                if (error) {
                    return next(new ErrorException(500, error))
                }
            })

            let fileNameIntroVideo = null
            if (introVideo) {
                fileNameIntroVideo = Date.now() + "." + introVideo.mimetype.split("/")[1]

                introVideo.mv(process.cwd() + "/src/uploads/introVideo/" + fileNameIntroVideo, (error) => {
                    if (error) {
                        return next(new ErrorException(500, error))
                    }
                })
            }

            await pool.query(`insert into courses (banner,intro_video,name,description,level,price,category_id,teacher_id)
                values($1,$2,$3,$4,$5,$6,$7,$8)`, [fileNameBanner, fileNameIntroVideo, name, description, level,price, category_id, teacherId])

            return {
                status: 201,
                message: "course added!"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

let coursesService = new CoursesService()
export default coursesService