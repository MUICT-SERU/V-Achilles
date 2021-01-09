import axios from "axios";

interface getJsonContentUrlReq {
  query: {
    access_token: string;
    repoName: string;
    user: string;
  };
}

export const isPackgeJson = async (
  req: getJsonContentUrlReq,
  res: any,
  _: any
) => {
  const { user, access_token, repoName } = req.query;

  try {
    const response = await axios.get(
      `https://api.github.com/search/code?q=user:${user}+dependencies+repo:${user}/${repoName}+filename:package.json`,
      {
        headers: {
          Authorization: `token ${access_token}`,
        },
      }
    );

    res
      .status(200)
      .json({ isPackgeJson: response.data.total_count > 0 ? true : false });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

export default isPackgeJson;
