import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
    const dao = AssignmentsDao();

    const findAssignmentsForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const assignments = await dao.findAssignmentsForCourse(courseId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findAssignmentById = async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignment = await dao.findAssignmentById(assignmentId);
            if (!assignment) {
                return res.sendStatus(404);
            }
            res.json(assignment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const createAssignment = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can create assignments" });
        }
        try {
            const { courseId } = req.params;
            const newAssignment = await dao.createAssignment(courseId, req.body);
            res.json(newAssignment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const deleteAssignment = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can delete assignments" });
        }
        try {
            const { assignmentId } = req.params;
            const status = await dao.deleteAssignment(assignmentId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const updateAssignment = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can update assignments" });
        }
        try {
            const { assignmentId } = req.params;
            const assignmentUpdates = req.body;
            const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}