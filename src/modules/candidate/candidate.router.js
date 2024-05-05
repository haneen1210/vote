import { Router } from "express";
import * as candidateservices from './candidate.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./candidate.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './candidate.validation.js';


const router = Router();
router.get('/AllVotesParticipateIn',auth(endPoint.AllVotesParticipateIn),asynHandler(candidateservices.getspecificCandidateinvotes));
router.get('/getcandidate', auth(endPoint.getcandidate), asynHandler(candidateservices.getcandidate));
router.get('/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidateinvote));
router.get('/CandidateIDvalid/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidate));
router.post('/requestWithdrawal', auth(endPoint.getcandidate), validation(validators.requestWithdrawal),asynHandler(candidateservices.requestWithdrawal));

export default router;