import { Router } from "express";
import { asyncHandling } from './../../utils/error_handling.js';
import * as user_controller from "./user_controller.js";
import { changePasswordSchemaValidator, codeSchemaValidator, senCodeSchemaValidator, signupMiddleware } from "./user_validation.js";

const router = Router()


//=================================================signup===============    
router.post("/signup", signupMiddleware, asyncHandling(user_controller.signup))

//=================================================login===============    
router.post("/login", asyncHandling(user_controller.login))

//=================================================logout===============    
router.get("/logout", asyncHandling(user_controller.logout))

//================================================= sendCode ===============    
router.post("/sendCode", senCodeSchemaValidator, asyncHandling(user_controller.sendCode))

//================================================= confirmCodeInfo ===============    
router.post("/confirmCodeInfo", codeSchemaValidator, asyncHandling(user_controller.confirmCodeInfo))
//================================================= changePassword ===============    
router.post("/changePassword", changePasswordSchemaValidator, asyncHandling(user_controller.changePassword))


export default router