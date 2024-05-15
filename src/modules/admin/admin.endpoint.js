
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getAdmin: [roles.Admin],
    addadmin: [roles.Admin],
    deleteByadmin: [roles.Admin],
    updateadmin: [roles.Admin],
    restore: [roles.Admin],
    addCandidate: [roles.Admin],
    updateCandidate: [roles.Admin],
    manageWithdrawalRequest:[roles.Admin],
    SuperAdmin:[roles.SuperAdmin],
}



