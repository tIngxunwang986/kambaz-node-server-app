import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app, db) {
    const dao = EnrollmentsDao(db);

    const findAllEnrollments = (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.json(enrollments);
    };

    const enroll = (req, res) => {
        const { user, course } = req.body;
        const enrollment = dao.enrollUserInCourse(user, course);
        if (!enrollment) {
            res.sendStatus(204);
        } else {
            res.json(enrollment);
        }
    };

    const unenroll = (req, res) => {
        const { enrollmentId } = req.params;
        dao.unenroll(enrollmentId);
        res.sendStatus(200);
    };

    app.get("/api/enrollments", findAllEnrollments);
    app.post("/api/enrollments", enroll);
    app.delete("/api/enrollments/:enrollmentId", unenroll);
}