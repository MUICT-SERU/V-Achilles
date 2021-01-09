const useAuth = () => {
  const token = localStorage.getItem("token");

  const isAuth = () => {
    if (token) return true;
    return false;
  };

  return { isAuth };
};

export default useAuth;
