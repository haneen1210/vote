
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getAdmin: [roles.SuperAdmin,roles.Admin],
    addadmin: [roles.SuperAdmin,roles.Admin],
    deleteByadmin: [roles.SuperAdmin,roles.Admin],
    updateadmin: [roles.SuperAdmin,roles.Admin],
    restore: [roles.SuperAdmin,roles.Admin],
    addCandidate: [roles.SuperAdmin,roles.Admin],
    updateCandidate: [roles.SuperAdmin,roles.Admin],
    manageWithdrawalRequest:[roles.SuperAdmin,roles.Admin],
    SuperAdmin:[roles.SuperAdmin],
    getUser:[roles.SuperAdmin,roles.Admin],
    getdelet:[roles.SuperAdmin,roles.Admin],
}



