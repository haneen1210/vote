import { Router } from "express";
import * as communicationserver from './communication.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./communication.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './communication.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.post('/newcommunication',auth(endPoint.communication),fileUpload(fileValidation.image).single('image'), validation(validators.communication), asynHandler(communicationserver.createcommunicatione));
router.get('/getcommunication', auth(Object.values(roles)), asynHandler(communicationserver.getcommunication));
router.get('/:communicationID', auth(endPoint.communication), validation(validators.getspecificcommunication), asynHandler(communicationserver.getspecificcommunication));
router.patch('/:id', auth(endPoint.communication), validation(validators.updatecommunicationSchema), asynHandler(communicationserver.updatecommunication));
router.delete('/:communicationID', auth(endPoint.communication), validation(validators.getspecificcommunication), asynHandler(communicationserver.deletecommunication));
export default router;

