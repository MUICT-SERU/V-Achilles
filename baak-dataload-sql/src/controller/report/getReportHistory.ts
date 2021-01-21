import { UserInterface } from "../../models/user";
import ReportModel, { ReportInterface } from "../../models/report";

interface GetReportHistoryReq {
  user: UserInterface;
}

const getReportHistory = async (
  req: GetReportHistoryReq,
  res: any,
  _next: any
) => {
  try {
    const reportHistory: ReportInterface[] | null = await ReportModel.find({
      user: req.user._id,
    });
    res.status(200).json({ reportHistory: reportHistory ? reportHistory : [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Opps! something went wrong" });
  }
};

export default getReportHistory;
