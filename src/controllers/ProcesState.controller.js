import procesStateService from "../services/ProcesState.service.js";

class ProcesStateController {
    async update(req, res) {
        const { id_process } = req.params;
        try {
            await procesStateService.update(req.body, id_process, req.adminId);
            res.ok({ message: "Estados actualizados correctamente" });
        } catch (error) {
            res.forbidden(error.message);
        }
    }
}

const procesStateController = new ProcesStateController();
export default procesStateController;
