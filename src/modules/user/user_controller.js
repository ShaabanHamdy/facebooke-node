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
    await user.save()
    if (!user) return next(new Error("fail to create user"))
    const token = tokenGeneration({ payload: { user } })
    if (!token) return next(new Error("fail to generate token", { cause: 400 }))
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

// ====================================================================== changePassword
export const settingsProfile = async (req, res, next) => {

    const settingsProfile =
        await userModel.findOneAndUpdate(
            { _id: req.user.id },
            {
                name: req.body.name,
                birthOfDate: req.body.birthOfDate,
                profileImage: req.files?.profileImage?.map((e) => "https://shaaban-facebook-node.up.railway.app/" + e.path),
            }, { new: true })
    if (!settingsProfile) {

        return next(Error("failed"))

    }
    return res.status(200).json({ message: "Done", settingsProfile })
}

// ====================================================================== changePassword
export const getUserInfo = async (req, res, next) => {

    const user = await userModel.findOne({_id:req.user.id})
    
    return res.status(200).json({ message: "Done", user })
}


