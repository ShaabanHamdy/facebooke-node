
import { Router } from 'express';
import { asyncHandling } from './../../utils/error_handling.js';
import * as post_controllers from "./post_controller.js"
import { myMulter } from '../../utils/multer.js';
import auth from '../../middleware/auth.js';
const router = Router()



// router.post("/createProduct", myMulter()
//     .fields([{ name: "mainImage", maxCount: 1 }, { name: "subImages", maxCount: 5 }]),
//     asyncHandling(productConnection.createProduct))


router.post("/createPost",auth(),myMulter()
.fields([{ name: "postImage", maxCount: 1 }]),
asyncHandling(post_controllers.createPost))




export default router

