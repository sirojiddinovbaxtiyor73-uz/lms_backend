import path from "path"
import fs from "fs/promises"
import { randomUUID } from "crypto"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

const fileTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]
const maxFileSize = 10 * 1024 * 1024
const maxFiles = 10
const folder = path.join(process.cwd(), "src", "uploads", "materials")

class MaterialsService {
    async getAllMaterials(req) {
        const lessonId = Number(req.params.lessonId)
        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson id")
        }

        const lesson = await pool.query(
            `select l.id, l.name, c.id as course_id, c.name as course_name, c.teacher_id
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`, [lessonId]
        )
        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }

        const { id, name, course_id, course_name, teacher_id } = lesson.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const materials = await pool.query(
            `select m.id, m.description,
                    coalesce(
                        json_agg(json_build_object('id', f.id, 'file', f.file, 'name', f.original_name, 'size', f.size) order by f.id)
                            filter (where f.id is not null),
                        '[]'::json
                    ) as files
             from materials m
             left join material_files f on f.material_id = m.id
             where m.lesson_id=$1
             group by m.id
             order by m.id`, [lessonId]
        )

        return {
            status: 200,
            lesson: { id, name },
            course: { id: course_id, name: course_name },
            data: materials.rows
        }
    }

    async createMaterial(req) {
        const { lesson_id } = req.body
        const description = req.body.description.trim()
        const files = [].concat(req.files?.files ?? [])

        if (!files.length) {
            throw new ErrorException(400, "At least one file must be upload")
        }
        if (files.length > maxFiles) {
            throw new ErrorException(400, "Maximum 10 files allowed")
        }
        for (const file of files) {
            if (!fileTypes.includes(file.mimetype)) {
                throw new ErrorException(415, "File must be pdf, excel, word or powerpoint")
            }
            if (file.size > maxFileSize) {
                throw new ErrorException(413, "Each file must be less than 10 MB")
            }
        }

        const lesson = await pool.query(
            `select l.id, c.teacher_id, c.status
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`, [lesson_id]
        )
        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }
        if (req.user.role === "teacher" && lesson.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "You can't add material to this lesson")
        }
        if (lesson.rows[0].status !== "active") {
            throw new ErrorException(400, "Course is not active")
        }

        await fs.mkdir(folder, { recursive: true })
        const saved = []
        for (const file of files) {
            const fileName = randomUUID() + path.extname(file.name)
            await file.mv(path.join(folder, fileName))
            saved.push({ file: fileName, original: file.name, size: file.size })
        }

        const client = await pool.connect()
        try {
            await client.query("begin")
            const material = await client.query(
                "insert into materials(lesson_id, description) values($1,$2) returning id", [lesson_id, description]
            )
            for (const f of saved) {
                await client.query(
                    "insert into material_files(material_id, file, original_name, size) values($1,$2,$3,$4)",
                    [material.rows[0].id, f.file, f.original, f.size]
                )
            }
            await client.query("commit")
        } catch (error) {
            await client.query("rollback").catch(() => { })
            for (const f of saved) {
                await fs.unlink(path.join(folder, f.file)).catch(() => { })
            }
            throw error
        } finally {
            client.release()
        }

        return {
            status: 201,
            message: "Material added"
        }
    }

    async updateMaterial(req) {
        const materialId = Number(req.params.materialId)
        if (!Number.isInteger(materialId) || materialId <= 0) {
            throw new ErrorException(400, "Invalid material id")
        }

        const material = await pool.query(
            `select m.id, c.teacher_id
             from materials m
             join lessons l on l.id = m.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where m.id=$1`, [materialId]
        )
        if (!material.rows.length) {
            throw new ErrorException(404, "Material not found")
        }
        if (req.user.role === "teacher" && material.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const description = req.body?.description?.trim()
        const removeIds = req.body?.remove_file_ids ? req.body.remove_file_ids.split(",").map(Number) : []
        const newFiles = [].concat(req.files?.files ?? [])

        if (description === undefined && !removeIds.length && !newFiles.length) {
            throw new ErrorException(400, "Nothing to update")
        }

        for (const file of newFiles) {
            if (!fileTypes.includes(file.mimetype)) {
                throw new ErrorException(415, "File must be pdf, excel, word or powerpoint")
            }
            if (file.size > maxFileSize) {
                throw new ErrorException(413, "Each file must be less than 10 MB")
            }
        }

        const oldFiles = await pool.query("select id, file from material_files where material_id=$1", [materialId])
        const removeFiles = oldFiles.rows.filter(f => removeIds.includes(f.id))
        if (removeFiles.length !== new Set(removeIds).size) {
            throw new ErrorException(404, "File not found in this material")
        }

        const total = oldFiles.rows.length - removeFiles.length + newFiles.length
        if (total < 1) {
            throw new ErrorException(400, "Material must have at least one file")
        }
        if (total > maxFiles) {
            throw new ErrorException(400, "Maximum 10 files allowed")
        }

        await fs.mkdir(folder, { recursive: true })
        const saved = []
        for (const file of newFiles) {
            const fileName = randomUUID() + path.extname(file.name)
            await file.mv(path.join(folder, fileName))
            saved.push({ file: fileName, original: file.name, size: file.size })
        }

        const client = await pool.connect()
        try {
            await client.query("begin")
            await client.query(
                "update materials set description = coalesce($1, description) where id=$2", [description, materialId]
            )
            if (removeFiles.length) {
                await client.query("delete from material_files where id = any($1::int[])", [removeFiles.map(f => f.id)])
            }
            for (const f of saved) {
                await client.query(
                    "insert into material_files(material_id, file, original_name, size) values($1,$2,$3,$4)",
                    [materialId, f.file, f.original, f.size]
                )
            }
            await client.query("commit")
        } catch (error) {
            await client.query("rollback").catch(() => { })
            for (const f of saved) {
                await fs.unlink(path.join(folder, f.file)).catch(() => { })
            }
            throw error
        } finally {
            client.release()
        }

        for (const f of removeFiles) {
            await fs.unlink(path.join(folder, f.file)).catch(() => { })
        }

        return {
            status: 200,
            message: "Material updated"
        }
    }

    async deleteMaterial(req) {
        const materialId = Number(req.params.materialId)
        if (!Number.isInteger(materialId) || materialId <= 0) {
            throw new ErrorException(400, "Invalid material id")
        }

        const material = await pool.query(
            `select m.id, c.teacher_id
             from materials m
             join lessons l on l.id = m.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where m.id=$1`, [materialId]
        )
        if (!material.rows.length) {
            throw new ErrorException(404, "Material not found")
        }
        if (req.user.role === "teacher" && material.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const files = await pool.query("select file from material_files where material_id=$1", [materialId])

        await pool.query("delete from materials where id=$1", [materialId])

        for (const f of files.rows) {
            await fs.unlink(path.join(folder, f.file)).catch(() => { })
        }

        return {
            status: 200,
            message: "Material deleted"
        }
    }
}

const materialsService = new MaterialsService()
export default materialsService