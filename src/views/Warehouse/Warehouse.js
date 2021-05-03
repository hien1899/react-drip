import React from 'react'
import { Link } from "react-dom"
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Input,
} from "reactstrap";

// react-bootstrap components
import {
    Button,
    Card,
    Table,
    Container,
    Row,
    Col,
    Form,
} from "react-bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";
import Moment from 'moment';
import { quantity } from 'chartist';

const validNumberRegex = RegExp(
    /^[0-9]*$/i
);

const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
    return valid;
};

class Warehouse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            product: this.warehouse,
            listProducts: [],
            addProduct: this.addAProduct,
            editProduct: this.editProduct,
            productId: "",
            categoryId: "",
            productName: "",
            productQuantity: "",
            onEdit: false,
            itemEdit: "",
            errors: { productQuantity: "" },
            message: "",
            errorFetch: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmitCreate = this.handleSubmitCreate.bind(this)
        this.handleSubmitEdit = this.handleSubmitEdit.bind(this)
        this.handleChangeEdit = this.handleChangeEdit.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    addAProduct = {
        warehouseId: "",
        categoryId: "",
        productName: "",
        productQuantity: ""
    }
    editProduct = {
        productId: "",
        warehouseId: "",
        categoryId: "",
        productName: "",
        productQuantity: ""
    }

    warehouse = {
        warehouseId: "",
        teamId: "",
        rescuerId: "",
        activeStatus: "",
        createdDate: "",
        updatedDate: "",
        productResponses: []
    }

    async componentDidMount(event) {
        const currentUser = authenticationService.currentUserValue;
        this.setState({ isLoading: true });
        const response = await fetch('http://13.212.33.166/warehouse/view?account_id=' + currentUser.id, {
            method: "get",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + currentUser.accessToken,
                'Access-Control-Allow-Origin': '*',
            },
        });

        const data = await response.json();
        this.setState({ product: data.data, listProducts: data.data.productResponses, errorFetch: false });
    }

    async handleSubmitCreate(event) {
        if (validateForm(this.state.errors)) {
            event.preventDefault();
            const currentUser = authenticationService.currentUserValue.accessToken
            const res = await fetch(
                'http://13.212.33.166/warehouse/product/add',
                {
                    method: "post",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + currentUser,
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify(this.state.addProduct)
                }
            );
            if (res.ok) {
                history.push("/warehouse/view")
                alert("Thêm sản phẩm thành công")
                location.reload();
            }
            else return alert("Đã có lỗi xảy ra. Mời bạn thử lại")
        } else {
            alert("Đã có lỗi xảy ra. Mời thử lại")
            history.push("/warehouse/view")
            location.reload();
        }
    }

    async handleSubmitEdit(event) {
        if (validateForm(this.state.errors)) {
            event.preventDefault();
            const currentUser = authenticationService.currentUserValue.accessToken
            const res = await fetch(
                'http://13.212.33.166/warehouse/product/update',
                {
                    method: "put",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + currentUser,
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify(this.state.editProduct)
                }
            );
            this.setState({ onEdit: false })
            if (res.ok) {
                history.push("/warehouse/view")
                alert("Thay đổi thông tin sản phẩm thành công")
                location.reload();
            }
            else return alert("Đã có lỗi xảy ra. Mời bạn thử lại")
        } else {
            alert("Đã có lỗi xảy ra. Mời thử lại")
            history.push("/warehouse/view")
            location.reload();
        }
    }

    async handleRemove(id) {
        const currentUser = authenticationService.currentUserValue.accessToken;
        const res = await fetch(`http://13.212.33.166/warehouse/product/delete?warehouse_product_id=${id}`, {
            method: 'put',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + currentUser,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedProduct = [...this.state.listProducts].filter(i => i.productId !== id);
            this.setState({ product: updatedProduct });
        }).then(() => {
            location.reload();
        })
    }

    handleChange(event) {
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case "productQuantity":
                errors.productQuantity = validNumberRegex.test(value) ? "" : "Chỉ có số!";
                break;
            default:
                break;
        }
        const warehouseId = "warehouseId"
        let addProduct = { ...this.state.addProduct }
        addProduct[warehouseId] = this.state.product.warehouseId
        addProduct[name] = value
        this.setState({ addProduct })
    }

    handleChangeEdit(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        const productId = "productId"
        const warehouseId = "warehouseId"
        const categoryId = "categoryId"
        const productName = "productName"
        const productQuantity = "productQuantity"
        let errors = this.state.errors;
        switch (name) {
            case "productQuantity":
                errors.productQuantity = validNumberRegex.test(value) ? "" : "Chỉ có số!";
                break;
            default:
                break;
        }
        let editProduct = { ...this.state.editProduct }
        editProduct[categoryId] = this.state.categoryId
        editProduct[productId] = this.state.productId
        editProduct[productName] = this.state.productName
        editProduct[productQuantity] = this.state.productQuantity
        editProduct[warehouseId] = this.state.product.warehouseId
        editProduct[name] = value
        this.setState({ editProduct })
        console.log(editProduct)
    }

    render() {
        const { errors } = this.state
        const product = this.state.listProducts.map((productItem) => {
            return (
                <tr key={productItem.productId}>
                    <td className="border-0">{productItem.categoryId == 1 ? "Thức ăn" : productItem.categoryId == 2 ? "Nước uống" : productItem.categoryId == 3 ? "Y tế" : productItem.categoryId == 4 ? "Quần áo" : "Khác"}</td>
                    <td className="border-0">{productItem.productName}</td>
                    <td className="border-0">{productItem.productQuantity}</td>
                    <td className="border-0">{Moment(productItem.createdDate).format('DD-MM-YYYY')}</td>
                    <td className="border-0">{Moment(productItem.updatedDate).format('DD-MM-YYYY')}</td>
                    <td className="border-0">
                        <Row>
                            <Col>
                                <span className="nc-icon nc-settings-tool-66" style={{ color: "green", fontWeight: 900 }} onClick={() => { this.setState({ productId: productItem.productId, productName: productItem.productName, productQuantity: productItem.productQuantity, onEdit: true, itemEdit: productItem, categoryId: productItem.categoryId }) }}><span style={{ paddingLeft: 10 }}>Sửa</span></span>
                            </Col>
                            <Col>
                                <span className="nc-icon nc-simple-remove" style={{ color: "red", fontWeight: 900 }} onClick={() => { this.handleRemove(productItem.productId) }}><span style={{ paddingLeft: 10 }}>Xóa</span></span>
                            </Col>
                        </Row>
                    </td>
                </tr>
            )
        })

        return (
            <Container fluid>
                <Row>
                    <Col md="8">
                        {this.state.onEdit == false ?
                            <Form onSubmit={this.handleSubmitCreate}>
                                <Row>
                                    <Col md="3">
                                        <Form.Group>
                                            <label>Danh mục</label>
                                            <select name="categoryId" className="form-control" onBlur={this.handleChange} required>
                                                <option value="5">Danh mục sản phẩm</option>
                                                <option value="2">Nước</option>
                                                <option value="1">Thực phẩm</option>
                                                <option value="3">Y tế</option>
                                                <option value="4">Quần áo</option>
                                                <option value="5">Khác</option>
                                            </select>
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group>
                                            <label>Tên sản phẩm</label>
                                            <Input type="text" name="productName" placeholder="Tên vật phẩm" className="form-control-alternative" onBlur={this.handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md="2">
                                        <Form.Group>
                                            <label>Số lượng</label>
                                            <Input type="text" name="productQuantity" placeholder="Số lượng" className="form-control-alternative" onBlur={this.handleChange} required />
                                            {errors.productQuantity.length > 0 && (
                                                <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.productQuantity}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md="3" className="m-0 d-flex h-auto flex-column justify-content-center mr-auto ml-auto">
                                        <Button type="submit" className="btn-fill btn-light right" style={{ height: "45%", marginTop: 15 }}>Thêm sản phẩm</Button>
                                    </Col>
                                </Row>
                            </Form>
                            :
                            <Form onSubmit={this.handleSubmitEdit}>
                                <Row>
                                    <Col md="3">
                                        <Form.Group>
                                            <label>Danh mục</label>
                                            <select name="categoryId" className="form-control" onBlur={this.handleChangeEdit} >
                                                <option value="">Danh mục sản phẩm</option>
                                                <option value="2" selected={this.state.itemEdit.categoryId == 2}>Nước</option>
                                                <option value="1" selected={this.state.itemEdit.categoryId == 1}>Thực phẩm</option>
                                                <option value="3" selected={this.state.itemEdit.categoryId == 3}>Y tế</option>
                                                <option value="4" selected={this.state.itemEdit.categoryId == 4}>Quần áo</option>
                                                <option value="5" selected={this.state.itemEdit.categoryId == 5}>Khác</option>
                                            </select>
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group>
                                            <label>Tên sản phẩm</label>
                                            <Input type="text" name="productName" placeholder="Tên vật phẩm" defaultValue={this.state.itemEdit.productName} className="form-control-alternative" onBlur={this.handleChangeEdit} />
                                        </Form.Group>
                                    </Col>
                                    <Col md="2">
                                        <Form.Group>
                                            <label>Số lượng</label>
                                            <Input type="text" name="productQuantity" placeholder="Số lượng" defaultValue={this.state.itemEdit.productQuantity} className="form-control-alternative" onBlur={this.handleChangeEdit} />
                                            {errors.productQuantity.length > 0 && (
                                                <span className="form-warning" style={{ color: "red", fontSize: 12 }}>{errors.productQuantity}</span>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md="3" className="m-0 d-flex h-auto flex-column justify-content-center mr-auto ml-auto">
                                        <Button type="submit" className="btn-fill btn-light right" style={{ height: "45%", marginTop: 15 }}>Cập nhật</Button>
                                    </Col>
                                </Row>
                            </Form>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md="8">
                        <Card className="striped-tabled-with-hover border-0">
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0">Danh mục</th>
                                            <th className="border-0">Sản phẩm</th>
                                            <th className="border-0">Số lượng ban đầu</th>
                                            <th className="border-0">Ngày tạo</th>
                                            <th className="border-0">Ngày cập nhật</th>
                                            <th className="border-0">Tác vụ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center justify-content-center align-content-center">
                                        {product}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }

}

export default Warehouse