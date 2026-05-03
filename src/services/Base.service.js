class BaseService{
    async create(model, data){
        const newModel = await model.create(data);
        return newModel;
    }
    async update(model, data, id){
        const instace = await model.findByPk(id);
        if(!instace) return null
        await instace.update(data);
        return instace;
    }
    async getAll(model){
        const allModel = await model.findAll();
        return allModel;
    }
    async getById(model, id){
        const instance = await model.findByPk(id);
        if(!instance) return null;
        return instance;
    }
    //analizar como se realizara las eliminaciones
    async delete(model, id){
        const findModel = await model.findByPk(id);
        if(!findModel) return null;
        await findModel.destroy();
        return true
    }
}

const baseService = new BaseService();

export default baseService;