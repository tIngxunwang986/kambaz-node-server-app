import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app) {
    const dao = AssignmentsDao();

    const findAllAssignments = async (req, res) => {
        const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
        res.json(assignments);
    };

    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    const findAssignmentById = async (req, res) => {
        const { assignmentId } = req.params;
        const assignment = await dao.findAssignmentById(assignmentId);
        if (!assignment) {
            res.sendStatus(404);
        } else {
            res.json(assignment);
        }
    };

    const createAssignmentForCourse = async (req, res) => {
        const { courseId } = req.params;
        const newAssignment = await dao.createAssignment(courseId, req.body);
        res.json(newAssignment);
    };

    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const status = await dao.updateAssignment(assignmentId, req.body);
        res.send(status);
    };

    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const status = await dao.deleteAssignment(assignmentId);
        res.send(status);
    };

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}