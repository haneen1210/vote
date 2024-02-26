import { Router } from "express";
import * as Adminservices from './admin.services.js';
const router = Router();

router.get('/',Adminservices.getAdmin);
router.post('/',Adminservices.addadmin);
router.delete('/',Adminservices.deleteadmin);
router.patch('/',Adminservices.updateadmin);



export default router;