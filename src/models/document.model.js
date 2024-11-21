import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        content: {
            type: Array,
            default: [],
        },
        lastCheckpoint: {
            type: String,
            default: "",
        },
        owner : {
            type : mongoose.Types.ObjectId,
            required : false,
        }
    },
    { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
    