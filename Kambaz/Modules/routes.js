import ModulesDao from "./dao.js";

export default function ModulesRoutes(app) {
    const dao = ModulesDao();

    const findModulesForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const modules = await dao.findModulesForCourse(courseId);
            res.json(modules);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const createModuleForCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can create modules" });
        }
        try {
            const { courseId } = req.params;
            const module = { ...req.body };
            const newModule = await dao.createModule(courseId, module);
            res.json(newModule);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const deleteModule = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can delete modules" });
        }
        try {
            const { courseId, moduleId } = req.params;
            const status = await dao.deleteModule(courseId, moduleId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const updateModule = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can update modules" });
        }
        try {
            const { courseId, moduleId } = req.params;
            const moduleUpdates = req.body;
            const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
    app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
}