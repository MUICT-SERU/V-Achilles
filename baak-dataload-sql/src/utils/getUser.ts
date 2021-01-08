import axios from "axios";

export const getUser = async (access_token: string) => {
  const userData = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `token ${access_token}` },
  });

  return userData ? userData : null;
};
