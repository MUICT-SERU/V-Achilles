import { model, Schema, Document } from "mongoose";

export interface ReportInterface extends Document {
  user: string;
  reportDetail: Object;
}

const ReportSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reportDetail: Object,
  },
  { timestamps: true }
);

export default model<ReportInterface>("Report", ReportSchema);
