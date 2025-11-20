import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
    const dao = ModulesDao(db);

    const findModulesForCourse = (req, res) => {
        const { courseId } = req.params;
        const modules = dao.findModulesForCourse(courseId);
        res.json(modules);
    };

    const createModuleForCourse = (req, res) => {
        const { courseId } = req.params;
        const module = { ...req.body, course: courseId };
        const newModule = dao.createModule(module);
        res.json(newModule);
    };

    const deleteModule = (req, res) => {
        const { moduleId } = req.params;
        dao.deleteModule(moduleId);
        res.sendStatus(200);
    };

    const updateModule = (req, res) => {
        const { moduleId } = req.params;
        const moduleUpdates = req.body;
        const updatedModule = dao.updateModule(moduleId, moduleUpdates);
        if (!updatedModule) {
            res.sendStatus(404);
        } else {
            res.send(updatedModule);
        }
    };

    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.delete("/api/modules/:moduleId", deleteModule);
    app.put("/api/modules/:moduleId", updateModule);
}