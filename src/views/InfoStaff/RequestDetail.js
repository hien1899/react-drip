import React from "react";
import { Input } from "reactstrap";
import Select from "react-select"
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

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class RequestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      list: this.requestList,
      selectedPriorityOption: null,
      selectedStatusOption: null,
      form: [],
      change: false,
      errors: { numberOfPeople: "" }
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
        quantity: "",
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
        `http://13.212.33.166/info/location/request/${id}`,
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
      console.log(data);
      this.setState({
        list: {
          ...data.data,
          productRequests: data.data.productResponses
        },
        form: data.data.productResponses
      }, () => console.log(this.state.list));
    }
    const account = "accountId"
    const requestId = "requestId"
    let list = { ...this.state.list };
    list[account] = authenticationService.currentUserValue.id
    list[requestId] = this.state.id
    this.setState({ list })
  }

  // Select file to upload  
  onClickHandler = () => {
    const data = new FormData()
    data.append('file', this.state.selectedFile)
  }

  handleInput(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    const account = "accountId"
    const requestId = "requestId"
    let errors = this.state.errors;
    switch (name) {
      case "numberOfPeople":
        errors.numberOfPeople = validNumberRegex.test(value) ? "" : "Tr?????ng n??y ch??? c?? s???!";
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
            productName: "",
            quantity: "",
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
      event.preventDefault()
      const currentUser = authenticationService.currentUserValue;
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
        alert("Th??m ?????a ??i???m th??nh c??ng")
        history.push('/info-staff/list/location')
        location.reload()
      } else {
        alert("???? c?? l???i x???y ra. M???i th??? l???i")
        history.push('/info-staff/list/location')
        location.reload()
      }
    } else {
      alert("???? c?? l???i x???y ra. M???i th??? l???i")
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
                          <label>Ng?????i ?????i di???n</label>
                          <Input
                            name="representativeName"
                            className="form-control-alternative"
                            defaultValue={this.state.list.representativeName}
                            placeholder="Representative name"
                            type="text"
                            onBlur={this.handleInput}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="exampleInputEmail1">
                            S??? ??i???n tho???i
                                  </label>
                          <Input
                            name="representativePhone"
                            className="form-control-alternative"
                            defaultValue={this.state.list.representativePhone}
                            placeholder="Phone number"
                            type="text"
                            onBlur={this.handleInput}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label htmlFor="numberOfPeople"> S??? l?????ng ng?????i c???n h??? tr??? </label>
                          <Input
                            name="numberOfPeople"
                            className="form-control-alternative"
                            defaultValue={this.state.list.numberOfPeople}
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
                          <label htmlFor="address">?????a ch???</label>
                          <Input
                            name="address"
                            className="form-control-alternative"
                            defaultValue={this.state.list.address}
                            placeholder="Address"
                            type="text"
                            onBlur={this.handleInput}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg="4">
                        <Form.Group>
                          <label>????? ??u ti??n</label>
                          <select name="priority" className="form-control" onBlur={this.handleInput}>
                            <option value="1">Cao</option>
                            <option value="2">Trung b??nh</option>
                            <option value="3">Th???p</option>
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <label htmlFor="request"> Y??u c???u s??? </label>
                        <Input
                          name="requestId"
                          className="form-control-alternative"
                          placeholder="Request ID"
                          defaultValue={this.state.list.id}
                          type="text"
                          onBlur={this.handleInput}
                          disabled
                        />
                      </Col>
                      <Col lg="4">
                        <label htmlFor="request"> V?? ????? </label>
                        <Input
                          name="latitude"
                          className="form-control-alternative"
                          placeholder="Latitude"
                          type="text"
                          defaultValue={this.state.list.latitude}
                          onBlur={this.handleInput}
                          disabled
                        />
                      </Col>
                      <Col lg="4">
                        <label htmlFor="request"> Kinh ????? </label>
                        <Input
                          name="longitude"
                          className="form-control-alternative"
                          placeholder="Longitude"
                          type="text"
                          defaultValue={this.state.list.longitude}
                          onBlur={this.handleInput}
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Group>
                          <i className="nc-icon nc-simple-add" style={{ marginTop: "20px 0", color: "green" }} onClick={this.handleAdd} >Th??m</i>
                          {this.state.list.productRequests.map((item, index) => {
                            return (
                              <Row key={index}>
                                <Col md="3">
                                  <select name="categoryId" className="form-control" onBlur={(event) => { this.handleEditFieldOfItem(event, index); }} defaultValue={item.categoryId}>
                                    <option value="1">N?????c</option>
                                    <option value="2">Th???c ph???m</option>
                                    <option value="3">Y t???</option>
                                    <option value="4">Qu???n ??o</option>
                                    <option value="5">Kh??c</option>
                                  </select>
                                </Col>
                                <Col md="4">
                                  <Input
                                    name="productName"
                                    className="form-control-alternative"
                                    placeholder="T??n v???t ph???m"
                                    type="text"
                                    defaultValue={item.productName || ""}
                                    onChange={(event) => { this.handleEditFieldOfItem(event, index); }}
                                  />
                                </Col>
                                <Col md="4">
                                  <Input
                                    name="quantity"
                                    className="form-control-alternative"
                                    placeholder="S??? l?????ng"
                                    type="text"
                                    defaultValue={item.quantity || ""}
                                    onBlur={(event) => { this.handleEditFieldOfItem(event, index); }}
                                  />
                                </Col>
                                <Col>
                                  <i className="nc-icon nc-simple-delete" style={{ marginTop: 15, fontWeight: "bolder", color: "green" }}
                                    onClick={(event) => { this.remove(index) }}></i>
                                </Col>
                              </Row>
                            );
                          })}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button className="btn-fill pull-right" type="submit" variant="info">Th??m ?????a ??i???m</Button>
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
      </>
    );
  }
}

export default RequestDetail