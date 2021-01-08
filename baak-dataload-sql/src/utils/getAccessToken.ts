import axios from "axios";

export const getAccessToken = async (code: string) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }
  );

  let params = new URLSearchParams(response.data);
  const access_token = params.get("access_token");

  return access_token;
};
