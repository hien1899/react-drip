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

const populateDistrict = (provinceElementId, districtElementId) =>{
	var selectedProvinceIndex = document.getElementById("province").selectedIndex;
	var districtElement = document.getElementById("district");
	districtElement.length=0;
	districtElement.options[0] = new Option('Select District','');
	districtElement.selectedIndex = 0;
	var state_arr = s_a[selectedProvinceIndex].split("|");
	for (var i=0; i<state_arr.length; i++) {
		districtElement.options[districtElement.length] = new Option(state_arr[i],state_arr[i]);
	}
}

function FormError(props) {
    if (props.isHidden) {
      return null;
    }
    return <div className="form-warning" style={{color: 'red', fontSize: 12}}>{props.errorMessage}</div>;
  }
   

  const validateInput = (type, checkingText) => {
    const checkNull = /^null|$/;
    const phone = /^\d{10,11}$/;
    const name = /^[a-zA-Z][a-zA-Z .,'-]*$/;
    const email = /^[a-z][a-z0-9_\.]{1,40}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/
    if (type === "phonenumber") {
        /* Kiểm tra phonenumber */
        if(checkingText.trim() == "") {
          return {
            isInputValid: false,
            errorMessage: "Số điện thoại không được để trống",
          };
        } else{
          if (phone.exec(checkingText) !== null) {
            return {
              isInputValid: true,
              errorMessage: "",
            };
          } else {
            return {
              isInputValid: false,
              errorMessage: "Số điện thoại chỉ bao gồm số và có 10-11 chữ số",
            };
          }
        }
    }
  
    if (type === "lastname") {
        /* Kiểm tra lastname */
        if(checkingText.trim() == "") {
          return {
            isInputValid: false,
            errorMessage: "Tên không được để trống",
          };
        } else{
          if (name.exec(checkingText) !== null) {
            return {
              isInputValid: true,
              errorMessage: "",
            };
          } else {
            return {
              isInputValid: false,
              errorMessage: "Tên chỉ bao gồm chữ cái không có số và kí tự đặc biệt",
            };
          }
        }
    }
  
    if (type === "firstname") {
      /* Kiểm tra firstname */
      if(checkingText.trim() == "") {
        return {
          isInputValid: false,
          errorMessage: "Tên không được để trống",
        };
      } else{
        if (name.exec(checkingText) !== null) {
          return {
            isInputValid: true,
            errorMessage: "",
          };
        } else {
          return {
            isInputValid: false,
            errorMessage: "Tên chỉ bao gồm chữ cái không có số và kí tự đặc biệt",
          };
        }
      }
    }
  
    if (type === "email") {
      /* Kiểm tra email */
      if(checkingText.trim() == "") {
        return {
          isInputValid: false,
          errorMessage: "Email không được để trống",
        };
      } else{
        if (email.exec(checkingText) !== null) {
          return {
            isInputValid: true,
            errorMessage: "",
          };
        } else {
          return {
            isInputValid: false,
            errorMessage: "Email phải có dạng drip@gmail.com / drip@gmail.com.vn",
          };
        }
      }
    }
  
  };

class EditNews extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          phonenumber: {
              value: '',
              isInputValid: true, 
              errorMessage: ''
          },
          firstname: {
              value : '',
              isInputValid: true, 
              errorMessage: ''
          },
          lastname: {
            value : '',
            isInputValid: true, 
            errorMessage: ''
          },
          email: {
            value : '',
            isInputValid: true, 
            errorMessage: ''
          }
        };
      }
    
      handleInput = event => {
        const { name, value } = event.target;
        const newState = {...this.state[name]}; /* dummy object */
        newState.value = value;
        this.setState({[name]: newState});
      }
    
      handleInputValidation = event => {
          const { name } = event.target;
          const { isInputValid, errorMessage } = validateInput(name, this.state[name].value);
          const newState = {...this.state[name]}; /* dummy object */
          newState.isInputValid = isInputValid;
          newState.errorMessage = errorMessage;
          this.setState({[name]: newState})
      }

    render() { 
        return (
            <>
            <Container fluid>
                <Row>
                <Col md="8">
                    <Card>
                    <Card.Header>
                        <Card.Title as="h4">Edit Profile</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                        <Row>
                            <Col lg="4">
                            <Form.Group>
                                <label>First name</label>
                                <Input
                              name="firstname"
                              className="form-control-alternative"
                              defaultValue=""
                              placeholder="First name"
                              type="text"
                              onChange={this.handleInput}
                              onBlur={this.handleInputValidation}
                              required
                            />
                            <FormError
                              type="firstname"
                              isHidden={this.state.firstname.isInputValid}
                              errorMessage={this.state.firstname.errorMessage}
                            />
                            </Form.Group>
                            </Col>
                            <Col lg="4">
                            <Form.Group>
                                <label>Last name</label>
                                <Input
                              name="lastname"
                              className="form-control-alternative"
                              defaultValue=""
                              placeholder="Last name"
                              type="text"
                              onChange={this.handleInput}
                              onBlur={this.handleInputValidation}
                              required
                            />
                            <FormError
                              type="lastname"
                              isHidden={this.state.lastname.isInputValid}
                              errorMessage={this.state.lastname.errorMessage}
                            />
                            </Form.Group>
                            </Col>
                            <Col lg="4">
                            <Form.Group>
                                <label htmlFor="exampleInputEmail1">
                                Gender
                                </label>
                                <Row>
                                    <Col md="4">
                                        <label
                                        style={{marginLeft: 20 }}
                                        >
                                        <Input type="radio" value="Male" name="gender" id="male"/> Male
                                        </label>
                                    </Col>
                                    <Col md="4">
                                        <label style={{marginLeft: 20 }}>
                                        <Input type="radio" value="Female" name="gender" id="female"/> Female
                                        </label>
                                    </Col>
                                    <Col md="4">
                                        <label style={{ marginLeft: 20 }}>
                                        <Input type="radio" value="Female" name="gender" id="other"/> Other
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                        <Col lg="4">
                            <Form.Group>
                                <label htmlFor="exampleInputEmail1">
                                Birthday
                                </label>
                                <Input type="date" id="birthday" name="birthday" required/>
                            </Form.Group>
                            </Col>
                            <Col lg="4">
                            <Form.Group>
                                <label htmlFor="exampleInputEmail1">
                                Email address
                                </label>
                                <Input
                              name="email"
                              className="form-control-alternative"
                              placeholder="Email"
                              type="text"
                              onChange={this.handleInput}
                              onBlur={this.handleInputValidation}
                              required
                            />
                            <FormError
                              type="phonenumber"
                              isHidden={this.state.email.isInputValid}
                              errorMessage={this.state.email.errorMessage}
                            />
                            </Form.Group>
                            </Col>
                            <Col lg="4">
                            <Form.Group>
                                <label htmlFor="exampleInputEmail1">
                                Phone number
                                </label>
                                <Input
                              name="phonenumber"
                              className="form-control-alternative"
                              defaultValue=""
                              placeholder="Phone number"
                              type="text"
                              onChange={this.handleInput}
                              onBlur={this.handleInputValidation}
                              required
                            />
                            <FormError
                              type="lastname"
                              isHidden={this.state.phonenumber.isInputValid}
                              errorMessage={this.state.phonenumber.errorMessage}
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
                                    defaultValue=""
                                    placeholder="Address"
                                    type="text"
                                    required
                                />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pr-1" md="4">
                            <Form.Group>
                                <label>District</label>
                                <Input
                                    name="district"
                                    className="form-control-alternative"
                                    defaultValue=""
                                    placeholder="District"
                                    type="text"
                                />
                            </Form.Group>
                            </Col>
                            <Col className="px-1" md="4">
                            <Form.Group>
                                <label>Province</label>
                                <Input
                                    name="province"
                                    className="form-control-alternative"
                                    defaultValue=""
                                    placeholder="Province"
                                    type="text"
                                />
                            </Form.Group>
                            </Col>
                            <Col className="pl-1" md="4">
                            <Form.Group>
                                <label>Country</label>
                                <Input
                                    name="country"
                                    className="form-control-alternative"
                                    defaultValue=""
                                    placeholder="Country"
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
                            Create Staff
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

export default EditNews;
