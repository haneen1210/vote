import { Router } from "express";
import * as definitionserver from './defintion.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./definition.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './defintion.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.post('/newdefinition', auth(endPoint.definition), validation(validators.definition), asynHandler(definitionserver.newdefinition));
router.get('/getdefinition', auth(Object.values(roles)), asynHandler(definitionserver.getdefinition));
router.get('/:definitionID', auth(endPoint.definition), validation(validators.getspecificdefinition), asynHandler(definitionserver.getspecificdefinition));
router.patch('/:id', auth(endPoint.definition), validation(validators.updatedefinitionSchema), asynHandler(definitionserver.updatedefinition));
router.delete('/:definitionID', auth(endPoint.definition), validation(validators.getspecificdefinition), asynHandler(definitionserver.deletedefinition));
export default router;

