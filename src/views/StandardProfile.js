import React from 'react';
import Axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import '../styles.css';
import { Button, Card, Layout, FormLayout, Modal, Page, Select, Tabs, TextField } from '@shopify/polaris';


class StandardProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 2,
            isLoaded: false,
            rows: []
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.fetchData();
    }

    fetchData() {
        var standard = this.props.history.location.state.standard;
        var branch = this.props.branch;
        var data = {
            branch: branch,
            std: standard
        }
        Axios({
            method: "post",
            url: "http://www.srmheavens.com/erp/classtt/ctt",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            data: data
        }).then(response => response.data).then(data => {
            var tableData = data;
            var rows = [];
            console.log(data, "2222222");
            // for (var i = 0; i < tableData.length; i++) {
            //     rows.push({ class: tableData[i].classSubject, strength: tableData[i].strength, branch: tableData[i].branch });
            // }
            // this.setState({ rows: rows, isLoaded: true });
        });
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
                id: 'holidays',
                content: 'Holidays',
                panelID: 'holidays-content',
            },
            {
                id: 'leaves',
                content: 'Leaves',
                panelID: 'leaves-content',
            }
        ];
        if (this.state.selected == 2) {
           
        } else if (this.state.selected == 5) {
            
        } else if (this.state.selected == 8) {
            
        } else {
            var abc = (<div>In progress</div>);
        }
        if (this.state.isLoaded) {
            return (
                <div style={{ marginTop: 20, marginLeft: 10 }}>
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
}

export default StandardProfile;