import dashboard from "../services/Dashboard.js";

class DashboardController {
    async getDashboard(req, res) {
        try {
            const result = await dashboard.getDashboard(req.adminId);
            res.ok(result);
        } catch (error) {
            res.serverError(error.message);
        }
    }

    async clientsDashboard(req, res) {
        try {
            const result = await dashboard.clientsDashboard(req.adminId);
            res.ok(result);
        } catch (error) {
            res.serverError(error.message);
        }
    }
}

const dashboardController = new DashboardController();
export default dashboardController;
