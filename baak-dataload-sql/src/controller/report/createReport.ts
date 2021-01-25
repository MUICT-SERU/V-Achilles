import { UserInterface } from "../../models/user";
import ReportModel, { ReportInterface } from "../../models/report";

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
    const savedReport: ReportInterface = await newReport.save();

    res
      .status(200)
      .json({
        reportId: savedReport._id,
        message: "Create report successfully",
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Opps! Something went wrong" });
  }
};

export default createReport;
