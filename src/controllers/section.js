import categorySections from "../services/sections.js"

class SectionController {
    async getAllSection(req, res, next) {
        let resdate = await categorySections.getAllSection()
        return res.status(resdate.status).json(resdate)
    }
    async createSections(req, res, next) {
        let resdate = await categorySections.createSection(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }
    async updateSection(req, res, next) {
        let resdate = await categorySections.updateSection(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }
    async deleteSection(req, res, next) {
        let resdate = await categorySections.deleteSection(req, res, next)
        if (resdate) {
            return res.status(resdate.status).json(resdate)

        }
    }

}

const sectionController = new SectionController()
export default sectionController