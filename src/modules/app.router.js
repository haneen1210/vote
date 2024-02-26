import connectDB from '../../DB/connection.js';
import authRouter from './auth/auth.router.js'
//import { sendEmail } from '../services/email.js';
import Adminrouter from './admin/admin.router.js';
import { globalErrorHandler } from '../utls/errorHanding.js';

const initApp = async (app, express) => {
    app.use(express.json());
    connectDB();
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "welcom" });
    })
    //app.use('/auth',authRouter);
    app.use('/Admin',Adminrouter);
    app.use('/auth',authRouter);
    app.get("*", (req, res) => {
        return res.status(500).json({ message: "page not found" });
    })
    app.use(globalErrorHandler)
}

export default initApp;