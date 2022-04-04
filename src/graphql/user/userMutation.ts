import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
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
import { getGmailSchema, getCodeSchema, FinalRegisterSchema, updateSchema } from "../../schemas/joi.schemas";

export const userMutation = {

  GetEmail: {
    type: result,
    args: {
      email: { type: GraphQLString }
    },
    resolve: async (parent: any, args: any) => {
      //validate email
      const { value, error } = getGmailSchema.validate({ email: args.email });

      if (error) return { error: error.details[0].message }

      //getting email from client
      const _id = removeTags(value.email);

      //generate a 6 character random code :
      const code = code_generator(6);

      //set a verify code in database:
      try {

        //check code set before
        const checkCodeForUserExist = await verifyCode.findOne({ _id });

        if (checkCodeForUserExist) {
          //if code exist in data base:
          //delete last code and send a new code
          await verifyCode.deleteOne({ _id });
          console.log('last code deleted...');


          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
          console.log('new code saved')
        } else {
          //if code not exist in data base:
          //set code in database and send the code
          const newVerifyCode = new verifyCode({
            _id,
            code
          });
          await newVerifyCode.save();
          console.log('new code saved')
        }

        return { result: 'code send to your email' }

      } catch (error) {
        return { error };
      }

      //send code to email
      //... send code part

    }
  },

  GetCode: {
    type: new GraphQLObjectType({
      name: 'GetCodeOutput',
      fields: {
        error: { type: GraphQLString },
        userExist: { type: GraphQLBoolean },
        userLogin: { type: userLogin },
      }
    }),
    args: {
      email: { type: GraphQLString },
      code: { type: GraphQLString },
    },
    resolve: async (parent: any, args: any) => {


      //validate input data

      const { error, value } = getCodeSchema.validate({
        email: args.email,
        code: args.code
      });

      if (error) return { error: error.details[0].message }


      //getting email from client
      const _id = removeTags(value.email),
        code = removeTags(value.code);


      //check data base for validate code
      try {
        const checkExist = await verifyCode.findOne({ _id });

        //if user founded server will rejected not user found error
        if (!checkExist) throw "code not set";

        //if code not valid reject not valid error
        if (code !== checkExist.code) throw 'your code not valid';

        //check data base for user
        const checkUserInDatabase = await userModel.findOne({ _id });

        //if user found then send unsensitive user information to client

        if (checkUserInDatabase) {
          //generate token
          const token = sign({ _id, fullName: checkUserInDatabase.fullName }, secret);
          //return user information for login
          return {
            error: null, userExist: true, userLogin: {
              token,
              user: checkUserInDatabase
            }
          }
        }

        return { error: null, userExist: false, user: null }

      } catch (error) {
        return { error };
      }
    }
  },

  FinalRegister: {
    type: userLogin,
    args: {
      email: { type: GraphQLString },
      code: { type: GraphQLString },
      inputUser: { type: inputUser }
    },
    resolve: async (parent: any, args: any) => {


      const { value, error } = FinalRegisterSchema.validate({
        email: args.email,
        code: args.code,
        inputUser: args.inputUser
      });

      if (error) return { error: error.details[0].message }


      //getting email from client
      const _id = removeTags(value.email),
        code = removeTags(value.code),
        password = hashMaker(removeTags(value.inputUser.password), 'md5', 'utf-8', 'hex'),
        fullName = removeTags(value.inputUser.fullName);

        

      //check data base for validate code
      try {
        const checkExist = await verifyCode.findOne({ _id });

        //if user founded server will rejected not user found error
        if (!checkExist) throw "code not set";

        //if code not valid reject not valid error
        if (code !== checkExist.code) throw 'your code not valid';

        //check data base for user
        const checkUserInDatabase = await userModel.findOne({ _id });

        //if user found reject error
        if (checkUserInDatabase) return { error: 'you are register later' }

        const newUser = new userModel({
          _id,
          fullName,
          password
        });

        const registerResult = await newUser.save();


        //create folder for new user
        create_file({ _id });

        //generate token
        const token = sign({ _id, fullName }, secret);
        //return user information for login
        return {
          error: null,
          token,
          user: registerResult
        }


      } catch (error) {
        return { error };
      }
    }
  },


  //resolver for update user:
  updateUser: {
    type: result,
    args: {
      user: { type: inputUser }
    },
    resolve: async (parent: any, args: any) => {

      if (!userInfo.username) return { error: 'access denied' }


      const { error, value } = updateSchema.validate({ user: args.user });

      if (error) return { error:error.details[0].message }


      const _id = userInfo.username;

      const user = value.user;


      try {
        await userModel.updateOne({ _id }, user);

        const updateResult = await userModel.findById({ _id });

        return { result: updateResult }

      } catch ({ message }) {

        return { error: message }

      }
    }
  },

};
