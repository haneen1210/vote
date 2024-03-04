import { Router } from "express";
import * as voteservices from './vote.service.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./vote.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
//import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './vote.validation.js';
 



const router = Router();

router.post('/createVote', auth(endPoint.createVote), validation(validators.createVoteSchema),asynHandler(voteservices.createVote));
router.get('/getvote', auth(Object.values(roles)), asynHandler(voteservices.getVote));
router.patch('/updateVotingStatus/:id', auth(endPoint.updateVotingStatus),validation(validators.updateVoteSchema) ,asynHandler(voteservices.updateVotingStatus));
router.get('/getVoteOpen', auth(Object.values(roles)), asynHandler(voteservices.getVoteOpen));

export default router;

