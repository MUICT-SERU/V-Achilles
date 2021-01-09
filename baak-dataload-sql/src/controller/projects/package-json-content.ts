import axios from "axios";

interface packageJsonContentReq {
  query: {
    access_token: string;
    selectedRepo: string;
    ownerName: string;
  };
}

const packageJsonContent = async (
  req: packageJsonContentReq,
  res: any,
  _: any
) => {
  try {
    const { access_token, ownerName, selectedRepo } = req.query;

    const packageJsonContentUrl = await getJsonContentUrl(
      ownerName,
      access_token,
      selectedRepo
    );

    await axios
      .get(packageJsonContentUrl, {
        headers: {
          Authorization: `token ${access_token}`,
          Accept: "application/vnd.github.VERSION.raw",
        },
      })
      .then((response) => {
        const packageJson = response.data;

        res.status(200).json({ packageJson });
      })
      .catch((error) => {
        res.status(404).json({ message: "Get package json content failed" });
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Oops! Something went wrong!" });
  }
};

const getJsonContentUrl = async (
  user: string,
  access_token: string,
  repoName: string
) => {
  const response = await axios.get(
    `https://api.github.com/search/code?q=user:${user}+dependencies+repo:${user}/${repoName}+filename:package.json`,
    {
      headers: {
        Authorization: `token ${access_token}`,
      },
    }
  );

  const total_count = response.data.total_count;

  if (total_count > 0) {
    const contents_url = response.data.items[0].repository.contents_url.split(
      "{+path}"
    )[0];
    const packageJson_path = response.data.items[0].path;

    return contents_url + packageJson_path;
  }

  return "";
};

export default packageJsonContent;
