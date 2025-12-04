import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
    const dao = EnrollmentsDao();

    const findEnrollmentsForCurrentUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const enrollments = await dao.findEnrollmentsForUser(currentUser._id);
            res.json(enrollments);
        } catch (error) {
            console.error("Find enrollments error:", error);
            res.status(500).json({ message: error.message });
        }
    };

    const enroll = async (req, res) => {
        const { user, course } = req.body;
        if (!user || !course) {
            return res.status(400).json({ message: "User and course are required" });
        }
        try {
            const enrollment = await dao.enrollUserInCourse(user, course);
            res.json(enrollment);
        } catch (error) {
            console.error("Enrollment error:", error);
            res.status(500).json({ message: error.message });
        }
    };

    const unenroll = async (req, res) => {
        const { enrollmentId } = req.params;
        try {
            const result = await dao.unenrollById(enrollmentId);
            if (!result) {
                return res.status(404).json({ message: "Enrollment not found" });
            }
            res.sendStatus(200);
        } catch (error) {
            console.error("Unenroll error:", error);
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/enrollments", findEnrollmentsForCurrentUser);
    app.post("/api/enrollments", enroll);
    app.delete("/api/enrollments/:enrollmentId", unenroll);
}