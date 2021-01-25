import { useEffect } from "react";
import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import { ROUTE_PATH } from "utils/route-util";
import ProtectedRoute from "utils/route-protected";

import useAuth from "hooks/useAuth";
import useRouter from "hooks/useRouter";

const Loading = lazy(() => import("components/Loading"));

const Login = lazy(() => import("pages/Login"));
const Visualization = lazy(() => import("pages/Visualization"));

const PrivateRoute = lazy(() => import("./private"));

const Routes: React.FC = () => {
  const { goTo, location } = useRouter();
  const { isAuth } = useAuth();

  useEffect(() => {
    // Preventing user going back to login page after login
    if (isAuth() && location.pathname === "/login")
      goTo(ROUTE_PATH.root)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={ROUTE_PATH.login}>
          <Login />
        </Route>

        <ProtectedRoute path={ROUTE_PATH.root}>
          <PrivateRoute />
        </ProtectedRoute>
      </Switch>
    </Suspense>
  );
};

export default Routes;
