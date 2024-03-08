import connectDB from '../../DB/connection.js';
import authRouter from './auth/auth.router.js'
import Adminrouter from './admin/admin.router.js';
import voteRouter from './vote/vote.router.js';
import candidateRouter from './candidate/candidate.router.js';
import cors from 'cors';
import { globalErrorHandler } from '../utls/errorHanding.js';
const initApp = async (app, express) => {
    /*
app.use(async(req,res,next)=>{
    let whitelist=['http://www.haneen.com'];
    if(!whitelist.includes(req.header('origin'))){
        return next (new Error(`invalid`,{cause:403}));
    }
    else{
        next();
    }
})
*/

    app.use(cors());
    app.use(express.json());
    connectDB();
    app.get('/', (req, res) => {
        return res.status(200).json({ message: "welcom" });
    })
    app.use('/Admin', Adminrouter);
    app.use('/auth', authRouter);
    app.use('/vote', voteRouter);
    app.use('/candidate', candidateRouter);

    app.get("*", (req, res) => {
        return res.status(500).json({ message: "page not found" });
    })
    app.use(globalErrorHandler)
}

export default initApp;