import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Toolbar } from "@material-ui/core";

import { ROUTE_PATH } from "../utils/route-util";

const NavBar = lazy(() => import("../components/NavBar"));

const History = lazy(() => import("../pages/History"));
const Loading = lazy(() => import("../components/Loading"));
const ProjectList = lazy(() => import("../pages/ProjectList"));
const ReportDetail = lazy(() => import("../pages/ReportDetail"));
const Visualization = lazy(() => import("../pages/Visualization"));

const PrivateRoute: React.FC = () => {
  return (
    <>
      <NavBar />
      <Toolbar />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTE_PATH.root}>
            <ProjectList />
          </Route>
          <Route exact path={ROUTE_PATH.reportDetail}>
            <ReportDetail />
          </Route>
          <Route exact path={ROUTE_PATH.history}>
            <History />
          </Route>
          <Route exact path={ROUTE_PATH.visualization}>
            <Visualization />
          </Route>
          <Route path={ROUTE_PATH.root}>
            <Redirect to={ROUTE_PATH.root} />
          </Route>
        </Switch>
      </Suspense>
    </>
  );
};

export default PrivateRoute;
