import { Typegoose, prop } from "typegoose";

class user extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public password!: string;

  @prop()
  public fullName?: string;
  
}

export const userModel = new user().getModelForClass(user);
