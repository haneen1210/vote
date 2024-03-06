
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createVote:[roles.Admin],
    updateVotingStatus:[roles.Admin],
    addExistingCandidateToVote:[roles.Admin],
    getspecificCandidate:[roles.Admin],
}



