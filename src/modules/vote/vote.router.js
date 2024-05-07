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
router.get('/Result', auth(Object.values(roles)), asynHandler(voteservices.countVotesForCandidates ));
router.get('/getVoteOpen', auth(Object.values(roles)), asynHandler(voteservices.getVoteOpen));
router.get('/getpreviousvotes', auth(Object.values(roles)), asynHandler(voteservices.getpreviousvotes));
router.get('/getallvotewithcandidate', auth(Object.values(roles)), asynHandler(voteservices.getallVoteandcatecory));
router.get('/findUserVotes/:userId', auth(endPoint.User), validation(validators.findUserVotes ), asynHandler(voteservices.findUserVotes));
router.get('/user-votes',auth(endPoint.join), asynHandler(voteservices.getUserVotes));
router.get('/candidate-votes',auth(endPoint.candidate), asynHandler(voteservices.getCandidateVotes));
router.get('/:id', auth(Object.values(roles)), validation(validators.getspecificvote), asynHandler(voteservices.getspecificVote));
router.post('/addcandidatetovote', auth(endPoint.addExistingCandidateToVote), validation(validators.addAndRemoveCandidateToVote), asynHandler(voteservices.addExistingCandidateToVote));
router.post('/uploadExcelCandidateToVote', auth(endPoint.addExistingCandidateToVote), fileUpload(fileValidation.excel).single('file'), asynHandler(voteservices.uploadExcelCandidateToVote));
router.patch('/removeCandidateFromVote',auth(endPoint.removeCandidateFromVote),validation(validators.addAndRemoveCandidateToVote), asynHandler(voteservices.removeCandidateFromVote));
router.patch('/:idvote/:idcandidate/join',auth(endPoint.join),validation(validators.join),asynHandler(voteservices.join1));
export default router;

