import { roles } from "../../middleware/auth.js"

export const endPoint = {
    communication:[roles.SuperAdmin,roles.Admin],
  
    
}



