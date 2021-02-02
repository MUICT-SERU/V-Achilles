import { useState, useEffect } from "react";
import useRouter from "../../hooks/useRouter";

import Report from "../../components/Report";
import Loading from "../../components/Loading";

import { ROUTE_API } from "../../utils/route-util";
import HttpUtil from "../../utils/http-util";

const ReportDetail: React.FC = () => {
  const { urlParams } = useRouter();
  const [data, setData] = useState<any>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    HttpUtil.get(`${ROUTE_API.reports}/${urlParams?.reportId}`)
      .then((response) => {
        // console.log(response.data.report)
        setData(response.data.report);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [urlParams?.reportId]);

  return (
    <>
      {isLoading && <Loading />}
      {data && !isLoading ? (
        <Report
          {...{ data: data?.reportDetail, createdDate: data?.createdAt }}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ReportDetail;
