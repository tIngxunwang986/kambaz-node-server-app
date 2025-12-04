import UsersDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const dao = UsersDao();
    const enrollmentsDao = EnrollmentsDao();

    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findAllUsers = async (req, res) => {
        try {
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
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await dao.findUserById(userId);
            if (!user) {
                res.sendStatus(404);
                return;
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const deleteUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({ message: "Only admin can delete users" });
        }
        try {
            const userId = req.params.userId;
            const status = await dao.deleteUser(userId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const signup = async (req, res) => {
        try {
            const user = await dao.findUserByUsername(req.body.username);
            if (user) {
                res.status(400).json({ message: "Username already taken" });
                return;
            }
            const currentUser = await dao.createUser(req.body);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);

            if (currentUser) {
                req.session["currentUser"] = currentUser;
                res.json(currentUser);
            } else {
                res.status(401).json({ message: "Unable to login. Try again later." });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
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
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.sendStatus(401);
        }
        try {
            const { userId } = req.params;
            const userUpdates = req.body;

            if (currentUser._id !== userId && currentUser.role !== "ADMIN") {
                return res.status(403).json({ message: "Cannot update other users" });
            }

            await dao.updateUser(userId, userUpdates);

            if (currentUser._id === userId) {
                req.session["currentUser"] = { ...currentUser, ...userUpdates };
            }
            res.json(req.session["currentUser"]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const findCoursesForCurrentUser = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        try {
            const courses = await enrollmentsDao.findCoursesForUser(currentUser._id);
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };


    app.get("/api/users/current/courses", findCoursesForCurrentUser);
    app.get("/api/users/profile", profile);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
}