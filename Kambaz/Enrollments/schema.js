import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        course: { type: String, ref: "CourseModel", required: true },
        user: { type: String, ref: "UserModel", required: true },
        grade: Number,
        letterGrade: String,
        enrollmentDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["ENROLLED", "DROPPED", "COMPLETED"],
            default: "ENROLLED",
        },
    },
    { collection: "enrollments" }
);

export default enrollmentSchema;