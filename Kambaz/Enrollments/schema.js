import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.Mixed },
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
    { collection: "enrollments", _id: false }
);

export default enrollmentSchema;