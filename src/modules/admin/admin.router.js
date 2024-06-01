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
router.get('/role',  auth(Object.values(roles)), asynHandler(Adminservices.Role));
router.get('/getAdmin', auth(endPoint.getinfAdmin), asynHandler(Adminservices.getAdmin));
router.get('/getinformation', auth(Object.values(roles)), asynHandler(Adminservices.getinformation));
router.get('/getdeletAdmin', auth((endPoint.SuperAdmin)), asynHandler(Adminservices.getdeleteAdmin));
router.get('/getdeletuser', auth((endPoint.getdelet)), asynHandler(Adminservices.getdeleteuser));
router.get('/getdeletcandidate', auth((endPoint.getdelet)), asynHandler(Adminservices.getdeleteCandidate));
router.get('/getCandidateByAdmin', auth((endPoint.getcandidate)), asynHandler(Adminservices.getCandidateByAdmin));
router.get('/getUsersActive', auth(endPoint.getUser), asynHandler(Adminservices.getUserActive));
router.get('/getallUsers', auth(endPoint.getUser), asynHandler(Adminservices.getallUser));
router.put('/updateProfile', auth(Object.values(roles)), fileUpload(fileValidation.image).single('image'),validation(validators.updateProfileSchema), asynHandler(Adminservices.updateProfile));
router.post('/addadmin', auth(endPoint.SuperAdmin), fileUpload(fileValidation.image).single('image'), validation(AuthValidators.signupSchema), asynHandler(authservices.Signup));
router.post('/addCandidate', auth(endPoint.addCandidate), fileUpload(fileValidation.image).single('image'), validation(validators.signupSchemacandidate), asynHandler(Adminservices.Signup));
router.post('/addCandidateExcel', auth(endPoint.addCandidate), fileUpload(fileValidation.excel).single('file'), asynHandler(Adminservices.addCandidateExcel));
router.get('/withdrawal', auth(endPoint.getAdmin), asynHandler(Adminservices.withdrawals));
router.patch('/updatPassword', auth(Object.values(roles)),validation(validators.updatPassword), asynHandler(Adminservices.updatPassword));
router.patch('/UpdateStatuseUser/:idUser', auth(endPoint.updateadmin),validation(validators.UpdateStatuseUser), asynHandler(Adminservices.UpdateStatuseUser));
router.get('/getAdmin/:AdminID', auth(endPoint.getspesific), asynHandler(Adminservices.getspesificAdmin));
router.get('/getUser/:UserID', auth(endPoint.getspesific), asynHandler(Adminservices.getspesificUser));
router.patch('/softDeleteAdmin/:id', auth(endPoint.SuperAdmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.softDeletSuperAdmin));
router.delete('/hrddDeletedAdmin/:id', auth(endPoint.SuperAdmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.HarddeleteSuperAdmin));
router.patch('/restoreAdmin/:id', auth(endPoint.SuperAdmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.restoreSuperAdmin));
router.patch('/softDelet/:id', auth(endPoint.deleteByadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.softDeleteAdmin));
router.delete('/hrddDeleted/:id', auth(endPoint.deleteByadmin), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.Harddeleteadmin));
router.patch('/restore/:id', auth(endPoint.restore), validation(validators.DeletAdminAndRestore), asynHandler(Adminservices.restore));
router.put('/updateSuperAdmin/:id', auth(endPoint.SuperAdmin), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateSchema), asynHandler(Adminservices.updateSuperAdmin));
router.put('/:id', auth(endPoint.updateadmin), fileUpload(fileValidation.image).single('image'),validation(validators.UpdateSchema), asynHandler(Adminservices.updateadmin));
router.put('/updateCandidate/:id', auth(endPoint.updateCandidate), fileUpload(fileValidation.image).single('image'),validation(validators.updatecandidate), asynHandler(Adminservices.updateCandidateByadmin));
router.patch('/withdrawal-request/:requestId',  auth(endPoint.manageWithdrawalRequest),validation(validators.manageWithdrawalRequest), asynHandler(Adminservices.manageWithdrawalRequest));

export default router;
