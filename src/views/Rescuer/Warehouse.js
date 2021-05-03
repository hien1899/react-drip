import React from 'react'
import { Link } from "react-dom"
import {
    Badge,
    CardHeader,
    CardFooter,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Pagination,
    PaginationItem,
    PaginationLink,
    Progress,
    Input,
} from "reactstrap";

// react-bootstrap components
import {
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
    Form,
} from "react-bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";
import history from "components/Authentication/RoleBaseAuth/helper/History.js";

import Moment from 'moment';
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
        }
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
        if(currentUser.hasTeam==true){
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
            if (data !== null) this.setState({ product: data?.data, listProducts: data?.data.productResponses });
        }

    }


    render() {
        const product = this.state.listProducts.map((productItem) => {
            return (
                <tr key={productItem.productId}>
                    <td className="border-0">{productItem.categoryId == 1 ? "Thức ăn" : productItem.categoryId == 2 ? "Nước uống" : productItem.categoryId == 3 ? "Y tế" : productItem.categoryId == 4 ? "Quần áo" : "Khác"}</td>
                    <td className="border-0">{productItem.productName}</td>
                    <td className="border-0">{productItem.productQuantity}</td>
                    <td className="border-0">{Moment(productItem.createdDate).format('DD-MM-YYYY')}</td>
                </tr>
            )
        })
        return (
            <Container fluid>
                <Row>
                    <Col md="9">
                        <Card className="striped-tabled-with-hover border-0">
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th className="border-0" hidden>ID</th>
                                            <th className="border-0">Danh mục</th>
                                            <th className="border-0">Sản phẩm</th>
                                            <th className="border-0">Số lượng ban đầu</th>
                                            <th className="border-0">Ngày tạo</th>
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