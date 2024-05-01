import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getspecificCandidate:[roles.Admin],
    getcandidate:[roles.Admin],
    AllVotesParticipateIn:[roles.Candidate],

    
}



