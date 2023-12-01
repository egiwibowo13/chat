import {IMessage} from 'react-native-gifted-chat';

export interface UserRequest {
  username: string;
  name: string;
  avatar: string;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  avatar: string;
  userID: string;
}

export interface IMyMessage extends IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
}
