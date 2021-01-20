import express from "express";
import passport from "../utils/passport";
import ReportController from "../controller/report";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ReportController.createReport
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ReportController.getReportHistory
);
router.get(
  "/:reportId",
  passport.authenticate("jwt", { session: false }),
  ReportController.getRepportById
);
router.delete(
  "/:reportId",
  passport.authenticate("jwt", { session: false }),
  ReportController.deleteReportById
);

export default router;
