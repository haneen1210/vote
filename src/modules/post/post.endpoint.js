import { roles } from "../../middleware/auth.js"

export const endPoint = {
    createPost:[roles.Admin,roles.Candidate]

}



