import { Router } from "express";
import * as contectserver from './contect.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./contect.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './contect.validation.js';


const router = Router();
router.post('/newcontect',auth(Object.values(roles)), validation(validators.contect), asynHandler(contectserver.createcontect));
router.get('/getcontect', auth(Object.values(roles)), asynHandler(contectserver.getcontect));
router.get('/:contectID', auth(endPoint.contect), validation(validators.getspecificcontect), asynHandler(contectserver.getspecificcontect));
router.patch('/:id', auth(endPoint.contect), validation(validators.updatecontectSchema), asynHandler(contectserver.updatecontect));
router.delete('/:contectID', auth(endPoint.contect), validation(validators.getspecificcontect), asynHandler(contectserver.deletecontect));
export default router;

