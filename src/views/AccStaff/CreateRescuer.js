import React from "react";
//reactstrap
import {
  Input,
} from "reactstrap";
// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
//auth 
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{1,})$/i
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

class CreateRescuer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      errors: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  emptyItem = {
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    description: "",
    roleId: "4"
  };

  async handleSubmit(event) {
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue;
      event.preventDefault();
      const res = await fetch(
        'http://localhost:8080/account/rescuer/create',
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
      if (res.ok) {
        return (
          alert("Thêm nhân viên thành công"),
          history.push('/acc-staff/table')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        history.push('/acc-staff/table')
        location.reload()
      }
    } else {
      alert("Đã có lỗi xảy ra. Mời thử lại")
      history.push('/acc-staff/table')
      location.reload()
    }
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "firstname":
        errors.firstname = validNameRegex.test(value) ? "" : "Trường không đúng định dạng!";
        break;
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email không đúng! abc@abc.xyz(.xy)!";
        break;
      case "phone":
        errors.phone = validPhoneRegex.test(value) ? "" : "Số điện thoại không đúng!";
        break;
      default:
        break;
    }
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
      if (nowMonth < 10) {return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()}
      else {return nowYear + "-" + nowMonth + "-" + nowDateTime.getDate()}
    }
    const minDate = () => {
      let nowDateTime = new Date;
      let nowMonth = nowDateTime.getMonth();
      let nowYear = nowDateTime.getFullYear() - 60
      if (nowMonth < 10) {return nowYear + "-0" + nowMonth + "-" + nowDateTime.getDate()}
      else {return nowYear + "-" + nowMonth + "-" + nowDateTime.getDate()}
    }

    return (
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
                          placeholder="Họ"
                          onBlur={this.handleChange}
                          type="text"
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
                          placeholder="Tên"
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
                          name="birthday"                  
                          min={minDate()}
                          max={maxDate()}
                          onBlur={this.handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col lg="4">
                      <Form.Group>
                        <label>Email</label>
                        <Input
                          name="email"
                          className="form-control-alternative"
                          placeholder="Email"
                          type="text"
                          onBlur={this.handleChange}
                          required
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
                          placeholder="Số điện thoại"
                          onBlur={this.handleChange}
                          type="text"
                          required
                        />
                        {errors.phone.length > 0 && (
                          <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.phone}</span>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Địa chỉ</label>
                        <Input
                          name="address"
                          className="form-control-alternative"
                          placeholder="Địa chỉ"
                          onBlur={this.handleChange}
                          type="text"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Thành phố</label>
                        <Input
                          name="city"
                          className="form-control-alternative"
                          onBlur={this.handleChange}
                          placeholder="Thành phố"
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Nước</label>
                        <Input
                          name="country"
                          className="form-control-alternative"
                          placeholder="Nước"
                          onBlur={this.handleChange}
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>Mô tả</label>
                        <Input
                          name="description"
                          className="form-control-alternative"
                          placeholder="Mô tả"
                          onBlur={this.handleChange}
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Create
                        </Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    );
  }
}

export default CreateRescuer;
