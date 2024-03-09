import { Router } from "express";
import * as voteservices from './vote.service.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./vote.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
//import fileUpload, { fileValidation } from "../../utls/multer.js";
import * as validators from './vote.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";



const router = Router();

router.post('/createVote', auth(endPoint.createVote),fileUpload(fileValidation.image).single('image'),validation(validators.createVoteSchema), asynHandler(voteservices.createVote));
router.get('/getvotes', auth(Object.values(roles)), asynHandler(voteservices.getVotes));
router.patch('/updateVotingStatus/:id', auth(endPoint.updateVotingStatus), validation(validators.updateVoteSchema), asynHandler(voteservices.updateVotingStatus));
router.get('/getVoteOpen', auth(Object.values(roles)), asynHandler(voteservices.getVoteOpen));
router.get('/getallvotewithcandidate', auth(Object.values(roles)), asynHandler(voteservices.getallVoteandcatecory));
router.get('/:id', auth(Object.values(roles)), validation(validators.getspecificvote), asynHandler(voteservices.getspecificVote));
router.post('/addcandidatetovote', auth(endPoint.addExistingCandidateToVote), validation(validators.addExistingCandidateToVote), asynHandler(voteservices.addExistingCandidateToVote));
router.post('/uploadExcelCandidateToVote', auth(endPoint.addExistingCandidateToVote), fileUpload(fileValidation.excel).single('file'), asynHandler(voteservices.uploadExcelCandidateToVote));

export default router;

