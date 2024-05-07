
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createVote:[roles.Admin],
    updateVotingStatus:[roles.Admin],
    addExistingCandidateToVote:[roles.Admin],
    getspecificCandidate:[roles.Admin],
    removeCandidateFromVote:[roles.Admin],
    join:[roles.User],
    updatejoin:[roles.Admin],
    User:[roles.User],
    candidate:[roles.Candidate],
}



