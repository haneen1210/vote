
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getAdmin: [roles.Admin],
    getinfAdmin: [roles.SuperAdmin,roles.Admin],
    getspesific: [roles.SuperAdmin,roles.Admin],
    addadmin: [roles.Admin],
    deleteByadmin: [roles.Admin],
    updateadmin: [roles.Admin],
    restore: [roles.Admin],
    addCandidate: [roles.Admin],
    updateCandidate: [roles.Admin],
    manageWithdrawalRequest:[roles.Admin],
    SuperAdmin:[roles.SuperAdmin],
    getUser:[roles.SuperAdmin,roles.Admin],
    getdelet:[roles.Admin],
    getcandidate:[roles.Admin],
    
}



