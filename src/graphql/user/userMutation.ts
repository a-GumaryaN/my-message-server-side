import { GraphQLObjectType, GraphQLString } from "graphql";
import { user, userLogin, inputUser } from "./userSchema";
import { sign } from "jsonwebtoken";
import removeTags from "../../modules/XSS";
import hashMaker from "../../modules/modules";
import { userModel } from "../../db/models";
import { secret } from "../../modules/modules";
import create_file from "../../modules/create_file";
import { userInfo } from "../..";
import code_generator from "../../modules/code_generator";
import send_email from "../../modules/send_email/send_email";
import { verifyCode } from "../../db/models";
import { result } from "../dependencies";
import {
  checkVerifyCodeSchema,
  resetPasswordSchema,
  RegisterSchema,
  VerifyCodeSchema,
  updateUserSchema
} from "../../schemas/joi.schemas";


export const userMutation = {
  //resolver for send verify code to new user email 
  setVerifyCode: {
    type: result,
    args: {
      email: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {

      //sanitize the input data :

      const _id = removeTags(args.email);

      //validate input data content :

      const validate = VerifyCodeSchema.validate({ email: _id });

      if (validate.error) return { error: validate.error.details[0].message }

      //check data base for found an user with input username
      try {

        const checkNotExist = await userModel.findOne({ _id });
        //if user founded server will rejected an error => user register before
        if (checkNotExist) throw "you are register later";

      } catch (error) {
        return { error };
      }

      //generate a 6 character random code :
      const code = code_generator(6);

      //set a verify code in database:
      try {

        //check verifyCode collection for find a user with _id:_id

        const checkCodeForUserExist = await verifyCode.findOne({ _id });

        //if for user send an email last :
        if (checkCodeForUserExist) {
          //set a new validate code with new expire date in database :
          await verifyCode.deleteOne({ _id });
          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
        } else {
          //set a new verify code only
          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
        }

      } catch (error) {
        return { error };
      }

      //...send email part

      // send_email({
      //   getter: _id,
      //   title: "verify code",
      //   code
      // });

      return { error: null, result: 'code sended' }

    },
  },

  //resolver for send verify code to old user email that forgot password
  setForgotEmailCode: {
    type: result,
    args: {
      email: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {

      //sanitize the input data

      const _id = removeTags(args.email);

      //validate input data content :

      const validate = VerifyCodeSchema.validate({ email: _id });

      if (validate.error) return { error: validate.error.message }

      //check data base for found an user with input username
      try {

        const checkNotExist = await userModel.findOne({ _id });
        //if user founded server will rejected an error => user register before
        if (!checkNotExist) throw "you not register";

      } catch (error) {
        return { error };
      }

      //generate a 6 character random code :
      const code = code_generator(6);

      //set a verify code in database:
      try {

        const checkCodeForUserExist = await verifyCode.findOne({ _id });

        if (checkCodeForUserExist) {
          await verifyCode.deleteOne({ _id });
          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
        } else {
          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
        }

      } catch (error) {
        return { error };
      }

      //...send email part

      // send_email({
      //   getter: _id,
      //   title: "verify code",
      //   code
      // });

      return { error: null, result: 'code sended' }

    },
  },

  //resolver for checking user verify code that emailed
  checkVerifyCode: {
    type: result,
    args: {
      email: { type: GraphQLString },
      code: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {

      //sanitize the input data
      const _id = removeTags(args.email),
        code = removeTags(args.code);

      //validate input data content :

      const validate = checkVerifyCodeSchema.validate({ email: _id, code });

      if (validate.error) return { error: validate.error.details[0].message }


      //find code in data base with _id=_id
      try {

        const checkExist = await verifyCode.findOne({ _id });

        //if user not founded server will rejected an error => user not set any code
        if (!checkExist) throw "you not set any code";


        //if code not equal with user code server => code not valid
        if (code !== checkExist.code) throw 'your code not valid';

        return { result: 'code valid' }

      } catch (error) {
        return { error };
      }
    }
  },

  //resolver for reset password
  resetPassword: {
    type: result,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      code: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {

      //sanitize the input data
      const _id = removeTags(args.email),
        code = removeTags(args.code),
        password = hashMaker(removeTags(args.password), 'md5', 'utf-8', 'hex');

      //validate input data content :
      const validate = resetPasswordSchema.validate({ email: _id, code, password });

      if (validate.error) return { error: validate.error.details[0].message }



      try {

        const checkCode = await verifyCode.findOne({ _id });

        if (!checkCode) return { error: 'code not set' }

        if (checkCode.code !== code) return { error: "code not valid" }


        const passwordUpdateResult = await userModel.updateOne({ _id }, { password });

        if (passwordUpdateResult.ok) return { error: null, result: 'password updated...' }

        return { error: "error in update data , try again" }

      } catch (error) {
        return { error };
      }
    }
  },

  //resolver for register
  Register: {
    type: userLogin,
    args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
      code: { type: GraphQLString },
      fullName: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {

      //sanitize input data's :
      const _id = removeTags(args.email),
        password = hashMaker(removeTags(args.password), 'md5', 'utf-8', 'hex'),
        code = removeTags(args.code),
        fullName = removeTags(args.fullName);

      //validate input data content :
      const validate: any = RegisterSchema.validate({ email: _id, code, password, fullName });


      if (validate.error) return { error: validate.error.details[0].message }


      try {

        const checkExist = await verifyCode.findOne({ _id });
        //if user founded server will rejected an error...
        if (!checkExist) throw "code not set";

        if (code !== checkExist.code) throw 'your code not valid';

        const newUser = new userModel({
          _id,
          password,
          fullName,
        });
        const registerResult = await newUser.save();

        console.log(registerResult);

        //create a folder with user.json file within

        create_file({ _id });

        //create token

        const token = sign({ _id, fullName }, secret);

        //return token

        //delete code in verify code collection

        await verifyCode.deleteOne({ _id });

        return { user: registerResult, token };

      } catch (error) {
        return { error };
      }
    }
  },


  //resolver for update user:
  updateUser: {
    type: user,
    args: {
      user: { type: inputUser }
    },
    resolve: async (parent: any, args: any) => {

      if (!userInfo.username) return { error: 'access denied' }

      const _id = userInfo.username;

      const user = args.user;

      //sanitize input user data

      // const validate = updateUserSchema.validate(user);

      // if (validate.error) return { error: validate.error.details[0].message }

      try {
        await userModel.updateOne({ _id }, user);

        const updateResult = await userModel.findById({ _id });

        return { result: updateResult }

      } catch ({ message }) {

        return { error: message }

      }
    }
  }
};
