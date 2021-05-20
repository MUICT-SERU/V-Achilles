import latestVersion from 'latest-version';

interface IReq {
  query: {
    data: string;
  };
}

const getLatestVersion = async (req: IReq, res: any) => {
  try {
    const { data } = req.query;
    const latest_version = await latestVersion(data);
    return res.status(200).json({ latest_version });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

export default getLatestVersion;
