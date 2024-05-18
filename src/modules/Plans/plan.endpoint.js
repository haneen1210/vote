import { roles } from "../../middleware/auth.js"

export const endPoint = {
    Plans:[roles.SuperAdmin,roles.Admin],
   
    
}



