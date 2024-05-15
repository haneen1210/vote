import { Router } from "express";
import * as candidateservices from './candidate.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./candidate.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './candidate.validation.js';


const router = Router();
router.get('/AllVotesParticipateIn',auth(endPoint.AllVotesParticipateIn),asynHandler(candidateservices.getspecificCandidateinvotes));
router.get('/getCandidatePosts',auth(endPoint.AllVotesParticipateIn),asynHandler(candidateservices.getCandidatePosts));
router.get('/getcandidate', auth(endPoint.getcandidate), asynHandler(candidateservices.getcandidate));
router.post('/requestWithdrawal', auth(endPoint.requestWithdrawal), validation(validators.requestWithdrawal),asynHandler(candidateservices.requestWithdrawal));
router.get('/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidateinvote));
router.get('/CandidateIDvalid/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidate));

export default router;
//auth(Object.values(roles))