import { Router } from "express";
import * as blogserver from './blogs.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./blogs.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './blogs.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.post('/newblog', fileUpload(fileValidation.image).single('image'),auth(endPoint.blogs), validation(validators.blogs), asynHandler(blogserver.createblog));
router.get('/getblogs', auth(Object.values(roles)), asynHandler(blogserver.getblog));
router.get('/:blogID', auth(endPoint.blogs), validation(validators.getspecificblogs), asynHandler(blogserver.getspecificblog));
router.patch('/:id', fileUpload(fileValidation.image).single('image'),auth(endPoint.blogs), validation(validators.updateblogsSchema), asynHandler(blogserver.updateblog));
router.delete('/:blogID', auth(endPoint.blogs), validation(validators.getspecificblogs), asynHandler(blogserver.deleteblog));
export default router;

