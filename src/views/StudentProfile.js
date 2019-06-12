import React from 'react';
import Axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import { Card, Select, Tabs } from '@shopify/polaris';
import Async from "react-async";

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
            isLoaded: false,
            studentID: ""
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
                this.setState({ childOptions: options, selectedChild: options[0].value, isLoaded: true });
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
                <div>
                    Student ID: {this.state.selectedChild}
                </div>
            )
        } else if (this.state.selected == 5) {
            var abc = (
                <Async promiseFn={this.showFeeDetails} id={this.state.selectedChild} watch={this.state.selectedChild}>
                    {({ data, error, isLoading }) => {
                        if (data) {
                            return (
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
                            );
                        }
                    }
                    }
                </Async>
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
    };

    handleChildChange = (newValue) => {
        this.setState({ selectedChild: newValue });
    };

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