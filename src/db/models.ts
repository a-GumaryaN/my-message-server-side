import { Schema, model } from "mongoose";
import { Typegoose, prop } from "typegoose";

const verifyCodeSchema = new Schema({
  _id: { type: String, require: true },
  code: { type: String, require: true },
},{ timestamps: false });

// verifyCodeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export const verifyCode = model('verifyCode', verifyCodeSchema);

class personPermissionSchema extends Typegoose {
  @prop()
  public canOtherSeeMyProfilePicture?: boolean;

  @prop()
  public canOtherAddMeToACommunicate?: boolean;
}

class user extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public password!: string;

  @prop()
  public fullName?: string;

  @prop()
  public userProfileImage?: string;

  @prop()
  public birthDate?: string;

  @prop()
  public blockedPersons?: string[];

  @prop()
  public lastTimeOnline?: string[];

  @prop()
  public lastUpdate?: lastUpdateSchema[];

  @prop()
  public permissions?: personPermissionSchema;

  @prop()
  public profileImage?: string;
}

class lastUpdateSchema extends Typegoose {
  @prop()
  public communityType!: string;

  @prop()
  public communicationName!: string;

  @prop()
  public time!: Date;
}

class chatRoomSchema extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public user1!: string;

  @prop()
  public user2!: string;

  @prop()
  public messages!: string;
}
class chanelSchema extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public subscribers!: string[];

  @prop()
  public chanelImage?: string;

  @prop()
  public description?: string;

  @prop()
  public owner!: string;
}

class groupePermissionsSchema extends Typegoose { }

class groupeSchema extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public members!: string[];

  @prop()
  public groupeImage?: string;

  @prop()
  public description?: string;

  @prop()
  public owner!: string;

  @prop()
  public permissions?: groupePermissionsSchema;
}

class messageSchema extends Typegoose {
  @prop()
  public _id!: string;

  @prop()
  public time!: string;

  @prop()
  public communicateName!: string;

  @prop()
  public msg!: string;

  @prop()
  public messageFiles?: string[];

  @prop()
  public msgOwner!: string;
}

export const userModel = new user().getModelForClass(user);
export const chatRoomModel = new chatRoomSchema().getModelForClass(
  chatRoomSchema
);
export const chanelModel = new chanelSchema().getModelForClass(chanelSchema);
export const messageModel = new messageSchema().getModelForClass(messageSchema);
export const groupeModel = new groupeSchema().getModelForClass(groupeSchema);
