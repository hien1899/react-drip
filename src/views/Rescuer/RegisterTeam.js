import React from 'react'
import {
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
    Badge,
    Button,
    Card,
    Form,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
} from "react-bootstrap";
import authenticationService from "components/Authentication/RoleBaseAuth/services/AuthenticationService.js";

class RegisterTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: this.registerTeam,
            teamMember: this.teamMember,
            count: 1,
            member: [],
            numberOfMember: "",
            message: "",
            hidden: false,
            hasTeam: false,
            addMember: {
                teamId: "",
                personId: "",
            },
            messageDidMount: "",
        };
        this.handleEditFieldOfItem = this.handleEditFieldOfItem.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.removeMember = this.removeMember.bind(this)
        this.handleChangeAddTeamMember = this.handleChangeAddTeamMember.bind(this)
        this.handleSubmitAddTeamMember = this.handleSubmitAddTeamMember.bind(this)
    }

    teamMember = {
        teamId: "",
        teamLeadId: "",
        hasWarehouse: "",
        createdDate: "",
        memberResponses: [],
    }

    registerTeam = {
        personId: "",
        rescuerId: "",
        teamName: "",
        status: "",
        memberRequests: [
            {
                id: "",
                name: "",
                roleId: "",
            }
        ],
    }

    async componentDidMount(event) {
        const currentUser = authenticationService.currentUserValue;
        if (currentUser.hasTeam == true) {
            this.setState({ isLoading: true });
            const response = await fetch('http://13.212.33.166/rescuerTeam/team/view?id=' + currentUser.id, {
                method: "get",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + currentUser.accessToken,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            const data = await response.json();
            if (data !== null) this.setState({ messageDidMount: data.message }, () => {
                if (this.state.messageDidMount === "Success") {
                    this.setState({ teamMember: data.data, member: data.data.memberResponses, hasTeam: currentUser.hasTeam }, () => {
                        if (this.state.teamMember.personLeadId !== currentUser.personId) this.setState({ hidden: true })
                        else this.setState({ hidden: false })
                    });
                }
            })
        }
        else {
            this.setState({ message: "B???n kh??ng tham gia v??o nh??m. H??y t???o nh??m ngay" })
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const id = "personId"
        if (name === "numberOfMember") this.setState({ numberOfMember: value })
        let list = { ...this.state.list };
        list[name] = value;
        list[id] = authenticationService.currentUserValue.personId;
        this.setState({ list })
    }

    handleAdd = () => {
        this.setState({
            list: {
                ...this.state.list,
                memberRequests: [
                    ...this.state.list.memberRequests,
                    {
                        id: "",
                        name: "",
                        roleId: "",
                    },
                ]
            }, count: this.state.count += 1
        });
    };

    remove = (index) => {
        if (this.state.list.memberRequests.length > 1) {
            this.setState({
                list: {
                    ...this.state.list,
                    memberRequests: this.state.list.memberRequests.filter((_, i) => i !== index)
                }
            });
        }
    }

    handleEditFieldOfItem = (event, itemIndex, fieldName) => {
        const value = event.target.value;
        const { list } = this.state;
        const { memberRequests } = list;
        const item = memberRequests[itemIndex];
        item[`${fieldName}`] = value;
        this.setState({ list }, () => console.log(this.state.list.memberRequests));
    };

    async removeMember(id) {
        const currentUser = authenticationService.currentUserValue.accessToken;
        const res = await fetch(`http://13.212.33.166/rescuerTeam/team/member/delete?id=${id}`, {
            method: 'delete',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + currentUser,
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedMember = [...this.state.member].filter(i => i.rescuerId !== id);
            this.setState({ member: updatedMember });
        })
    }

    async handleSubmit(event) {
        const currentUser = authenticationService.currentUserValue;
        const res = await fetch(
            'http://13.212.33.166/rescuerTeam/create',
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
                history.push("/rescuer/register"),
                alert("T???o nh??m th??nh c??ng"),
                location.reload()
            )
        }
        else return alert("???? c?? l???i x???y ra. M???i b???n th??? l???i")
    }

    handleChangeAddTeamMember(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const id = "teamId"
        let addMember = { ...this.state.addMember };
        addMember[name] = value;
        addMember[id] = this.state.teamMember.teamId;
        this.setState({ addMember })
    }

    async handleSubmitAddTeamMember(event) {

        if (authenticationService.currentUserValue) {
            event.preventDefault();
            const currentUser = authenticationService.currentUserValue;
            const res = await fetch(
                'http://13.212.33.166/rescuerTeam/team/member/add',
                {
                    method: "post",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + currentUser.accessToken,
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify(this.state.addMember)
                }
            );
            if (res.ok) {
                return (  
                    alert("Th??m th??nh vi??n v??o nh??m th??nh c??ng"),
                    this.props.history.push("/rescuer/register"),
                    location.reload()
                )
            }
            else return alert("???? c?? l???i x???y ra. M???i b???n th??? l???i")
        }
    }


    render() {

        const teamMember = this.state.member.map((item, index) => {
            return (
                <tr key={index}>
                    <td className="border-0">{item.firstname} {item.lastname}</td>
                    <td className="border-0">{item.gender === true ? "Nam" : "N???"}</td>
                    <td className="border-0">{item.phone}</td>
                    <td className="border-0">{this.state.teamMember.teamLeadId == item.rescuerId ? "Tr?????ng nh??m" : "Th??nh vi??n"}</td>
                    {this.state.hidden === false ?
                        <td className="border-0">
                            <span className="nc-icon" style={{ fontWeight: 500, color: "red" }} onClick={(event) => { this.removeMember(item.rescuerId) }}>X??a</span>
                        </td> : ""
                    }
                </tr>
            )
        })
        return (
            <Container fluid>

                {this.state.hidden === false && this.state.hasTeam === true ?
                    <Row>
                        <Col md="7">
                            <Card>
                                <Card.Body>
                                    {this.state.message.length > 0 && this.state.messageDidMount !== "Success" ? <p>{this.state.message}</p>
                                        : <Table className="table-hover table-striped">
                                            <thead>
                                                <tr>
                                                    <th className="border-0">T??n th??nh vi??n</th>
                                                    <th className="border-0">Gi???i t??nh</th>
                                                    <th className="border-0">S??? ??i???n tho???i</th>
                                                    <th className="border-0">V??? tr??</th>
                                                    <th className="border-0" hidden={this.state.hidden}>T??c v???</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-center justify-content-center align-content-center">
                                                {teamMember}
                                            </tbody>
                                        </Table>
                                    }

                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={this.handleSubmitAddTeamMember}>
                                        <Row>
                                            <Col lg="6">
                                                <Form.Group>
                                                    <label>MSNV</label>
                                                    <Input
                                                        name="personId"
                                                        className="form-control-alternative"
                                                        placeholder="MSNV"
                                                        type="text"
                                                        onBlur={(event) => this.handleChangeAddTeamMember(event)}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg="6">
                                                <Form.Group>
                                                    <label>T??n th??nh vi??n</label>
                                                    <Input
                                                        name="rescuer_name"
                                                        className="form-control-alternative"
                                                        placeholder="T??n th??nh vi??n"
                                                        type="text"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group>
                                            <Row>
                                                <Col>
                                                    <Button className="btn-fill" type="submit" variant="info">Th??m th??nh vi??n</Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    : this.state.hidden === true && this.state.hasTeam === true ?
                        <Row>
                            <Col md="6" style={{ paddingRight: 40 }}>
                                <Card>
                                    <Card.Body>
                                        {this.state.message.length > 0 ? <p>{this.state.message}</p>
                                            : <Table className="table-hover table-striped">
                                                <thead>
                                                    <tr>
                                                        <th className="border-0">T??n th??nh vi??n</th>
                                                        <th className="border-0">Gi???i t??nh</th>
                                                        <th className="border-0">S??? ??i???n tho???i</th>
                                                        <th className="border-0">V??? tr??</th>
                                                        <th className="border-0" hidden={this.state.hidden}>T??c v???</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-center justify-content-center align-content-center">
                                                    {teamMember}
                                                </tbody>
                                            </Table>
                                        }

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        : this.state.hasTeam === false ?
                            <Row>
                                <Col md="7">
                                    <Card>
                                        <Card.Body>
                                            <Form onSubmit={this.handleSubmit}>
                                                <Row>
                                                    <Col lg="4">
                                                        <Form.Group>
                                                            <label>T??n tr?????ng nh??m</label>
                                                            <Input
                                                                name="leader_name"
                                                                className="form-control-alternative"
                                                                defaultValue={authenticationService.currentUserValue.fullname}
                                                                placeholder="T??n tr?????ng nh??m"
                                                                type="text"
                                                                disabled
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="4">
                                                        <Form.Group>
                                                            <label>T??n nh??m</label>
                                                            <Input
                                                                name="teamName"
                                                                className="form-control-alternative"
                                                                placeholder="T??n nh??m"
                                                                type="text"
                                                                onBlur={this.handleChange}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg="4">
                                                        <Form.Group>
                                                            <label>S??? l?????ng th??nh vi??n</label>
                                                            <Input
                                                                name="numberOfMember"
                                                                className="form-control-alternative"
                                                                placeholder="S??? l?????ng th??nh vi??n"
                                                                type="text"
                                                                onBlur={this.handleChange}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Form.Group>
                                                    {this.state.list.memberRequests.map((item, index) => {
                                                        return (
                                                            <Row key={index}>
                                                                <Col md="1">
                                                                    <label>ID</label>
                                                                    <Input
                                                                        name="id"
                                                                        className="form-control-alternative"
                                                                        placeholder="ID"
                                                                        onBlur={(event) => { this.handleEditFieldOfItem(event, index, 'id'); }}
                                                                        type="text"
                                                                        required
                                                                    />
                                                                </Col>
                                                                <Col md="5">
                                                                    <label>T??n th??nh vi??n</label>
                                                                    <Input
                                                                        name="name"
                                                                        className="form-control-alternative"
                                                                        placeholder="T??n th??nh vi??n"
                                                                        onBlur={(event) => { this.handleEditFieldOfItem(event, index, 'name'); }}
                                                                        type="text"
                                                                    />
                                                                </Col>
                                                                <Col md="4">
                                                                    <label>Ch???c v???</label>
                                                                    <select name="roleId" className="form-control" onBlur={(event) => { this.handleEditFieldOfItem(event, index, 'roleId'); }}>
                                                                        <option value="4">Th??nh vi??n</option>
                                                                        <option value="5">Qu???n l?? kho h??ng</option>
                                                                    </select>
                                                                </Col>
                                                                <Col>
                                                                    <i className="nc-icon nc-simple-delete" style={{ marginTop: 45, fontWeight: "bolder", color: "green" }}
                                                                        onClick={(event) => { this.remove(index) }}><a> X??a</a></i>
                                                                </Col>
                                                            </Row>

                                                        );
                                                    })}
                                                    <Row>
                                                        <Col md="4">
                                                            <Row>
                                                                <Col md="7">
                                                                    <i className="nc-icon nc-simple-add" style={{ marginTop: 13, color: "green" }} onClick={this.handleAdd} ><a> Th??m</a></i>
                                                                </Col>
                                                                <Col md="5">
                                                                    <Button
                                                                        className="btn-fill pull-right"
                                                                        type="submit"
                                                                        variant="info"
                                                                    >  Create </Button>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Form.Group>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md="5" style={{ paddingRight: 40 }}>
                                    <Card>
                                        <Card.Body>
                                            {this.state.message.length > 0 && this.state.messageDidMount !== "Success" ? <p>{this.state.message}  {this.state.messageDidMount}</p>
                                                : <Table className="table-hover table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th className="border-0">T??n th??nh vi??n</th>
                                                            <th className="border-0">Gi???i t??nh</th>
                                                            <th className="border-0">S??? ??i???n tho???i</th>
                                                            <th className="border-0">V??? tr??</th>
                                                            <th className="border-0" hidden={this.state.hidden}>T??c v???</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-center justify-content-center align-content-center">
                                                        {teamMember}
                                                    </tbody>
                                                </Table>
                                            }

                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            : ""
                }


            </Container>
        )
    }

}

export default RegisterTeam