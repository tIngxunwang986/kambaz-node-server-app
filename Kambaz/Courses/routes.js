import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
    const dao = CoursesDao();
    const enrollmentsDao = EnrollmentsDao();

    const findAllCourses = async (req, res) => {
        try {
            const courses = await dao.findAllCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.sendStatus(401);
            }
            userId = currentUser._id;
        }
        try {
            const courses = await enrollmentsDao.findCoursesForUser(userId);
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can create courses" });
        }
        try {
            const newCourse = await dao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const deleteCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can delete courses" });
        }
        try {
            const { courseId } = req.params;
            await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
            const status = await dao.deleteCourse(courseId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const updateCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only faculty can update courses" });
        }
        try {
            const { courseId } = req.params;
            const courseUpdates = req.body;
            const status = await dao.updateCourse(courseId, courseUpdates);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findUsersForCourse = async (req, res) => {
        try {
            const { cid } = req.params;
            const users = await enrollmentsDao.findUsersForCourse(cid);
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.sendStatus(401);
            }
            uid = currentUser._id;
        }
        try {
            const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
            res.json(status);
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Already enrolled" });
            }
            res.status(500).json({ message: error.message });
        }
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.sendStatus(401);
            }
            uid = currentUser._id;
        }
        try {
            const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/courses", findAllCourses);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/courses", createCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.put("/api/courses/:courseId", updateCourse);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.get("/api/courses/:cid/users", findUsersForCourse);
}