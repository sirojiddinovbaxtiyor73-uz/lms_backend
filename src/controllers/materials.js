import materialsService from "../services/materials.js"

class MaterialController {
    async getAllMaterials(req, res, next) {
        try {
            const result = await materialsService.getAllMaterials(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createMaterial(req, res, next) {
        try {
            const result = await materialsService.createMaterial(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async updateMaterial(req, res, next) {
        try {
            const result = await materialsService.updateMaterial(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async deleteMaterial(req, res, next) {
        try {
            const result = await materialsService.deleteMaterial(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const materialController = new MaterialController()
export default materialController