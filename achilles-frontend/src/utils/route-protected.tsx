import { Route, Redirect } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { ROUTE_PATH } from "./route-util";

interface protectedRouteProps {
  children: JSX.Element;
  path: string;
}

const ProtectedRoute: React.FC<protectedRouteProps> = ({
  children,
  ...rest
}) => {
  const { isAuth } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: ROUTE_PATH.login,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
