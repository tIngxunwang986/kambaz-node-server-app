import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
    const dao = AssignmentsDao(db);

    const findAllAssignments = (req, res) => {
        res.json(db.assignments);
    };

    const findAssignmentsForCourse = (req, res) => {
        const { courseId } = req.params;
        const assignments = dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    const findAssignmentById = (req, res) => {
        const { assignmentId } = req.params;
        const assignment = dao.findAssignmentById(assignmentId);
        if (!assignment) {
            res.sendStatus(404);
        } else {
            res.json(assignment);
        }
    };

    const createAssignmentForCourse = (req, res) => {
        const { courseId } = req.params;
        const newAssignment = dao.createAssignment(courseId, req.body);
        res.json(newAssignment);
    };

    const updateAssignment = (req, res) => {
        const { assignmentId } = req.params;
        const updated = dao.updateAssignment(assignmentId, req.body);
        if (!updated) {
            res.sendStatus(404);
        } else {
            res.json(updated);
        }
    };

    const deleteAssignment = (req, res) => {
        const { assignmentId } = req.params;
        dao.deleteAssignment(assignmentId);
        res.sendStatus(200);
    };

    app.get("/api/assignments", findAllAssignments);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}