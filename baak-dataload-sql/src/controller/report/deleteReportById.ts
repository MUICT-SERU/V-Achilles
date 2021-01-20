import { UserInterface } from "../../models/user";
import ReportModel, { ReportInterface } from "../../models/report";

interface DeleteReportById {
  user: UserInterface;
  params: {
    reportId: string;
  };
}

const deleteReportById = async (
  req: DeleteReportById,
  res: any,
  _next: any
) => {
  try {
    const { reportId } = req.params;
    const report: ReportInterface | null = await ReportModel.findById(reportId);
    if (report) {
      await ReportModel.deleteOne({ _id: reportId });
      return res.status(200).json({ message: "Report deleted successfully" });
    } else {
      return res.status(404).json({ message: "The report doesn not exist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Opps! Something went wrong" });
  }
};

export default deleteReportById;
