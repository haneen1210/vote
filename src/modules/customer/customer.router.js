import { Router } from "express";
import * as customerserver from './customer.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./customer.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './customer.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.post('/newcustomer', fileUpload(fileValidation.image).single('image'),auth(endPoint.customer), validation(validators.customer), asynHandler(customerserver.createcustomer));
router.get('/getcustomer', auth(Object.values(roles)), asynHandler(customerserver.getcustomer));
router.get('/:customerID', auth(endPoint.customer), validation(validators.getspecificcustomer), asynHandler(customerserver.getspecificCustomer));
router.patch('/:id', fileUpload(fileValidation.image).single('image'),auth(endPoint.customer), validation(validators.updatecustomerSchema), asynHandler(customerserver.updatecustomer));
router.delete('/:customerID', auth(endPoint.customer), validation(validators.getspecificcustomer), asynHandler(customerserver.deletecustomer));
export default router;

