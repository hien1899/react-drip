import React from "react";
import LoginBackground from "../../assets/img/login.png";
import { CardBody, CardHeader, Input } from "reactstrap";
// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
  FormGroup,
  Form
} from "react-bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      message: "",
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({ email: value }, () => console.log(this.state.email));
  }

  async handleSubmit(event) {
    event.preventDefault();
    const res = await fetch(
      'http://13.212.33.166/api/password/forgot?name=' + this.state.email,
      {
        method: "get",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = await res.json();
    this.setState({ message: data.message })
    if (this.state.message === "Account not found!!!" || this.state.message === "Can't send email!!!") {
      alert(this.state.message)
      history.push('/forgot-password')
    } else {
      if (res.ok) {
        return (
          history.push('/change-password')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        history.push('/forgot-password')
      }
    }
  }

  render() {
    const isSubmitting = false
    return (
      <Container
        fluid
        style={{
          backgroundImage: `url(${LoginBackground})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Row>
          <div className="col-12 p-0">
            <div className="min-vh-100 m-0 d-flex flex-column justify-content-center">
              <Col md={{ span: 4, offset: 4 }}>
                <Card className="bg-dark">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup>
                        <label htmlFor="email">Vui lòng cung cấp email bạn đã đăng kí</label>
                        <Input
                          name="email"
                          type="text"
                          className="form-control"
                          placeholder="Email bạn đã đăng kí"
                          onBlur={this.handleChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <button type="submit" className=" form-control justify-content-center btn btn-primary btn btn-fill btn-warning" > Gửi mã xác nhận </button>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </div>
          </div>
        </Row>
      </Container>
    );
  }
}

export default ForgotPassword;