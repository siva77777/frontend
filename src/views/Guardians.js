import React from 'react';
import { Button, Page } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'
import Axios from 'axios';
import { Route } from "react-router-dom";
import Hostels from './Hostels';


class Guardians extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            isLoaded: false
        };
        this.renderButtons = this.renderButtons.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.fetchData();
    }

    renderButtons(cell, row) {
        return (
            <a style={{ color: "#5c6ac4", cursor: "pointer" }} onClick={this.show.bind(this, cell, row)}>
                {cell}
            </a>
        );
    }
    show = (cell, row) => {
        this.props.history.push({
            pathname: '/studentProfile',
            state: { parentPhone: row.phone }
        })
    }

    fetchData() {
        if (this.props.branch == "") {
            Axios({
                method: "get",
                url: "http://www.srmheavens.com/erp/parents/",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.token
                }
            }).then(response => response.data).then(data => {
                var tableData = data;
                var rows = [];
                for (var i = 0; i < tableData.length; i++) {
                    if (tableData[i].place == "") {
                        tableData[i].place = "-";
                    }
                    rows.push({ student: tableData[i].studentFirst + " " + tableData[i].studentLast, father: tableData[i].fatherFirst + " " + tableData[i].fatherLast, place: tableData[i].place, phone: tableData[i].parentPhone });
                }
                this.setState({ rows: rows, isLoaded: true });
            });
        } else {
            var data = {
                branch: this.props.branch
            }
            Axios({
                method: "post",
                url: "http://www.srmheavens.com/erp/parents/bparents/",
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.token
                },
                data: data
            }).then(response => response.data).then(data => {
                var tableData = data;
                var rows = [];
                for (var i = 0; i < tableData.length; i++) {
                    rows.push({ student: tableData[i].studentFirst + " " + tableData[i].studentLast, father: tableData[i].fatherFirst + " " + tableData[i].fatherLast, place: tableData[i].place, phone: tableData[i].parentPhone });
                }
                this.setState({ rows: rows, isLoaded: true });
            });
        }
    }

    render() {
        const { SearchBar } = Search;

        const columns = [{
            dataField: 'father',
            text: 'Father',
            formatter: this.renderButtons,
            sort: true
        }, {
            dataField: 'student',
            text: 'Student',
            sort: true
        }, {
            dataField: 'place',
            text: 'Place',
            sort: true
        }, {
            dataField: 'phone',
            text: 'Parents number',
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
                                            dataField: 'father',
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

export default Guardians;