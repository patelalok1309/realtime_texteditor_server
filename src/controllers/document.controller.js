import { Document } from "../models/document.model.js";

export const createDocument = async (req, res) => {
    try {
        const { title } = req.body;

        if (
            !title ||
            title.trim() === "" ||
            title === undefined ||
            title === null
        ) {
            return res.status(400).json({ message: "Title is required" });
        }

        const document = await Document.create({
            title,
        });

        return res.status(200).json({ document });
    } catch (error) {
        console.log("[ERROR_CREATING_DOCUMENT]", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });

        return res.status(200).json({ documents });
    } catch (error) {
        console.log("[ERROR_FETCHING_DOCUMENTS]", error);
    }
};

export const deleteDocument = async (req, res) => {
    try {
        console.log(req.body);
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" });
        }

        const deletedDocument = await Document.findByIdAndDelete(documentId);

        if (!deletedDocument) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res
            .status(200)
            .json({ message: "Document deleted successfully" });
    } catch (error) {
        console.log("[ERROR_DELETING_DOCUMENT]", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const renameDocument = async (req, res) => {
    try {
        const { documentId , title } = req.body;

        if (!documentId || !title) {
            return res.status(400).json({ message: "Document ID and title are required" });
        }

        const document = await Document.findById(documentId);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        document.title = req.body.title;
        await document.save();

        return res
            .status(200)
            .json({ message: "Document renamed successfully" });
    } catch (error) {
        console.log("[ERROR_RENAMING_DOCUMENT]", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getDocumentById = async (req, res) => {
    try {
        console.log("[GET_DOCUMENT_BY_ID]", req.query);
        const { documentId } = req.query;

        if(!documentId) {
            return res.status(400).json({ message: "Document ID is required" });
        }

        const document = await Document.findById(documentId);

        if(!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({ document });

    } catch (error) {
        console.log("[ERROR_FETCHING_DOCUMENT]", error);
        return res.status(500).json({ message : "Something went wrong" });
    }
}