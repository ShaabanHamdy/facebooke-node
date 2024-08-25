import bcrypt from 'bcryptjs';
import { customAlphabet } from "nanoid";
import sendEmail from "../../utils/send_email.js";
import { tokenGeneration } from '../../utils/tokenGeneration.js';
import userModel from './../../../db/models/users_model.js';












//  =======================================================    signup

export const signup = async (req, res, next) => {

    const checkUser = await userModel.findOne({ email: req.body.email })
    if (checkUser) { return next(new Error("Email Already Exist")) }
    const user = new userModel(req.body)
    const token = tokenGeneration({ payload: { user }, expiredIn: 60 * 5 })
    if (!token) return next(new Error("fail in generate token", { cause: 400 }))
    await user.save()
    if (!user) return next(new Error("fail to create user"))
    res.json({ message: "success", user })
}

//  =======================================================  login

export const login = async (req, res, next) => {
    const checkUser = await userModel.findOne({ email: req.body.email })
    if (!checkUser) { return next(new Error("invalid email information", { cause: 409 })) }
    const matchPassword = bcrypt.compareSync(req.body.password, checkUser.password)
    if (!matchPassword) return next(new Error("invalid password information", { cause: 409 }))
    const token = tokenGeneration({ payload: { id: checkUser._id, role: checkUser.role }, expiresIn: 60 * 30 })
    await userModel.updateOne({ status: "online" })
    res.json({ message: "success", token })
}

//  ======================================================= logout
export const logout = async (req, res, next) => {
    const user = await userModel.updateOne({ status: "offline" })
    res.status(201).json({ message: "success ", user })
}

//  ======================================================= sendCode

export const sendCode = async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) { return next(Error("invalid email information")) }

    const id = customAlphabet("123456789")
    const code = id(4)
    const message = ` Hello ${user.name} your code is ${code}`
    const emailIsSend = sendEmail({ to: req.body.email, message, subject: "Confirmation Email" })
    if (!emailIsSend) { return next(Error("send Email fail")) }
    await userModel.updateOne({ forgetCode: code })
    res.status(201).json({ message: "please check your Gmail to get your Confirmation Code" })

}
//  ======================================================= confirmCodeInfo

let codeContainer;
export const confirmCodeInfo = async (req, res, next) => {

    if (!await userModel.findOne({ forgetCode: req.body.code })) { return next(Error("Invalid code")) }
    codeContainer = req.body.code
    res.status(201).json({ message: "success go to change password page" })


}
// ====================================================================== changePassword
export const changePassword = async (req, res, next) => {

    const checkCodeInfo = await userModel.findOne({ forgetCode: codeContainer })
    if (!checkCodeInfo) { return next(Error("not equal code")) }
    const hashNewPassword = bcrypt.hashSync(req.body.newPassword, +process.env.SALT_ROUNDS)
    await userModel.updateOne({ password: hashNewPassword, forgetCode: 0, changePasswordTime: Date.now() })

    return res.status(200).json({ message: "change password successfully", hashNewPassword })


}


