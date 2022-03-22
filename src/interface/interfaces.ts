export interface lastUpdate {
  communicationName: string;
  communityType: string;
  time: string;
}

export interface userInterface {
  _id: string;
  username: string;
  password: string;
  userProfileImage: string;
  fullName: string;
  birthDate: string;
  age: number;
  permissions: personPermissions;
  blockedPersons: string[];
  lastTimeOnline: string;
  lastUpdate: lastUpdate[];
}

export interface personPermissions {
  canOtherSeeMyProfilePicture: boolean;
  canOtherAddMeToACommunicate: boolean;
}

export interface groupePermissions {}

export interface groupeInterface {
  _id: string; //id is groupe name...
  description: string;
  owner: string;
  groupeImage: string;
  permissions: groupePermissions;
  members: string[];
}

export interface chanelInterface {
  _id: string; //id is chanel name...
  subscribers: string[];
  chanelImage: string;
  description: string;
  owner: string;
}

export interface chatRoomMessageInterface {
  time: string;
  msg: string;
  msgOwner: string;
}

export interface chatRoomInterface {
  _id: string;
  user1: string;
  user2: string;
  messages: chatRoomMessageInterface[];
}

export interface messageInterface {
  _id: string;
  communicateName: string;
  time: string;
  messageFiles: string[];
  msg: string;
  msgOwner: string;
}
