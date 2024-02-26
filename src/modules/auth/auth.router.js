import { Router } from "express";
import * as authservices from './auth.services.js';
import { asynHandler } from "../../utls/errorHanding.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";

import * as validators from './auth.validation.js';
import { validation } from "../../middleware/validation.js";

const router = Router();

router.post('/signup', fileUpload(fileValidation.image).single('image'),validation(validators.signupSchema), asynHandler(authservices.Signup));
router.post('/singin',validation(validators.signinSchema),asynHandler(authservices.singIn));
router.get('/confimEmail/:token',asynHandler(authservices.confimEmail));
router.patch('/sendCode',validation(validators.sendcodeSchema),asynHandler(authservices.sendCode))
router.patch('/forgotPassword',validation(validators.forgotPasswordSchema),asynHandler(authservices.forgotPassword))




export default router;