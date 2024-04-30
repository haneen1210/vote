import { Router } from "express";
import * as candidateservices from './candidate.server.js';
import { auth, roles } from "../../middleware/auth.js";
import { endPoint } from "./candidate.endpoint.js";
import { asynHandler } from "../../utls/errorHanding.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './candidate.validation.js';
import fileUpload, { fileValidation } from "../../utls/multer.js";

const router = Router();
router.get('/getcandidate', auth(endPoint.getcandidate), asynHandler(candidateservices.getcandidate));
router.get('/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidateinvote));
router.get('/CandidateIDvalid/:CandidateID', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidate));
router.get('/:CandidateID/AllVotesParticipateIn', auth(endPoint.getspecificCandidate), validation(validators.getspecificCandidate), asynHandler(candidateservices.getspecificCandidateinvotes));
export default router;