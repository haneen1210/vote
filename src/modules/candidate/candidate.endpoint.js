import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getspecificCandidate:[roles.SuperAdmin,roles.Admin],
    getcandidate:[roles.SuperAdmin,roles.Admin,roles.User],
    AllVotesParticipateIn:[roles.SuperAdmin,roles.Candidate],
    requestWithdrawal:[roles.SuperAdmin,roles.Candidate],
    
}



