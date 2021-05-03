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
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      request: this.pass
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  pass = {
    code: "",
    pass: "",
    rePass: ""
  }

  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    let request = { ...this.state.request }
    request[name] = value
    this.setState({ request })
  }

  async handleSubmit(event) {
    event.preventDefault();
    const res = await fetch(
      'http://localhost:8080/api/forgot/otp',
      {
        method: "post",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(this.state.request)
      }
    );
    const data = await res.json();
    this.setState({ message: data.message })
    if (this.state.message === "Pass and retype pass mismatch or code invalid!!!" || this.state.message === "New pass or code null!!!" || this.state.message === "Server error!!!") {
      alert(this.state.message)
      // history.push('/forgot-password')
      location.reload()
    } else {
      if (res.ok) {
        return (
          alert("Mật khẩu của bạn đã được thay đổi thành công"),
          history.push('/home/news')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        // history.push('/forgot-password')
        location.reload()
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
                  <CardHeader>
                    Chúng tôi đã gửi mã xác nhận vào mail của bạn. Vui lòng kiểm tra mail và dùng mã xác nhận để tạo mật khẩu mới
                    </CardHeader>
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <FormGroup>
                        <label htmlFor="code">Mã OTP</label>
                        <Input
                          name="code"
                          type="text"
                          className="form-control"
                          onBlur={this.handleChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="pass">Mật khẩu mới</label>
                        <Input
                          name="pass"
                          type="password"
                          className="form-control"
                          onBlur={this.handleChange}
                        />
                      </FormGroup>

                      <FormGroup>
                        <label htmlFor="rePass">Nhập lại mật khẩu</label>
                        <Input
                          name="rePass"
                          type="password"
                          className="form-control"
                          onBlur={this.handleChange}
                        />
                      </FormGroup>
                      <FormGroup>
                        <button type="submit" className=" form-control justify-content-center btn btn-primary btn btn-fill btn-warning" > Đổi mật khẩu </button>
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

export default ChangePassword;