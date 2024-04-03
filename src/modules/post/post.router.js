import { Router } from "express";
import * as postControler from './service/post.service.js';
import * as commentontroler from './service/comment.service.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./post.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './post.validation.js';




const router = Router();


router.post('/',auth(endPoint.createPost),fileUpload(fileValidation.image).single('image'),validation(validators.createPost),asynHandler(postControler.create));
router.patch('/:id/like', auth(Object.values(roles)),asynHandler(postControler.likePost));
router.patch('/:id/unlike', auth(Object.values(roles)),asynHandler(postControler.unlikePost));
router.post('/:id/comment', auth(Object.values(roles)),fileUpload(fileValidation.image).single('image'),validation(validators.createcommant),asynHandler(commentontroler.createComment));
router.post('/getPost/:id', auth(Object.values(roles)),asynHandler(postControler.getPost));

export default router;