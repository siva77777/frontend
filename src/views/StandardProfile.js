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
import TimeTable from './TimeTable.jsx';


class StandardProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 2,
            isLoaded: false,
            rows: [],
            timeTableData: []
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
        var branch = this.props.history.location.state.branch;
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
            this.setState({ timeTableData: data, isLoaded: true });
        });
    }

    render() {
        const tabs = [
            {
                id: 'attendance',
                content: 'Attendance',
                panelID: 'attendance-content',
            },
            {
                id: 'performance',
                content: 'Performance',
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
                id: 'exams',
                content: 'Exams',
                panelID: 'exams-content',
            },
        ];
        if (this.state.selected == 2 ) {
            var abc = (
                <div className='timetable'>
                    <section className='timeWrapper'>
                        <div>9:00AM</div>
                        <div>10:00AM</div>
                        <div>11:00AM</div>
                        <div>12:00PM</div>
                        <div>1:00PM</div>
                        <div>2:00PM</div>
                        <div>3:00PM</div>
                        <div>4:00PM</div>
                        <div>5:00PM</div>
                    </section>
                    <section className='titleWrapper'>
                        <p className='timeColumn'><span>TIME</span></p>
                        <p className='monday'><span>MON</span></p>
                        <p className='tuesday'><span>TUE</span></p>
                        <p className='wednesday'><span>WED</span></p>
                        <p className='thursday'><span>THU</span></p>
                        <p className='friday'><span>FRI</span></p>
                        <p className='saturday'><span>SAT</span></p>
                    </section>
                    {this.state.timeTableData ? this.state.timeTableData.map(course =>
                        <TimeTable
                            course={course.SCi_subjectName}
                            day={course.Ctt_weekday}
                            startTime={course.Ctt_startTime}
                            endTime={course.Ctt_endTime}
                            teacher={course.Ti_teacherName}
                        />
                    ) : null}
                </div>
            );
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