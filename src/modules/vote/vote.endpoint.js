
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createVote:[roles.SuperAdmin,roles.Admin],
    updateVotingStatus:[roles.Admin],
    addExistingCandidateToVote:[roles.Admin],
    getspecificCandidate:[roles.SuperAdmin,roles.Admin],
    removeCandidateFromVote:[roles.Admin],
    join:[roles.User],
    updatejoin:[roles.SuperAdmin,roles.Admin],
    User:[roles.User],
    candidate:[roles.SuperAdmin,roles.Candidate],
    SuperAdmin:[roles.SuperAdmin],
    getAdminvote:[roles.SuperAdmin,roles.Admin],
    getUserVotes:[roles.User],
}



