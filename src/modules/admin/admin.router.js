import { Router } from "express";
import * as Adminservices from './admin.services.js';
import { auth ,roles} from "../../middleware/auth.js";
import { endPoint } from "./admin.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation, validation1} from "../../middleware/validation.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './admin.validation.js';
import * as AuthValidators from '../auth/auth.validation.js';

import * as authservices from '../auth/auth.services.js'
const router = Router();

router.put('/updateProfile', auth(Object.values(roles)), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateSchema), asynHandler(Adminservices.updateProfile));
router.get('/getAdmin', auth(endPoint.getAdmin), asynHandler(Adminservices.getAdmin));
router.get('/getUsers', auth(endPoint.getAdmin), asynHandler(Adminservices.getUser));
router.patch('/UpdateStatuseUser/:idUser', auth(endPoint.updateadmin),validation(validators.UpdateStatuseUser), asynHandler(Adminservices.UpdateStatuseUser));
router.get('/getAdmin/:AdminID', auth(endPoint.getAdmin), asynHandler(Adminservices.getspesificAdmin));
router.get('/getUser/:UserID', auth(endPoint.getAdmin), asynHandler(Adminservices.getspesificUser));
router.post('/addadmin', auth(endPoint.addadmin), validation(AuthValidators.signupSchema), asynHandler(authservices.Signup));
router.patch('/softDelet/:id', auth(endPoint.deleteByadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.softDeletAdmin));
router.delete('/hrddDeleted/:id', auth(endPoint.deleteByadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.Harddeleteadmin));
router.patch('/restore/:id', auth(endPoint.restore), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.restore));
router.put('/:id', auth(endPoint.updateadmin), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateSchema), asynHandler(Adminservices.updateadmin));
router.put('/updateCandidate/:id', auth(endPoint.updateCandidate), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateSchema), asynHandler(Adminservices.updateadmin));
router.post('/addCandidate', auth(endPoint.addCandidate), fileUpload(fileValidation.image).single('image'), validation(AuthValidators.signupSchema), asynHandler(authservices.Signup));
router.post('/addCandidateExcel', auth(endPoint.addCandidate), fileUpload(fileValidation.excel).single('file'), 
asynHandler(Adminservices.addCandidateExcel));
router.get('/withdrawal', auth(endPoint.getAdmin), asynHandler(Adminservices.withdrawals));
router.patch('/updatPassword', auth(Object.values(roles)),validation(validators.updatPassword), asynHandler(Adminservices.updatPassword));
router.patch('/withdrawal-request/:requestId',  auth(endPoint.manageWithdrawalRequest),validation(validators.manageWithdrawalRequest), asynHandler(Adminservices.manageWithdrawalRequest));
export default router;

