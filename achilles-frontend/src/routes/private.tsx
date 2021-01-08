import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Toolbar } from "@material-ui/core";

import { ROUTE_PATH } from "../utils/route-util";

const NavBar = lazy(() => import("../components/NavBar"));

const Loading = lazy(() => import("../components/Loading"));
const ProjectList = lazy(() => import("../pages/ProjectList"));

// const useSyles

const PrivateRoute: React.FC = () => {
  return (
    <>
      <NavBar />
      <Toolbar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTE_PATH.projectList}>
            <ProjectList />
          </Route>
          <Route path={ROUTE_PATH.root}>
            <Redirect to={ROUTE_PATH.projectList} />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

export default PrivateRoute;
