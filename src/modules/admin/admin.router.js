import { Router } from "express";
import * as Adminservices from './admin.services.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./admin.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './admin.validation.js';
const router = Router();

router.get('/getAdmin', auth(endPoint.getAdmin), asynHandler(Adminservices.getAdmin));
router.post('/addadmin', auth(endPoint.addadmin), validation(validators.addAdminSchema), asynHandler(Adminservices.addadmin));
router.patch('/softDelet/:id', auth(endPoint.deleteadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.softDeletAdmin));
router.delete('/hrddDeleted/:id', auth(endPoint.deleteadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.Harddeleteadmin));
router.patch('/restore/:id', auth(endPoint.restore), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.restore));
router.put('/:id', auth(endPoint.updateadmin), validation(validators.UpdateAdminSchema), asynHandler(Adminservices.updateadmin));
router.post('/addCandidate', auth(endPoint.addCandidate), fileUpload(fileValidation.image).single('image'), validation(validators.addCAndidateSchema), asynHandler(Adminservices.addCandidate));


export default router;