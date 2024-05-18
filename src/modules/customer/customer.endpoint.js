import { roles } from "../../middleware/auth.js"

export const endPoint = {
    customer:[roles.SuperAdmin,roles.Admin],
  
    
}



