import model from "./model.js";

export default function EnrollmentsDao() {
    async function findAllEnrollments() {
        return model.find();
    }

    async function findEnrollmentsForUser(userId) {
        return model.find({ user: userId });
    }

    async function findCoursesForUser(userId) {
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    }

    async function findUsersForCourse(courseId) {
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    async function enrollUserInCourse(userId, courseId) {
        const existing = await model.findOne({ user: userId, course: courseId });
        if (existing) return existing;
        return model.create({ user: userId, course: courseId });
    }

    async function unenrollUserFromCourse(userId, courseId) {
        return model.deleteOne({ user: userId, course: courseId });
    }

    async function unenrollById(enrollmentId) {
        return model.deleteOne({ _id: enrollmentId });
    }

    return {
        findAllEnrollments,
        findEnrollmentsForUser,
        findCoursesForUser,
        findUsersForCourse,
        enrollUserInCourse,
        unenrollUserFromCourse,
        unenrollById,
    };
}