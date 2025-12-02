import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    const dao = EnrollmentsDao();

    const findAllEnrollments = async (req, res) => {
        try {
            const enrollments = await dao.findAllEnrollments();
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findEnrollmentsForCurrentUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const enrollments = await dao.findEnrollmentsForUser(currentUser._id);
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const enroll = async (req, res) => {
        const { user, course } = req.body;
        try {
            const enrollment = await dao.enrollUserInCourse(user, course);
            res.json(enrollment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const unenroll = async (req, res) => {
        const { enrollmentId } = req.params;
        try {
            await dao.unenrollById(enrollmentId);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/enrollments", findEnrollmentsForCurrentUser);
    app.post("/api/enrollments", enroll);
    app.delete("/api/enrollments/:enrollmentId", unenroll);
}