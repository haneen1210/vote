import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getspecificCandidate:[roles.SuperAdmin,roles.Admin],
    getcandidate:[roles.SuperAdmin,roles.Admin],
    AllVotesParticipateIn:[roles.SuperAdmin,roles.Candidate],
    requestWithdrawal:[roles.SuperAdmin,roles.Candidate],
    
}



