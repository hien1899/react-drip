import React from "react";
import { FormGroup, Input } from "reactstrap";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Form,
  Navbar,
  Nav,
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

const validDateRegex = RegExp(
  /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/i
)
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class EditStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      errors: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        birthday: "",
      },
      message: "",
      checkChange: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this)
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

  async handleSubmit(event) {
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue;
      event.preventDefault();
      const res = await fetch(
        'http://13.212.33.166/admin/account/create',
        {
          method: "post",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + currentUser.accessToken,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(this.state.item)
        }
      );
      const data = await res.json();
      this.setState({ message: data.message })
      if (this.state.message === "Can't not create Account!!!") {
        alert("Có lỗi xảy ra")
        history.push('/admin/table')
      } else {
        if (res.ok) {
          return (
            alert("Thêm nhân viên thành công"),
            history.push('/admin/table')
          )
        } else {
          alert("Đã có lỗi xảy ra. Mời thử lại")
          history.push('/admin/create')
        }
      }
    } else {
      alert("Đã có lỗi xảy ra. Mời thử lại")
      history.push('/admin/create')
    }
  }

  validate(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "firstname":
        errors.firstname = validNameRegex.test(value) ? "" : "Name is not valid";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "phone":
        errors.phone = validPhoneRegex.test(value) ? "" : "Phone is not valid";
        break;
      case "birthday":
        if (value === "" || !value || value === undefined) errors.birthday = "Ngày sinh không hợp lệ"
        else errors.birthday = validDateRegex.test(value) ? "" : "Ngày sinh không hợp lệ";
      default:
        break;
    }
    this.setState({ errors })
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  render() {
    const { errors } = this.state;
    const maxDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 18
      if (nowMonth < 10) { return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate() }
      else { return nowYear + "-" + nowMonth + "-" + nowDateTime.getDate() }
    }
    const minDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 60
      if (nowMonth < 10) { return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate() }
      else { return nowYear + "-" + nowMonth + "-" + nowDateTime.getDate() }
    }
    return (
      <>
        <Container fluid>
          <Row>
            <Col md="9">
              <Card>
                <Card.Body>
                  <Form onSubmit={this.handleSubmit} noValidate>
                    <Row>
                      <Col lg="4">
                        <Form.Group>
                          <label>Họ</label>
                          <Input
                            name="firstname"
                            className="form-control-alternative"
                            placeholder="First name"
                            type="text"
                            required
                            onChange={this.handleChange}
                            onBlur={this.validate}
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
                            placeholder="Last name"
                            type="text"
                            required
                            onChange={this.handleChange}
                            onBlur={this.validate}
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
                                  onBlur={this.handleChange}
                                  defaultChecked
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
                                  onBlur={this.handleChange}
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
                                  onBlur={this.handleChange}
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
                            required
                            onChange={this.handleChange}
                            onBlur={this.validate}
                            min={minDate()}
                            max={maxDate()}
                          />
                          {errors.birthday.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.birthday}</span>
                          )}
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
                            type="text"
                            required
                            onChange={this.handleChange}
                            onBlur={this.validate}
                          />
                          {errors.email.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.email}</span>
                          )}
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
                            placeholder="Phone number"
                            type="text"
                            required
                            onChange={this.handleChange}
                            onBlur={this.validate}
                          />
                          {errors.phone.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.phone}</span>
                          )}
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
                            placeholder="Address"
                            type="text"
                            required
                            onBlur={this.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <label>Quyền</label>
                          <select name="roleId" className="form-control" onBlur={this.handleChange}>
                            <option value="1">Admin</option>
                            <option value="2">Info Staff</option>
                            <option value="3">Account Staff</option>
                          </select>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <Form.Group>
                          <label>Thành phố</label>
                          <Form.Control
                            placeholder="City"
                            name="city"
                            onBlur={this.handleChange}
                            type="text"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="px-1" md="4">
                        <Form.Group>
                          <label>Nước</label>
                          <Form.Control
                            name="country"
                            placeholder="Country"
                            onBlur={this.handleChange}
                            type="text"
                            required
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="4">
                        <Form.Group>
                          <label>Mã ZIP</label>
                          <Form.Control
                            placeholder="ZIP Code"
                            type="number"
                            onBlur={this.handleChange}
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
                      Thêm nhân viên
                    </Button>
                    <div className="clearfix"></div>
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

export default EditStaff;
