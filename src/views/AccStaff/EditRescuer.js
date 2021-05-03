import React from "react";
import {
  Input,
} from "reactstrap";
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

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class EditRescuer extends React.Component {
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
    birthday: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    description: "",
    gender: "",
  };

  async componentDidMount() {
    const currentUser = authenticationService.currentUserValue;
    const id = window.location.pathname.split('/')[(window.location.pathname.split('/').length - 1)];
    this.setState({ id: id });
    if (this.props.match.params.id !== "create") {
      const response = await fetch(
        `http://13.212.33.166/account/rescuer/${id}`,
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
      console.log(this.state.item)
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
    this.setState({ item });
  }

  async handleSubmit(event) {
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue;
      event.preventDefault();
      const { item } = this.state;
      const res = await fetch(
        "http://13.212.33.166/account/rescuer/" + this.state.id,
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
                          <label>First name</label>
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
                          <label>Last name</label>
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
                          <label htmlFor="exampleInputEmail1">Gender</label>
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
                                Male
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
                                Female
                              </label>
                            </Col>
                            <Col md="4">
                              <label style={{ marginLeft: 20 }}>
                                <Input
                                  type="radio"
                                  value="Other"
                                  name="gender"
                                  onChange={this.handleChange}
                                  checked={item.gender === 'Other'}
                                />
                                Other
                              </label>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <Form.Group>
                          <label>Birthday</label>
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
                          <label htmlFor="email">
                            Email address
                                </label>
                          <Input
                            name="email"
                            className="form-control-alternative"
                            placeholder="Email"
                            type="text"
                            defaultValue={item.email || ""}
                            onBlur={this.handleChange}
                            required
                            disabled
                          />

                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="phone">
                            Phone number
                                </label>
                          <Input
                            name="phone"
                            className="form-control-alternative"
                            placeholder="Phone number"
                            type="text"
                            defaultValue={item.phone || ""}
                            onBlur={this.handleChange}
                            required
                            disabled
                          />

                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <Form.Group>
                          <label>Address</label>
                          <Input
                            name="address"
                            className="form-control-alternative"
                            placeholder="Address"
                            onBlur={this.handleChange}
                            defaultValue={item.address || ""}
                            type="text"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <Form.Group>
                          <label>City</label>
                          <Input
                            name="city"
                            className="form-control-alternative"
                            defaultValue={item.city || ""}
                            onBlur={this.handleChange}
                            placeholder="City"
                            type="text"
                          />
                        </Form.Group>
                      </Col>
                      <Col className="px-1" md="4">
                        <Form.Group>
                          <label>Country</label>
                          <Input
                            name="country"
                            className="form-control-alternative"
                            defaultValue={item.country || ""}
                            placeholder="Country"
                            onBlur={this.handleChange}
                            type="text"
                          />
                        </Form.Group>
                      </Col>
                      <Col className="pl-1" md="4">
                        <Form.Group>
                          <label>Description</label>
                          <Input
                            name="description"
                            className="form-control-alternative"
                            defaultValue={item.description || ""}
                            placeholder="Description"
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
                      Save
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
                      {this.state.item.gender === "Male" ? <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/faces/face-3.jpg").default}
                      ></img> : <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/faces/face-8.png").default}
                      ></img>}
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

export default EditRescuer;
