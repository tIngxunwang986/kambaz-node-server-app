import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao() {
    async function findEnrollmentsForUser(userId) {
        return model.find({ user: userId });
    }

    async function findCoursesForUser(userId) {
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments
            .filter((e) => e.course)
            .map((e) => e.course);
    }

    async function findUsersForCourse(courseId) {
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments
            .filter((e) => e.user)
            .map((e) => e.user);
    }

    async function enrollUserInCourse(userId, courseId) {
        const existing = await model.findOne({ user: userId, course: courseId });
        if (existing) {
            return existing;
        }
        return model.create({
            _id: uuidv4(),
            user: userId,
            course: courseId,
        });
    }

    async function unenrollUserFromCourse(user, course) {
        return model.deleteOne({ user, course });
    }

    async function unenrollById(enrollmentId) {
        const result = await model.findOneAndDelete({ _id: enrollmentId });
        return result;
    }

    async function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({ course: courseId });
    }

    return {
        findEnrollmentsForUser,
        findCoursesForUser,
        findUsersForCourse,
        enrollUserInCourse,
        unenrollUserFromCourse,
        unenrollById,
        unenrollAllUsersFromCourse,
    };
}