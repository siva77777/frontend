import React from 'react';
import { Page } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'
import Axios from 'axios';

class Complaints extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            isLoaded: false
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.fetchData();
    }

    fetchData() {
        if (this.props.branch == "") {
            Axios({
                method: "get",
                url: "http://www.srmheavens.com/erp/complaint/",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.token
                }
            }).then(response => response.data).then(data => {
                var tableData = data;
                var rows = [];
                for (var i = 0; i < tableData.length; i++) {
                    var date = tableData[i].raisedOn
                    date = new Date(date);
                    const year = date.getFullYear();
                    const month = `${date.getMonth() + 1}`.padStart(2, 0);
                    const dt = `${date.getDate()}`.padStart(2, 0);
                    const stringDate = [year, month, dt].join("-");
                    rows.push({ studentID: tableData[i].studentID, studentName: tableData[i].studentFName + " " + tableData[i].studentLName, parentName: tableData[i].fatherFName + " " + tableData[i].fatherLName, phone: tableData[i].parentPhone, complaintRaised: tableData[i].complaintRaised, date: stringDate });
                }
                this.setState({ rows: rows, isLoaded: true });
            });
        } else {
            var data = {
                branch: this.props.branch
            }
            Axios({
                method: "post",
                url: "http://www.srmheavens.com/erp/complaint/bcomplaints/",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.token
                },
                data: data
            }).then(response => response.data).then(data => {
                var tableData = data;
                var rows = [];
                for (var i = 0; i < tableData.length; i++) {
                    var date = tableData[i].raisedOn
                    date = new Date(date);
                    const year = date.getFullYear();
                    const month = `${date.getMonth() + 1}`.padStart(2, 0);
                    const dt = `${date.getDate()}`.padStart(2, 0);
                    const stringDate = [year, month, dt].join("-");
                    rows.push({ studentID: tableData[i].studentID, studentName: tableData[i].studentFName + " " + tableData[i].studentLName, parentName: tableData[i].fatherFName + " " + tableData[i].fatherLName, phone: tableData[i].parentPhone, complaintRaised: tableData[i].complaintRaised, date: stringDate });
                }
                this.setState({ rows: rows, isLoaded: true });
            });
        }
    }

    render() {
        const { SearchBar } = Search;

        const columns = [{
            dataField: 'studentID',
            text: 'Student ID',
            sort: true
        }, {
            dataField: 'studentName',
            text: 'Name',
            sort: true
        }, {
            dataField: 'parentName',
            text: 'Parent',
            sort: true
        }, {
            dataField: 'phone',
            text: 'Phone',
            sort: true
        }, {
            dataField: 'complaintRaised',
            text: 'Complaint',
            sort: true
        }, {
            dataField: 'date',
            text: 'Date',
            sort: true
        }
        ];

        var abc = (
            <Page>
                <ToolkitProvider
                    keyField="id"
                    data={this.state.rows}
                    columns={columns}
                    search
                >
                    {
                        props => {
                            return (
                                <div>
                                    <SearchBar {...props.searchProps} style={{ height: "34px", padding: "6px 12px" }} placeholder="Search Units" />
                                    <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory()}
                                        bootstrap4
                                        defaultSorted={[{
                                            dataField: 'studentID',
                                            order: 'asc'
                                        }]}
                                    />
                                </div>
                            )
                        }
                    }
                </ToolkitProvider>
            </Page>
        );
        if (this.state.isLoaded) {
            return abc;
        } else {
            return null;
        }
    }
}

export default Complaints;