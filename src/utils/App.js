// ===================== imports ============================================================================
import Connection_db from '../../db/Connection_db.js';
import globalErrorHandling from './error_handling.js';
import * as appRoutes from "../modules/app_routes.js"
import cors  from 'cors';

const App = (express) => {
    const app = express()
    app.use(cors())
    // =================================================================================================
    app.use(express.json({}))
    const port = process.env.PORT || 5000
    Connection_db()
    // =========================================== Routes ===============================================
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/user', appRoutes.userRouter)
    app.use('/post', appRoutes.postRouter)
    // =========================================== global error handling  ===============================================
    app.use(globalErrorHandling)
    // =========================================== app listen ===============================================
    app.listen(port,()=> console.log(`Example app listening on port ${port}!`))
}


export default App