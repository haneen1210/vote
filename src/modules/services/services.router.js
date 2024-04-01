import { Router } from "express";
import * as servicesserver from './services.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./services.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './services.validation.js';


const router = Router();
router.post('/newServices', auth(endPoint.Services), validation(validators.Services), asynHandler(servicesserver.newServices));
router.get('/getServices', auth(Object.values(roles)), asynHandler(servicesserver.getServices));
router.get('/:ServiceID', auth(endPoint.Services), validation(validators.getspecificService), asynHandler(servicesserver.getspecificService));
router.patch('/:id', auth(endPoint.Services), validation(validators.updateServiceSchema), asynHandler(servicesserver.updateservice));
router.delete('/:ServiceID', auth(endPoint.Services), validation(validators.getspecificService), asynHandler(servicesserver.deleteservice));
export default router;