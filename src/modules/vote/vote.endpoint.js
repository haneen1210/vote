
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createVote:[roles.SuperAdmin,roles.Admin],
    updateVotingStatus:[roles.SuperAdmin,roles.Admin],
    addExistingCandidateToVote:[roles.SuperAdmin,roles.Admin],
    getspecificCandidate:[roles.SuperAdmin,roles.Admin],
    removeCandidateFromVote:[roles.SuperAdmin,roles.Admin],
    join:[roles.SuperAdmin,roles.User],
    updatejoin:[roles.SuperAdmin,roles.Admin],
    User:[roles.SuperAdmin,roles.User],
    candidate:[roles.SuperAdmin,roles.Candidate],
    SuperAdmin:[roles.SuperAdmin,roles.SuperAdmin],
    getAdminvote:[roles.SuperAdmin,roles.Admin],
    getUserVotes:[roles.Admin,roles.SuperAdmin,roles.User],
}



