import { UserInterface } from "../../models/user";
import ReportModel from "../../models/report";

interface CreateReportReq {
  user: UserInterface;
  body: {
    report: Object;
  };
}

const createReport = async (req: CreateReportReq, res: any, _next: any) => {
  try {
    const reportObj = {
      user: req.user._id,
      reportDetail: req.body.report,
    };

    const newReport = new ReportModel(reportObj);
    await newReport.save();

    res.status(200).json({ message: "Create report successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Opps! Something went wrong" });
  }
};

export default createReport;
