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

const validNumberRegex = RegExp(
  /^[0-9]*$/i
);
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

class CreateLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      list: this.requestList,
      form: [],
      errors: {
        representativeName: "",
        representativePhone: "",
        numberOfPeople: "",
      }
    };
    this.handleEditFieldOfItem = this.handleEditFieldOfItem.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.remove = this.remove.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  requestList = {
    requestId: "",
    latitude: "",
    longitude: "",
    accountId: "",
    priority: "",
    numberOfPeople: "",
    representativeName: "",
    representativePhone: "",
    address: "",
    productRequests: [
      {
        categoryId: "",
        productId: "",
        productName: "",
        productQuantity: "",
      },
    ]
  }

  async componentDidMount(event) {
    const currentUser = authenticationService.currentUserValue;
    const id = window.location.pathname.split('/')[(window.location.pathname.split('/').length - 1)];
    this.setState({ id: id });
    console.log(id)
    if (this.props.match.params.id !== "create") {
      const response = await fetch(
        `http://localhost:8080/info/location/${id}`,
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
      const data = await response.json();
      this.setState({
        list: {
          ...data.data,
          productRequests: data.data.productResponses
        },
        form: data.data.productResponses
      }, () => console.log(this.state.list));
    }
    const account = "accountId"
    let list = { ...this.state.list };
    list[account] = authenticationService.currentUserValue.id
    this.setState({ list })
  }


  // Select file to upload  
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
  }

  handleInput(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "representativeName":
        errors.representativeName = validNameRegex.test(value) ? "" : "Trường không đúng định dạng!";
        break;
      case "numberOfPeople":
        errors.numberOfPeople = validNumberRegex.test(value) ? "" : "Trường không đúng định dạng!";
        break;
      case "representativePhone":
        errors.representativePhone = validPhoneRegex.test(value) ? "" : "Số điện thoại không đúng!";
        break;
      default:
        break;
    }
    let list = { ...this.state.list };
    list[name] = value;
    this.setState({ list })
  }

  handleAdd = () => {
    this.setState({
      list: {
        ...this.state.list,
        productRequests: [
          ...this.state.list.productRequests,
          {
            categoryId: "",
            productId: "",
            productName: "",
            productQuantity: "",
          },
        ]
      }
    });
  };

  remove = (index) => {
    if (this.state.form.length > 1) {
      this.setState({
        list: {
          ...this.state.list,
          productRequests: this.state.list.productRequests.filter((_, i) => i !== index),
        }
      });
    }
  }

  handleEditFieldOfItem = (event, itemIndex) => {
    const value = event.target.value;
    const fieldName = event.target.name;
    const { list } = this.state;
    const { productRequests } = list;
    const item = productRequests[itemIndex];
    item[`${fieldName}`] = value;
    this.setState({ list }, () => console.log(this.state.list.productRequests));
  };

  async handleSubmit(event) {
    if (validateForm(this.state.errors)) {
      const currentUser = authenticationService.currentUserValue;
      event.preventDefault()
      const res = await fetch(
        'http://localhost:8080/info/location/' + this.state.id,
        {
          method: "put",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + currentUser.accessToken,
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(this.state.list)
        }
      );
      if (res.ok) {
        return (
          alert("Thay đổi thông tin địa điểm thành công"),
          history.push('/info-staff/list/location')
        )
      } else {
        alert("Đã có lỗi xảy ra. Mời thử lại")
        history.push('/info-staff/list/location')
        location.reload()
      }
    } else {
      alert("Đã có lỗi xảy ra. Mời thử lại")
      history.push('/info-staff/list/location')
      location.reload()
    }
  }

  render() {
    const { errors } = this.state;
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
                          <label>Người đại diện</label>
                          <Input
                            name="representativeName"
                            className="form-control-alternative"
                            defaultValue={this.state.list.representativeName || ""}
                            placeholder="Representative name"
                            type="text"
                            onBlur={this.handleInput}
                            required
                          />
                          {errors.representativeName.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.representativeName}</span>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="exampleInputEmail1">
                            Số điện thoại
                                  </label>
                          <Input
                            name="representativePhone"
                            className="form-control-alternative"
                            defaultValue={this.state.list.representativePhone || ""}
                            placeholder="Phone number"
                            type="text"
                            onBlur={this.handleInput}
                            required
                          />
                          {errors.representativePhone.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.representativePhone}</span>
                          )}
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="numberOfPeople">Số lượng người cần hỗ trợ</label>
                          <Input
                            name="numberOfPeople"
                            className="form-control-alternative"
                            defaultValue={this.state.list.numberOfPeople || ""}
                            placeholder="Number Of Rescuee"
                            type="text"
                            onBlur={this.handleInput}
                            required
                          />
                          {errors.numberOfPeople.length > 0 && (
                            <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.numberOfPeople}</span>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="8">
                        <Form.Group>
                          <label htmlFor="address">Địa chỉ</label>
                          <Input
                            name="address"
                            className="form-control-alternative"
                            defaultValue={this.state.list.address || ""}
                            placeholder="Address"
                            type="text"
                            onBlur={this.handleInput}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label>Độ ưu tiên</label>
                          <select name="priority" className="form-control" onChange={this.handleInput}>
                            <option value="1" selected={this.state.list.priority == 1}>Cao</option>
                            <option value="2" selected={this.state.list.priority == 2}>Trung bình</option>
                            <option value="3" selected={this.state.list.priority == 3}>Thấp</option>
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <label htmlFor="request"> Vĩ độ </label>
                        <Input
                          name="latitude"
                          className="form-control-alternative"
                          placeholder="Latitude"
                          type="text"
                          defaultValue={this.state.list.latitude || ""}
                          onBlur={this.handleInput}
                          disabled
                        />
                      </Col>
                      <Col lg="4">
                        <label htmlFor="request"> Kinh độ </label>
                        <Input
                          name="longitude"
                          className="form-control-alternative"
                          placeholder="Longitude"
                          type="text"
                          defaultValue={this.state.list.longitude || ''}
                          onBlur={this.handleInput}
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <i className="nc-icon nc-simple-add" style={{ margin: "10px 0", color: "green" }} onClick={this.handleAdd} >Thêm</i>
                          {/* {this.state.form.map((item, index) => { */}
                          {this.state.list.productRequests.map((item, index) => {
                            return (
                              <Row key={index}>
                                <Col md="3">
                                  <select name="categoryId" className="form-control" onChange={(event) => { this.handleEditFieldOfItem(event, index); }} required>
                                    <option value="1" selected={item.categoryId == 1}>Nước</option>
                                    <option value="2" selected={item.categoryId == 2}>Thực phẩm</option>
                                    <option value="3" selected={item.categoryId == 3}>Y tế</option>
                                    <option value="4" selected={item.categoryId == 4}>Quần áo</option>
                                    <option value="5" selected={item.categoryId == 5}>Khác</option>
                                  </select>
                                </Col>
                                <br/>
                                <br/>
                                <Col md="4">
                                  <Input
                                    name="productName"
                                    className="form-control-alternative"
                                    placeholder="Tên vật phẩm"
                                    type="text"
                                    defaultValue={item.productName || ""}
                                    onChange={(event) => { this.handleEditFieldOfItem(event, index) }}
                                    required
                                  />
                                </Col>
                                <br/>
                                <br/>
                                <Col md="4">
                                  <Input
                                    name="productQuantity"
                                    className="form-control-alternative"
                                    placeholder="Số lượng"
                                    type="text"
                                    defaultValue={item.productQuantity || ""}
                                    onChange={(event) => { this.handleEditFieldOfItem(event, index) }}
                                    required
                                  />
                                </Col>
                                <br/>
                                <br/>
                                <Col>
                                  <i className="nc-icon nc-simple-delete" style={{ marginTop: 15, fontWeight: "bolder", color: "green" }}
                                    onClick={(event) => { this.remove(index) }}></i>
                                </Col>
                                <br/>
                                <br/>
                              </Row>
                            );
                          })}

                        </Form.Group>
                      </Col>
                    </Row>
                    <Button className="btn-fill pull-right" type="submit" variant="info">Thay đổi thông tin</Button>
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

export default CreateLocation