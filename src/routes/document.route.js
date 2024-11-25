import { Router } from "express";
import {
    createDocument,
    getDocuments,
    deleteDocument,
    renameDocument,
    getDocumentById,
} from "../controllers/document.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.route("/create").post(createDocument);
router.route("/getAll").get(getDocuments);
router.route("/rename").patch(renameDocument);
router.route("/delete").delete(deleteDocument);
router.route("/get-document").get(getDocumentById);

export default router;
