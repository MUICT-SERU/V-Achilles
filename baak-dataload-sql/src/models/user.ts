import { model, Schema, Document } from "mongoose";

export interface UserInterface extends Document {
  username: string;
  profilePicture: string;
  provider: {
    type: string;
    id: string;
  };
  access_token: string;
}

const UserSchema = new Schema(
  {
    username: { type: String, index: true, unique: true },
    profilePicture: String,
    provider: {
      type: { type: String, index: true },
      id: { type: String, index: true },
    },
    access_token: String,
  },
  {
    timestamps: true,
  }
);

export default model<UserInterface>("User", UserSchema);
