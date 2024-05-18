import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createPost:[roles.SuperAdmin,roles.Admin,roles.Candidate]

}



