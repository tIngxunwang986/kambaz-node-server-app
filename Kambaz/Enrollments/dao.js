import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
    function findAllEnrollments() {
        return db.enrollments;
    }

    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;

        const already = enrollments.some(
            (e) => e.user === userId && e.course === courseId
        );
        if (already) {
            return null;
        }

        const newEnrollment = {
            _id: uuidv4(),
            user: userId,
            course: courseId,
        };
        db.enrollments = [...enrollments, newEnrollment];
        return newEnrollment;
    }

    function unenroll(enrollmentId) {
        const { enrollments } = db;
        db.enrollments = enrollments.filter((e) => e._id !== enrollmentId);
    }

    return {
        findAllEnrollments,
        enrollUserInCourse,
        unenroll,
    };
}