import jwt from "jsonwebtoken";

const useAuth = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const dateNow = Date.now() / 1000;

  const isAuth = () => {
    if (token) {
      if (decodedToken?.exp > dateNow) return true;
      else return false;
    }
    return false;
  };

  return { isAuth };
};

export default useAuth;
