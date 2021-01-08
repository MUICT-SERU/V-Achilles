import { useHistory, useParams, useLocation } from "react-router-dom";

const useRouter = () => {
  const history = useHistory();
  const urlParams = useParams();
  const location = useLocation();

  const goBack = () => history.goBack();

  const goTo = (routeName: string, id = ":id") => () => {
    history.push(routeName.replace(":id", id));
  };

  return {
    urlParams,
    location,

    goBack,
    goTo,
  };
};

export default useRouter;
