import React, { useState } from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter,
  Route,
  Router,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "layouts/Admin.js";
import EditStaff from "views/Admin/EditStaff"

import AccStaffLayout from "layouts/AccStaff.js";
import InfoStaffLayout from "layouts/InfoStaff.js";

import LoginPage from "components/Authentication/Login.js";
import ForgotPasswordPage from "components/Authentication/ForgotPassword.js";
import ChangePasswordPage from "components/Authentication/ChangePassword.js";
import HomePage from "layouts/Home.js";

import RescuerLayout from "layouts/Rescuer.js"

import Warehouse from "layouts/Warehouse.js"
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
import Role from "components/Authentication/RoleBaseAuth/helper/Role.js";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import PrivateRoute from "components/Authentication/RoleBaseAuth/component/PrivateRoute.js";

function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) staticContext.status = code;
        return children;
      }}
    />
  );
}

function NotFound() {
  return (
    <Status code={404}>
      <div>
        <h1>Sorry, can’t find that.</h1>
      </div>
    </Status>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false,
      isInfoStaff: false,
      isAccStaff: false,
      isRescuer: false,
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe((x) =>
      this.setState({
        currentUser: x,
        isAdmin: x && x.roleId == Role.Admin,
        isInfoStaff: x && x.roleId == Role.InfoStaff,
        isAccStaff: x && x.roleId == Role.AccStaff,
        isRescuer: x && x.roleId == Role.Rescuer,
        isWarehouse: x && x.roleId == Role.Warehouse,
      })
    );
  }

  render() {
    const { currentUser, isAdmin, isStaff, isRescuer } = this.state;
    return (
      <Router history={history}>
        <div>
          <Switch>
            <PrivateRoute
              path="/admin"
              roles={[Role.Admin]}
              component={AdminLayout}
            />
            <PrivateRoute
              path="/acc-staff"
              roles={[Role.AccStaff]}
              component={AccStaffLayout}
            />
            <PrivateRoute
              path="/info-staff"
              roles={[Role.InfoStaff]}
              component={InfoStaffLayout}
            />
            <PrivateRoute
              path="/rescuer"
              roles={[Role.Rescuer]}
              component={RescuerLayout}
            />
            <PrivateRoute
              path="/warehouse"
              roles={[Role.Warehouse]}
              component={Warehouse}
            />
            <Route path="/login" component={LoginPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/change-password" component={ChangePasswordPage} />
            <Route path="/home" component={HomePage} /> 
            <Route
              exact
              path="/"
              render={() => {
                return <Redirect to="/home/news" />;
              }}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
