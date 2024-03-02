import { Router } from "express";
import * as Adminservices from './admin.services.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./admin.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './admin.validation.js';
import * as AuthValidators from '../auth/auth.validation.js';

import * as authservices from '../auth/auth.services.js'
const router = Router();

router.get('/getAdmin', auth(endPoint.getAdmin), asynHandler(Adminservices.getAdmin));
router.post('/addadmin', auth(endPoint.addadmin), validation(AuthValidators.signinSchema), asynHandler(authservices.Signup));
router.patch('/softDelet/:id', auth(endPoint.deleteadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.softDeletAdmin));
router.delete('/hrddDeleted/:id', auth(endPoint.deleteadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.Harddeleteadmin));
router.patch('/restore/:id', auth(endPoint.restore), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.restore));
router.put('/:id', auth(endPoint.updateadmin), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateAdminSchema), asynHandler(Adminservices.updateadmin));
router.post('/addCandidate', auth(endPoint.addCandidate), fileUpload(fileValidation.image).single('image'), validation(AuthValidators.signinSchema), asynHandler(authservices.Signup));


export default router;