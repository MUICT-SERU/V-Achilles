import { UserInterface } from "../../models/user";
import ReportModel, { ReportInterface } from "../../models/report";

interface GetReportByIdReq {
  user: UserInterface;
  params: {
    reportId: string;
  };
}

const getReportById = async (req: GetReportByIdReq, res: any, _next: any) => {
  try {
    const { reportId } = req.params;

    const report: ReportInterface | null = await ReportModel.findById(reportId);
    if (report) return res.status(200).json({ report });
    else return res.status(404).json({ message: "The report doesn not exist" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Oop! something went wrong" });
  }
};

export default getReportById;
