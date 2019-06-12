import React from 'react';
import Axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import '../styles.css';
import { Card, Page, Select, Tabs, Layout } from '@shopify/polaris';
import Async from "react-async";


var feeHistoryComponent;
class StudentProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentID: "",
            studentFirstName: "",
            studentLastName: "",
            selected: 4,
            childOptions: [],
            selectedChild: "",
            selectedTerm: "",
            isLoaded: false,
            studentID: "",
            showFeeHistory: false,
            termOptions: [{ label: "Select Term", value: "" }, { label: "Term 1", value: "Term1" }, { label: "Term 2", value: "Term2" }, { label: "Term 3", value: "Term3" },],
            studentIDProfile: "",
            standardProfile: "",
            busNameProfile: "",
            accommodationProfile: "",
            residentTypeProfile: "",
            fatherNameProfile: "",
            motherNameProfile: "",
            parentPhoneProfile: "",
            guardianNameProfile: "",
            guardianPhoneProfile: "",
            studentNameProfile: "",
        }
    }

    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        var parentPhone = this.props.history.location.state.parentPhone;
        var data = {
            pPH: parentPhone
        };
        Axios({
            method: "post",
            url: "http://www.srmheavens.com/erp/parents/pchild/",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            data: data
        }).then(response => response.data)
            .then(data => {
                var options = [];
                var studentDetails = [];
                for (var i = 0; i < data.length; i++) {
                    studentDetails.push({ childName: data[i].Si_firstName + " " + data[i].Si_lastName, studentID: data[i].Si_studentID })
                    options.push({ label: data[i].Si_firstName + " " + data[i].Si_lastName, value: data[i].Si_studentID });
                }
                this.setState({ childOptions: options, selectedChild: options[0].value, isLoaded: true }, () => {
                    this.fetchStudentProfile(options[0].value)
                });
            })
            .catch(error => console.error('Error:', error));
    }

    render() {
        const tabs = [
            {
                id: 'schedule',
                content: 'Schedule',
                panelID: 'schedule-content',
            },
            {
                id: 'timetable',
                content: 'Time Table',
                panelID: 'timetable-content',
            },
            {
                id: 'classes',
                content: 'Classes',
                panelID: 'classes-content',
            },
            {
                id: 'attendance',
                content: 'Attendance',
                panelID: 'attendance-content',
            },
            {
                id: 'details',
                content: 'Details',
                panelID: 'details-content',
            },
            {
                id: 'fees',
                content: 'Fees',
                panelID: 'fees-content',
            },
            {
                id: 'exams',
                content: 'Exams',
                panelID: 'exams-content',
            },
            {
                id: 'performance',
                content: 'Performance',
                panelID: 'performance-content',
            },
        ];
        if (this.state.selected == 4) {
            var abc = (
                <Page fullWidth>
                    <div className="studentHeadingProfile">{this.state.studentNameProfile}</div>
                    <Layout>
                        <Layout.Section oneHalf>
                            <Card>
                                <Card.Section>
                                    <div className="headingProfile" style={{ display: "inline-block", width: "50%" }}>Student ID
                                <div className="contentProfile" style={{ marginTop: "5px" }}>{this.state.studentIDProfile}</div></div>
                                    <div className="headingProfile" style={{ display: "inline-block", width: "50%" }}>Class
                                    <div className="contentProfile" style={{ marginTop: "5px" }}>{this.state.standardProfile}</div></div>
                                </Card.Section>
                                <Card.Section>
                                    <div className="headingProfile" >Resident type</div>
                                    <div className="contentProfile" style={{ marginTop: "5px" }}>{this.state.residentTypeProfile}</div>
                                </Card.Section>
                                <Card.Section>
                                    <div className="headingProfile" >Commute</div>
                                    <div className="contentProfile" style={{ marginTop: "5px" }}>{this.state.busNameProfile || '-'}</div>
                                </Card.Section>
                                <Card.Section>
                                    <div className="headingProfile" >Accomodation</div>
                                    <div className="contentProfile" style={{ marginTop: "5px" }}>{this.state.accommodationProfile || '-'}</div>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                        <Layout.Section oneHalf>
                            <Card>
                                <Card.Section>
                                    <div className="headingProfile" >Parents</div>
                                    <div>
                                        <div className="contentProfile" style={{ marginTop: "5px", display: "inline-block" }}>{this.state.fatherNameProfile}</div>
                                        <div className="contentProfile" style={{ marginTop: "5px", marginLeft: "5%", display: "inline-block" }}>{this.state.parentPhoneProfile}</div>
                                        <div className="headingProfile" style={{ marginTop: "5px", display: "inline-block", float: "right" }}>Father</div>
                                    </div>
                                    <div>
                                        <div className="contentProfile" style={{ marginTop: "5px", display: "inline-block" }}>{this.state.motherNameProfile}</div>
                                        <div className="headingProfile" style={{ marginTop: "5px", display: "inline-block", float: "right" }}>Mother</div>
                                    </div>
                                    <br />
                                    <br />
                                    <div className="headingProfile" >Emergency Contact</div>
                                    <div>
                                        <div className="contentProfile" style={{ marginTop: "5px", display: "inline-block" }}>{this.state.guardianNameProfile || '-'}</div>
                                        <div className="contentProfile" style={{ marginTop: "5px", marginLeft: "5%", display: "inline-block" }}>{this.state.guardianPhoneProfile || '-'}</div>
                                        <div className="headingProfile" style={{ marginTop: "5px", display: "inline-block", float: "right" }}>Guardian</div>
                                    </div>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            )
        } else if (this.state.selected == 5) {
            var abc = (
                <div>
                    <Async promiseFn={this.showFeeDetails} id={this.state.selectedChild} watch={this.state.selectedChild}>
                        {({ data, error, isLoading }) => {
                            if (data) {
                                return (
                                    <div>
                                        <div style={{ width: "fit-content" }}>
                                            <Select
                                                options={this.state.termOptions}
                                                onChange={this.handleTermChange.bind(this)}
                                                value={this.state.selectedTerm}
                                            />
                                        </div>
                                        <br />
                                        <Card title="FEE STRUCTURE" sectioned>
                                            <div className="rulerParent">
                                                <div className="feeType">Admission Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.admissionFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType">Lab Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.labFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType">Bus Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.busFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType">Hostel Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.hostelFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType">Miscellanous Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.miscellanousFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType">Concession Fee</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee">{data.concessionFee}</div>
                                            </div>
                                            <div className="rulerParent">
                                                <div className="feeType" style={{ fontWeight: "bolder" }}>Total Fees</div>
                                                <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                                                <div className="fee" style={{ fontWeight: "bolder" }}>{data.totalFee}</div>
                                            </div>
                                        </Card>
                                    </div>
                                );
                            }
                        }
                        }
                    </Async>
                    {this.state.showFeeHistory ? feeHistoryComponent : null}
                </div>
            )
        } else {
            var abc = (<div>In progress</div>);
        }
        if (this.state.isLoaded) {
            return (
                <div style={{ marginTop: 20, marginLeft: 10 }}>
                    <div style={{ width: "200px", marginBottom: 11 }}>
                        <Select
                            label="Select Child"
                            options={this.state.childOptions}
                            onChange={this.handleChildChange}
                            value={this.state.selectedChild}
                        />
                    </div>
                    <Card>
                        <Tabs tabs={tabs} selected={this.state.selected} onSelect={this.handleTabChange}>
                            <Card.Section>
                                {abc}
                            </Card.Section>
                        </Tabs>
                    </Card>
                </div>
            );
        } else {
            return null;
        }
    }

    handleTabChange = (selectedTabIndex) => {
        this.setState({ selected: selectedTabIndex });
    }

    handleChildChange = (newValue) => {
        this.setState({ selectedChild: newValue }, () => {
            this.resetFields();
            this.fetchStudentProfile(newValue)
        });
    }

    resetFields = () => {
        this.setState({ showFeeHistory: false, selectedTerm: "" });
    }

    fetchStudentProfile = (newValue) => {
        var data = {
            sID: newValue
        }
        Axios({
            method: "post",
            url: "http://www.srmheavens.com/erp/admission/sdetails",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            data: data
        }).then(response => response.data)
            .then(response => {
                console.log('Success:', JSON.stringify(response));
                var res = response[0];
                this.setState({
                    studentIDProfile: res.Si_studentID,
                    standardProfile: res.Ci_classStandard,
                    busNameProfile: res.Bi_busName,
                    accommodationProfile: res.Hi_hallName,
                    residentTypeProfile: res.Si_residentDetails,
                    fatherNameProfile: res.Pi_fatherFirstName + " " + res.Pi_fatherLastName,
                    motherNameProfile: res.Pi_motherFirstName + " " + res.Pi_motherLastName,
                    parentPhoneProfile: res.Pi_parentPhone,
                    guardianNameProfile: res.Pi_guardianName,
                    guardianPhoneProfile: res.Pi_guardianPhone,
                    studentNameProfile: res.Si_firstName + " " + res.Si_lastName
                });
            })
            .catch(error => console.error('Error:', error));
    }

    showHistoryDetails(newValue, abc) {
        const feeHistoryColumns = [{
            dataField: 'date',
            text: 'Date',
            headerStyle: (colum, colIndex) => {
                return { width: "20%" };
            }
        }, {
            dataField: 'term',
            text: 'Term',
            headerStyle: (colum, colIndex) => {
                return { width: "20%" };
            }
        }, {
            dataField: 'termFee',
            text: 'Fee',
            headerStyle: (colum, colIndex) => {
                return { width: "20%" };
            }
        }, {
            dataField: 'termPaid',
            text: 'Amount Paid',
            headerStyle: (colum, colIndex) => {
                return { width: "20%" };
            }
        }, {
            dataField: 'termDue',
            text: 'Closing Due',
            headerStyle: (colum, colIndex) => {
                return { width: "20%" };
            }
        }];
        if (newValue === "Term1") {
            var feeHistory = abc.t1History;
            var termFee = abc.term1Fee;
            var termPaid = abc.term1Paid;
            var termDue = abc.term1Due;
            var feeAmount = abc.term1Fee;
        } else if (newValue === "Term2") {
            var feeHistory = abc.t2History;
            var termFee = abc.term2Fee;
            var termPaid = abc.term2Paid;
            var termDue = abc.term2Due;
            var feeAmount = abc.term2Fee;
        } else if (newValue === "Term3") {
            var feeHistory = abc.t3History;
            var termFee = abc.term3Fee;
            var termPaid = abc.term3Paid;
            var termDue = abc.term3Due;
            var feeAmount = abc.term3Fee;
        }
        var feeHistoryData = [];
        for (var i = 0; i < feeHistory.length; i++) {
            var date = feeHistory[i].paidOn;
            var amountPaid = feeHistory[i].amountPaid;
            var amountdue = termFee - amountPaid;
            date = new Date(date);
            const year = date.getFullYear();
            const month = `${date.getMonth() + 1}`.padStart(2, 0);
            const dt = `${date.getDate()}`.padStart(2, 0);
            const stringDate = [year, month, dt].join("-");
            feeHistoryData.push({ date: stringDate, term: newValue, termFee: feeAmount, termPaid: amountPaid, termDue: amountdue });
            termFee = amountdue;
        }
        feeHistoryComponent = (
            <div>
                <br />
                <Card title="SUMMARY" sectioned>
                    <div className="rulerParent">
                        <div className="feeType">{newValue} Fee</div>
                        <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                        <div className="fee">{feeAmount}</div>
                    </div>
                    <div className="rulerParent">
                        <div className="feeType">{newValue} Paid</div>
                        <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                        <div className="fee">{termPaid}</div>
                    </div>
                    <div className="rulerParent">
                        <div className="feeType">{newValue} Due</div>
                        <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                        <div className="fee">{termDue}</div>
                    </div>
                </Card>
                <Card title="PAYMENTS" sectioned>
                    <ToolkitProvider
                        keyField="id"
                        data={feeHistoryData}
                        columns={feeHistoryColumns}
                        search
                    >
                        {
                            props => {
                                return (
                                    <div>
                                        <BootstrapTable
                                            {...props.baseProps}
                                            pagination={paginationFactory()}
                                            bootstrap4
                                        />
                                    </div>
                                )
                            }
                        }
                    </ToolkitProvider>
                </Card>
            </div>
        );
        this.setState({ showFeeHistory: true });
    }

    handleTermChange = (newValue) => {
        if (newValue !== "") {
            var data = {
                sID: this.state.selectedChild,
                term: newValue
            };
            Axios({
                method: "post",
                url: "http://www.srmheavens.com/erp/fph/td",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.token
                },
                data: data
            }).then(response => response.data)
                .then(response => { this.showHistoryDetails(newValue, response) })
                .catch(error => console.error('Error:', error));
        } else {
            this.setState({ showFeeHistory: false });
        }
        this.setState({ selectedTerm: newValue });
    }

    showFeeDetails = ({ id }) => {
        var data = {
            sID: id
        };
        return Axios({
            method: "post",
            url: "http://www.srmheavens.com/erp/fph/fd",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            data: data
        }).then(response => response.data)
            .then(response => response[0])
            .catch(error => console.error('Error:', error));
    }
}

export default StudentProfile;