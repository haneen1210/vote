
import { roles } from "../../middleware/auth.js"

export const endPoint = {
    getAdmin: [roles.Admin],
    getcandidate:[roles.Admin],
    addadmin: [roles.Admin],
    deleteadmin: [roles.Admin],
    updateadmin: [roles.Admin],
    restore: [roles.Admin],
    addCandidate: [roles.Admin],
}



