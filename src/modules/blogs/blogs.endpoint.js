import { roles } from "../../middleware/auth.js"

export const endPoint = {
    blogs:[roles.SuperAdmin,roles.Admin],
   
    
}



