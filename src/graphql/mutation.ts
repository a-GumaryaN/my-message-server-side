import { GraphQLObjectType } from "graphql";
import { userMutation } from "./user/userMutation";


export const mutation=new GraphQLObjectType({
	name:"Mutation",
	fields:{
		...userMutation
	}
});