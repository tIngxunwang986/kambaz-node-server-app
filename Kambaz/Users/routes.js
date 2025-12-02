import UsersDao from "./dao.js";
import CoursesDao from "../courses/dao.js";

export default function UserRoutes(app) {
    const dao = UsersDao();
    const coursesDao = CoursesDao();

    const createUser = async (req, res) => {
        const User = await dao.createUser(req.body);
        res.json(User);
    };

    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    const findUserById = async (req, res) => {
        const userId = req.params.userId;
        const user = await dao.findUserById(userId);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const userId = req.params.userId;
        const status = await dao.deleteUser(userId);
        res.json(status);
    };

    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already taken" });
            return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);

        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res
                .status(401)
                .json({ message: "Unable to login. Try again later." });
        }
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };

    const findCoursesForCurrentUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        try {
            const courses = await coursesDao.findCoursesForEnrolledUser(currentUser._id);
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    app.get("/api/users/current/courses", findCoursesForCurrentUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.get("/api/users/profile", profile);
}