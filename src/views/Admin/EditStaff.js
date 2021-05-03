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

class EditStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      item: this.emptyItem,
      errors: {
        firstname: "",
        lastname: "",
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const id = window.location.pathname.split('/')[(window.location.pathname.split('/').length - 1)];
    this.setState({ id: id });
    console.log(id)
    if (this.props.match.params.id !== "create") {
      const response = await fetch(
        `http://localhost:8080/admin/account/${id}`,
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
      this.setState({ item: account.data });
    }
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "firstname":
        errors.firstname = validNameRegex.test(value) ? "" : "Name is not valid";
        break;
      default:
        break;
    }
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ errors, item });
  }

  async handleSubmit(event) {
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue;
      event.preventDefault();
      const { item } = this.state;
      const res = await fetch(
        "http://localhost:8080/admin/account/" + this.state.id,
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
      if (res.ok) {
        return (
          alert("Thay đổi thông tin thành công"),
          history.push('/admin/table')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        history.push('/admin/table')
        location.reload()
      }
    } else {
      alert("Đã có lỗi xảy ra. Mời thử lại")
      history.push('/admin/table')
      location.reload()
    }
  }

  render() {
    const { item, errors } = this.state;
    const maxDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 18
      if(nowMonth < 10) return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()
      else return nowYear  + "-" + nowMonth + "-" + nowDateTime.getDate()
    }
    const minDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 60
      if(nowMonth < 10) return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()
      else return nowYear  + "-" + nowMonth + "-" + nowDateTime.getDate()
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
                          <label>Giới tính</label>
                          <Row>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="Male"
                                  name="gender"
                                  onChange={this.handleChange}
                                  checked={item.gender === 'Male'}
                                />
                                Nam
                              </label>
                            </Col>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="Female"
                                  name="gender"
                                  onChange={this.handleChange}
                                  checked={item.gender === 'Female'}
                                />
                                Nữ
                              </label>
                            </Col>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="Other"
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
                          <label>Ngày sinh</label>
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
                          <select name="roleId" className="form-control" onBlur={this.handleChange}>
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
                          <label>Nước</label>
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
                      Cập nhật
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
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/faces/face-3.jpg").default}
                      ></img>
                      <h5 className="title">{this.state.item.firstname} {this.state.item.lastname}</h5>
                    </a>
                    <p className="description">{this.state.item.email}</p>
                  </div>
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
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default EditStaff;
