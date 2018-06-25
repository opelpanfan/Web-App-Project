import EmailCreator from "../models/email-creator/email-creator"
import EmailSender from "../models/emailsender/abstraction"

import { NewUserInterface } from "../models/users/types"
import Users from "../models/users/users"
import * as auth from '../models/user-auth/user-auth'

interface UserRegisterProps {
  emailCreator: EmailCreator
  emailSender: EmailSender
}

import {GoPromise} from '../utils/GoPromise'
export default class UserRegister {
  private props: UserRegisterProps

  constructor(props: UserRegisterProps) {
    this.props = props		
    //Empty function
  }
  async register(user: NewUserInterface) :GoPromise<{user:NewUserInterface,token:string}>{
		var users=new Users();
		
		var [newUser,error] = await users.createUser(user)
		if(error) {return [null,error]} 
      let token = auth.generateJWT(_user)
		return {
			user:newUser,
			token:''
	}
}

// // ----------------------------- ONLY LOCAL USERS -----------------------------

//   // returns user
//   async register(user): Promise<ExistingUserInterface> {
//     var _user = await validate.newUser(user)

//     let { email } = _user

//     _user.password = auth.hashPassword(_user.password)
//     _user.disabled = "EMAIL_NOT_VERIFIED"
//     let token = auth.generateToken()
//     _user = await this.insert(_user)

//     await TokenMySQL.insert({
//       user_id: _user.id,
//       token: token,
//       created: Date.now(),
//     })
//     await this.emailSender.send(this.emailCreator.confirmEmail(_user, token))

//     return _user
//   }

//   // returns user
//   async resendEmail(token) {
//     let [user] = await TokenMySQL.find({ token })
//     if (!user) {
//       let err = new Error("Not Found")
//       //@ts-ignore
//       err.status = 404
//       throw err
//     }
//     await this.emailSender.send(this.emailCreator.confirmEmail(user, token))
//     return user
//   }

// 	// returns user
//   async confirmEmail(token) {
//     let [{ user_id: userId }] = await TokenMySQL.find({ token })
//     if (!userId) {
//       let err = new Error("Not Found")
//       //@ts-ignore
//       err.status = 404
//       throw err
//     }
//     await TokenMySQL.remove(userId)
//     await UserMySQL.update(userId, { disabled: null })
//     let user = await this.find({ id: userId })
//     return user
//   }

// // returns undefined
//   async confirmEmailUpdate(token: string) {
//     let { user_id: userId, pending_email: email } = await TokenMySQL.find({
//       token,
//     })
//     await UserMySQL.update(userId, { email })
//     await TokenMySQL.remove(token)
//   }

//   // returns undefined
//   async forgotPassword(email) {
//     //@ts-ignore
//     let user = await this.find({ email })
//     let token = auth.generateToken()
//     await TokenMySQL.insert({
//       user_id: user.id,
//       token: token,
//       created: Date.now(),
//     })
//     await this.emailSender.send(this.emailCreator.forgotPassword(user, token))
//   }

//   // returns user
//   async resetPassword(token, password) {
//     let { user_id: userId } = await TokenMySQL.find({ token })
//     let user = await this.update(userId, { password })
//     await TokenMySQL.remove(token)
//     return user
//   }

//   //  --------------------------- ONLY EXTERNAL USERS ---------------------------

//   async updateExternal(userId, user): Promise<ExistingUserInterface> {
//     let { email } = user
//     if (email) {
//       await this.uniqueEmail(email)
//     }
//     await UserMySQL.update(userId, user)
//     return await this.find({ id: userId })
//   }

//   async uniqueEmail(email, userId?) {
//     let [user] = await UserMySQL.find({ email })
//     if (user && user.id !== parseInt(userId)) {
//       let err = new Error("Email " + email + " is already in use")
//       //@ts-ignore
//       err.status = 409
//       throw err
//     }
//   }
