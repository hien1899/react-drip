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
  /^\d[0-9]{0,}$/i
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
      list: this.requestList,
      selectedPriorityOption: null,
      selectedStatusOption: null,
      form: [
        {
          categoryId: "",
          name: "",
          quantity: 0,
        },
      ],
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
        productName: "",
        quantity: 1,
      },
    ]
  }

  // Select file to upload  
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
  }

  //Priority
  handleChangePriority = selectedPriorityOption => {
    this.setState({ selectedPriorityOption });
  };

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
    const account = "accountId"
    let list = { ...this.state.list };
    list[name] = value;
    list[account] = authenticationService.currentUserValue.id
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
            productName: "",
            quantity: 1,
          },
        ]
      }
    });
  };

  remove = (index) => {
    if (this.state.list.productRequests.length > 1) {
      this.setState({
        list: {
          ...this.state.list,
          productRequests: this.state.list.productRequests.filter((_, i) => i !== index)
        }
      });
    }
  }

  handleEditFieldOfItem = (event, itemIndex, fieldName) => {
    const value = event.target.value;
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
        'http://13.212.33.166/info/location/add',
        {
          method: "post",
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
          alert("Thêm địa điểm thành công"),
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
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Body>
                <Form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col lg="4">
                      <Form.Group>
                        <label htmlFor="representativeName">Người đại diện</label>
                        <Input
                          name="representativeName"
                          className="form-control-alternative"
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
                        <label htmlFor="representativePhone"> Số điện thoại </label>
                        <Input
                          name="representativePhone"
                          className="form-control-alternative"
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
                        <label htmlFor="numberOfPeople"> Số lượng người cần cứu trợ </label>
                        <Input
                          name="numberOfPeople"
                          className="form-control-alternative"
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
                        <select name="priority" className="form-control" onBlur={this.handleInput}>
                          <option value="3">Chọn độ ưu tiên</option>
                          <option value="1">Cao</option>
                          <option value="2">Trung bình</option>
                          <option value="3">Thấp</option>
                        </select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group>
                        <i className="nc-icon nc-simple-add" style={{ marginTop: 0, color: "green" }} onClick={this.handleAdd} >Thêm</i>
                        {this.state.list.productRequests.map((item, index) => {
                          return (
                            <>

                              <Row key={index}>
                                <Col md="3">
                                  <select name="categoryId" className="form-control" onChange={(event) => { this.handleEditFieldOfItem(event, index, 'categoryId'); }}>
                                    <option value="">Chọn mục</option>
                                    <option value="1">Nước</option>
                                    <option value="2">Thực phẩm</option>
                                    <option value="3">Y tế</option>
                                    <option value="4">Quần áo</option>
                                    <option value="5">Khác</option>
                                  </select>
                                </Col>
                                <Col md="4">
                                  <Input
                                    name="name"
                                    className="form-control-alternative"
                                    placeholder="Tên vật phẩm"
                                    onChange={(event) => { this.handleEditFieldOfItem(event, index, 'productName'); }}
                                    type="text"
                                    required
                                  />
                                </Col>
                                <Col md="4">
                                  <Input
                                    name="quantity"
                                    className="form-control-alternative"
                                    placeholder="Số lượng"
                                    type="text"
                                    onChange={(event) => { this.handleEditFieldOfItem(event, index, 'quantity'); }}
                                    required
                                  />
                                </Col>
                                <Col>
                                  <i className="nc-icon nc-simple-delete" style={{ marginTop: 45, fontWeight: "bolder", color: "green" }}
                                    onClick={(event) => { this.remove(index) }}></i>
                                </Col>
                              </Row>
                            </>
                          );
                        })}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button className="btn-fill pull-right" type="submit" variant="info">Thêm địa điểm</Button>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            {/* <Card>
              <Card.Body>
                <input type="file" name="file" onChange={this.onChangeHandler} />
                <Button type="submit" className="btn-fill pull-right" onClick={this.onClickHandler} variant="info">Upload</Button>
              </Card.Body>
            </Card> */}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CreateLocation
