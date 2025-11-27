import mongoose from 'mongoose';
import { documentTypeSchema } from '../schemas/documentTypeSchema.js';
const DocumentTypeModel = mongoose.model("DocumentTypes", documentTypeSchema);
export default DocumentTypeModel;