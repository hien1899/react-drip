import React, { useState } from "react";
import { Link } from "react-router-dom"
import LoginBackground from "../../assets/img/login.png";
import PropTypes from "prop-types";
import { CardBody, CardHeader, Input } from "reactstrap";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  FormGroup,
} from "react-bootstrap";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import authenticationService from "./RoleBaseAuth/services/AuthenticationService.js";
import Role from "./RoleBaseAuth/helper/Role";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // redirect to home if already logged in
    // if (authenticationService.currentUserValue) {
    //   this.props.history.push("/");
    // }
    // else this.props.history.push("/login");
  }
  render() {
    return (
      <div
        style={{
          // backgroundImage: `url(${LoginBackground})`,
          backgroundColor: "darkgrey",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          opacity: 0.8
        }}
      >
        <div style={{ margin: "0px 15px", padding: 19, height: "100%", position: "sticky"}}>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().required("Email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={(
              { email, password },
              { setStatus, setSubmitting }
            ) => {
              setStatus();
              authenticationService.login(email, password).then(
                (user) => {
                  // if (user.roleId == Role.Admin) {
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/admin/dashboard",
                  //     },
                  //   };
                  //   this.props.history.push("/admin/dashboard");

                  // } else if (user.roleId == Role.AccStaff) {
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/acc-staff/dashboard",
                  //     },
                  //   };
                  //   this.props.history.push(from);
                  // } else if (user.roleId == Role.InfoStaff) {
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/info-staff/dashboard",
                  //     },
                  //   };
                  //   this.props.history.push(from);
                  // } else if (user.roleId == Role.Rescuer) {
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/rescuer/map",
                  //     },
                  //   };
                  //   this.props.history.push(from);
                  // } else if(user.roleId == Role.Warehouse){
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/warehouse/map",
                  //     },
                  //   };
                  //   this.props.history.push(from);
                  // } else{
                  //   const { from } = this.props.location.state || {
                  //     from: {
                  //       pathname: "/home",
                  //     },
                  //   };
                  //   this.props.history.push(from);
                  // }
                },
                (error) => {
                  alert("Login failed! Please login again!");
                  setSubmitting(false);
                  setStatus(error);
                  this.props.history.push("/home/news")
                }
              );
            }}
            render={({ errors, status, touched, isSubmitting }) => (
              <Form>
                <FormGroup>
                  <label htmlFor="email" style={{ float: "left", fontWeight: 700, fontSize: 24, paddingBottom: 20 }}>Đăng nhập</label>
                  <Field
                    name="email"
                    type="text"
                    className={
                      "form-control" +
                      (errors.email && touched.email
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="Email"
                    required
                  />
                  {/* <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  /> */}
                </FormGroup>
                <FormGroup>
                  {/* <label htmlFor="password" style={{ float: "left", fontWeight: 700 }}>Mật khẩu</label> */}
                  <Field
                    name="password"
                    type="password"
                    className={
                      "form-control" +
                      (errors.password && touched.password
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="Mật khẩu"
                    required
                  />
                  {/* <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  /> */}
                </FormGroup>
                <FormGroup>
                  <div className="d-flex h-auto flex-column justify-content-center mr-auto ml-auto">
                    <button
                      type="submit"
                      className="btn btn-success btn-fill m-0"
                      disabled={isSubmitting}
                    >
                      Đăng nhập
                            </button>
                    {/* {isSubmitting && (
                      <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    )} */}
                  </div>
                </FormGroup>
                {status && (
                  <div className={"alert alert-danger"}>{status}</div>
                )}
                <FormGroup>
                <Link to="/forgot-password" style={{color: "blue"}}>Quên mật khẩu</Link>
                </FormGroup>
              </Form>
            )}
          />

        </div>

      </div>
    );
  }
}

export default LoginPage;
