
import { Router } from 'express';
import { asyncHandling } from './../../utils/error_handling.js';
import * as post_controllers from "./post_controller.js"
import { myMulter } from '../../utils/multer.js';
import auth from '../../middleware/auth.js';
const router = Router()



router.post("/createPost",auth(),myMulter()
.fields([{ name: "postImage", maxCount: 1 }]),
asyncHandling(post_controllers.createPost))

router.get("/getAllPosts",auth(),asyncHandling(post_controllers.getAllPosts))


router.delete("/deletePost",auth(),
asyncHandling(post_controllers.deletePost))




export default router

