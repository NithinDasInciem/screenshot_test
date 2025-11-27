import mongoose from "mongoose";
import { documentSchema } from "../schemas/documentSchema.js";

const DocumentModel = mongoose.model("Document", documentSchema);
export default DocumentModel;
