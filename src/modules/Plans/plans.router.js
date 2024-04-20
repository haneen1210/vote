import { Router } from "express";
import * as Plansserver from './plans.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./plan.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './plans.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.post('/newplans', auth(endPoint.Plans), validation(validators.plans), asynHandler(Plansserver.newPlans));
router.patch('/:id/item', auth(endPoint.Plans),asynHandler(Plansserver.additem));
router.get('/getplans', auth(Object.values(roles)), asynHandler(Plansserver.getSplans));
router.get('/:PlansID', auth(endPoint.Plans), validation(validators.getspecificplans), asynHandler(Plansserver.getspecificplan));
router.patch('/:id', auth(endPoint.Plans), validation(validators.updateplansSchema), asynHandler(Plansserver.updateplan));
router.delete('/:PlansID', auth(endPoint.Plans), validation(validators.getspecificplans), asynHandler(Plansserver.deleteplan));
export default router;