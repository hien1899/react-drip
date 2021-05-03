import React from "react";
import { Input } from "reactstrap";
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validNameRegex = RegExp(
  /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/i
);
const validPhoneRegex = RegExp(
  /^\d{10,11}$/i
);

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      errors: {
        firstname: "",
        lastname: "",
      },
      hiddenOldPassword: false,
      hiddenNewPassword: false,
      hiddenReNewPassword: false,
      password: this.pass,
      message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleShowOldPassword = this.toggleShowOldPassword.bind(this)
    this.toggleShowNewPassword = this.toggleShowNewPassword.bind(this)
    this.toggleShowReNewPassword = this.toggleShowReNewPassword.bind(this)
    this.handleSubmitChangePass = this.handleSubmitChangePass.bind(this)
    this.handleChangePass = this.handleChangePass.bind(this)
  }

  pass = {
    accountId: "",
    oldPass: "",
    retypeNewPass: "",
    newPass: ""
  }

  emptyItem = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    birthday: "",
    gender: "",
    phone: "",
    roleId: "",
    country: "",
    city: "",
    description: "",
    salary: "10000",
    isEmployee: true,
    isRescuer: false,
  };

  async componentDidMount() {
    const currentUser = authenticationService.currentUserValue;
    const id = currentUser.id
    if (this.props.match.params.id !== "create") {
      const response = await fetch(
        `http://13.212.33.166/common/profile?id=${id}`,
        {
          method: "get",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + currentUser.accessToken,
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      const account = await response.json();
      this.setState({ item: account.data, password: { ...this.state.password, accountId: currentUser.id } });
    }
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "firstname":
        errors.firstname = validNameRegex.test(value) ? "" : "Trường không đúng định dạng";
        break;
      default:
        break;
    }
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ errors, item });
  }

  handleChangePass(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let password = { ...this.state.password }
    password[name] = value
    this.setState({ password })
  }

  async handleSubmitChangePass(event) {
    const currentUser = authenticationService.currentUserValue;
    event.preventDefault();
    const { password } = this.state;
    const res = await fetch(
      "http://13.212.33.166/common/profile/pass/change",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + currentUser.accessToken,
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(password),
      }
    );

    if (res.ok) {
      return (
        alert("Thông tin cá nhân đã được thay đổi"),
        authenticationService.logout(),
        history.push("/home/news")
      )
    } else {
      alert("Mật khẩu bị lỗi")
      history.push('/acc-staff/profile')
      location.reload()
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue; 
      const { item } = this.state;
      const res = await fetch(
        "http://13.212.33.166/common/profile/update?id=" + currentUser.id,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + currentUser.accessToken,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(item),
        }
      );
      this
      if (res.ok) {
        return (
          alert("Thông tin cá nhân đã được thay đổi"),
          history.push('/info-staff/list/location')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        history.push('/info-staff/edit-profile')
        location.reload()
      }
    } else {
      alert("Đã có lỗi xảy ra. Mời thử lại")
      history.push('/info-staff/edit-profile')
      location.reload()
    }
  }

  toggleShowOldPassword() {
    this.setState({ hiddenOldPassword: !this.state.hiddenOldPassword });
  }
  toggleShowNewPassword() {
    this.setState({ hiddenNewPassword: !this.state.hiddenNewPassword });
  }
  toggleShowReNewPassword() {
    this.setState({ hiddenReNewPassword: !this.state.hiddenReNewPassword });
  }

  render() {
    const { item, errors } = this.state;

    const maxDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 18
      if (nowMonth < 10) return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()
      else nowYear + "-" + nowMonth + "-" + nowDateTime.getDate()
    }
    const minDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 60
      if (nowMonth < 10) return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()
      else return nowYear + "-" + nowMonth + "-" + nowDateTime.getDate()
    }

    return (
      <>
        <Container fluid>
          <Row>
            <Col md="8">
              <Card>
                <Card.Body>
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col lg="4">
                        <Form.Group>
                          <label>Họ</label>
                          <Input
                            name="firstname"
                            className="form-control-alternative"
                            defaultValue={item.firstname || ""}
                            placeholder="First name"
                            type="text"
                            onBlur={this.handleChange}
                            required
                          />
                          {errors.firstname.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.firstname}</span>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label>Tên</label>
                          <Input
                            name="lastname"
                            className="form-control-alternative"
                            defaultValue={item.lastname || ""}
                            placeholder="Last name"
                            type="text"
                            onBlur={this.handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="exampleInputEmail1">Giới tính</label>
                          <Row>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="true"
                                  name="gender"
                                  onBlur={this.handleChange}
                                  defaultChecked={item.gender == false}
                                />
                                Nam
                              </label>
                            </Col>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="false"
                                  name="gender"
                                  onBlur={this.handleChange}
                                  defaultChecked={item.gender == true}
                                />
                                Nữ
                              </label>
                            </Col>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  defaultValue="Other"
                                  name="gender"
                                />
                                Khác
                              </label>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="exampleInputEmail1">Ngày sinh</label>
                          <Input
                            type="date"
                            id="birthday"
                            name="birthday"
                            defaultValue={item.birthday || ""}
                            onBlur={this.handleChange}
                            min={minDate()}
                            max={maxDate()}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label>
                            Email
                          </label>
                          <Input
                            name="email"
                            className="form-control-alternative"
                            placeholder="Email"
                            defaultValue={item.email || ""}
                            type="text"
                            onBlur={this.handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label>
                            Số điện thoại
                          </label>
                          <Input
                            name="phone"
                            className="form-control-alternative"
                            defaultValue={item.phone || ""}
                            placeholder="Phone number"
                            type="text"
                            onBlur={this.handleChange}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="8">
                        <Form.Group>
                          <label>Địa chỉ</label>
                          <Input
                            name="address"
                            className="form-control-alternative"
                            defaultValue={item.address || ""}
                            placeholder="Address"
                            type="text"
                            onBlur={this.handleChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <Form.Group>
                          <label>Quyền</label>
                          <select name="roleId" className="form-control" onBlur={this.handleChange} disabled>
                            <option selected={item.roleId === 1} value="1">Admin</option>
                            <option selected={item.roleId === 2} value="2">Info Staff</option>
                            <option selected={item.roleId === 3} value="3">Account Staff</option>
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <Form.Group>
                          <label>Thành phố</label>
                          <Form.Control
                            defaultValue={item.city || ""}
                            placeholder="City"
                            name="city"
                            type="text"
                            onBlur={this.handleChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="px-1" md="4">
                        <Form.Group>
                          <label>Đất nước</label>
                          <Form.Control
                            defaultValue={item.country || ""}
                            name="country"
                            placeholder="Country"
                            type="text"
                            onBlur={this.handleChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="4">
                        <Form.Group>
                          <label>Mã ZIP</label>
                          <Form.Control
                            placeholder="ZIP Code"
                            type="number"
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Form.Group>
                          <label>Giới thiệu</label>
                          <Form.Control
                            cols="80"
                            name="description"
                            defaultValue={item.description || ""}
                            placeholder="Here can be your description"
                            rows="4"
                            as="textarea"
                            onBlur={this.handleChange}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      className="btn-fill pull-right"
                      type="submit"
                      variant="info"
                    >
                      Thay đổi thông tin
                    </Button>
                    <div className="clearfix"></div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user">
                <div className="card-image">
                  <img
                    alt="..."
                    src={
                      require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                        .default
                    }
                  ></img>
                </div>
                <Card.Body>
                <div className="author">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      {this.state.item.gender === true ? <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/faces/face-3.jpg").default}
                      ></img> : <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/faces/face-8.png").default}
                      ></img>}
                      <p className="text-center">MSNV: {this.state.item.profileId}</p>
                      <h5 className="title">{this.state.item.firstname} {this.state.item.lastname}</h5>
                    </a>
                  </div>
                  <Row>
                    <Col md="6">
                      <p className="text-center"><label>Ngày sinh: </label> {this.state.item.birthday}</p>
                    </Col>
                    <Col md="6">
                      <p className="text-center"><label>Giới tính</label> {this.state.item.gender == true ? "Nam" : "Nữ"}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <p className="text-center"><label>Email: </label> {this.state.item.email}</p>
                    </Col>
                    <Col md="6">
                      <p className="text-center"><label>Số điện thoại: </label> {this.state.item.phone}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <p className="text-center"><label>Địa chỉ:{" "}</label> {this.state.item.address}, {this.state.item.city}, {this.state.item.country}</p>
                    </Col>
                  </Row>
                  <p className="description text-center">
                    {this.state.item.description}
                  </p>
                </Card.Body>
                <hr></hr>
                <div className="button-container mr-auto ml-auto">
                  <Button
                    className="btn-simple btn-icon"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    variant="link"
                  >
                    <i className="fab fa-facebook-square"></i>
                  </Button>
                  <Button
                    className="btn-simple btn-icon"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    variant="link"
                  >
                    <i className="fab fa-twitter"></i>
                  </Button>
                  <Button
                    className="btn-simple btn-icon"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    variant="link"
                  >
                    <i className="fab fa-google-plus-square"></i>
                  </Button>
                </div>
              </Card>
              <Card>
                <Card.Header>Thay đổi mật khẩu</Card.Header>
                <Card.Body>
                  <Form onSubmit={this.handleSubmitChangePass}>
                    <Form.Group>
                      <label>Mật khẩu hiện tại</label>
                      <Input type={this.state.hiddenOldPassword ? 'text' : 'password'} className="form-control" name="oldPass" onBlur={this.handleChangePass} />
                      <span class={this.state.hiddenOldPassword ? "fa fa-fw fa-eye" : "fa fa-fw fa-eye-slash"} onClick={this.toggleShowOldPassword} style={{ float: "right", marginLeft: -40, marginTop: -27, position: "relative", zIndex: 2 }}></span>
                    </Form.Group>
                    <Form.Group>
                      <label>Mật khẩu mới</label>
                      <Input type={this.state.hiddenNewPassword ? 'text' : 'password'} className="form-control" name="newPass" onBlur={this.handleChangePass} />
                      <span class={this.state.hiddenNewPassword ? "fa fa-fw fa-eye" : "fa fa-fw fa-eye-slash"} onClick={this.toggleShowNewPassword} style={{ float: "right", marginLeft: -40, marginTop: -27, position: "relative", zIndex: 2 }}></span>
                    </Form.Group>
                    <Form.Group>
                      <label>Nhập lại mật khẩu mới</label>
                      <Input type={this.state.hiddenReNewPassword ? 'text' : 'password'} className="form-control" name="retypeNewPass" onBlur={this.handleChangePass} />
                      <span class={this.state.hiddenReNewPassword ? "fa fa-fw fa-eye" : "fa fa-fw fa-eye-slash"} onClick={this.toggleShowReNewPassword} style={{ float: "right", marginLeft: -40, marginTop: -27, position: "relative", zIndex: 2 }}></span>
                    </Form.Group>
                    <Button className="btn-fill pull-right d-flex flex-column justify-content-center mr-auto ml-auto" type="submit" variant="success" > Đổi mật khẩu </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default EditProfile;
