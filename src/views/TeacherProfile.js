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


class TeacherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: 2,
            isLoaded: false,
            classLoaded: false,
            branchLoaded: false,
            subjectLoaded: false,
            showClassesModal: false,
            rows: [],
            selectedBranch: "",
            selectedClass: "",
            selectedSubject: "",
            classSelectValidationError: ""
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        var teacherID = this.props.history.location.state.teacherID;
        var data = {
            tID: teacherID
        }
        Axios({
            method: "post",
            url: "http://www.srmheavens.com/erp/teacher/tclasses/",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.props.token
            },
            data: data
        }).then(response => response.data).then(data => {
            var tableData = data;
            var rows = [];
            for (var i = 0; i < tableData.length; i++) {
                rows.push({ class: tableData[i].classSubject, strength: tableData[i].strength, branch: tableData[i].branch });
            }
            this.setState({ rows: rows, isLoaded: true });
        });
        Axios({
            method: "get",
            url: "http://www.srmheavens.com/erp/class/",
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.token
            }
          }).then(response => response.data).then(data => {
            var options = [];
            for (var i = 0; i < data.length; i++) {
              options.push({ label: data[i].class, value: data[i].class });
            }
            this.setState({ classOptions: options, classLoaded: true });
          });
          Axios({
            method: "get",
            url: "http://www.srmheavens.com/erp/branch/",
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.token
            }
          }).then(response => response.data).then(data => {
            var options = [];
            for (var i = 0; i < data.length; i++) {
              options.push({ label: data[i].SBi_branchName, value: data[i].SBi_branchName });
            }
            this.setState({ branchOptions: options, branchLoaded: true });
          });
          Axios({
            method: "get",
            url: "http://www.srmheavens.com/erp/subject/",
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': this.props.token
            }
          }).then(response => response.data).then(data => {
            var options = [];
            for (var i = 0; i < data.length; i++) {
              options.push({ label: data[i].SCi_subjectName, value: data[i].SCi_subjectName });
            }
            this.setState({ subjectOptions: options, subjectLoaded: true });
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
            var modalMarkup;
            console.log(this.state.classOptions, "44444444");
            modalMarkup = (
                <Modal
                    open={this.state.showClassesModal}
                    onClose={this.handleShowClassesModalClose}
                    title="Complaint"
                    primaryAction={{
                        content: 'Submit',
                        onAction: this.showClassSubmitMessage,
                    }}
                >
                    <Modal.Section>
                        <FormLayout>
                            <TextField
                                label="Teacher ID"
                                value={this.props.history.location.state.teacherID}
                                type="text"
                                readOnly
                            />
                            <Select
                                label="Branch"
                                options={this.state.branchOptions}
                                onChange={this.handleBranchChange}
                                value={this.state.selectedBranch}
                                placeholder="Select Branch"
                                error={this.state.branchSelectValidationError}
                            />
                            <Select
                                label="Class"
                                options={this.state.classOptions}
                                onChange={this.handleClassChange}
                                value={this.state.selectedClass}
                                placeholder="Select Class"
                                error={this.state.classSelectValidationError}                          
                            />
                            <Select
                                label="Subject"
                                options={this.state.subjectOptions}
                                onChange={this.handleSubjectChange}
                                value={this.state.selectedSubject}
                                placeholder="Select Subject"
                            />
                        </FormLayout>
                    </Modal.Section>
                </Modal>
            );


            const { SearchBar } = Search;


            const columns = [{
                dataField: 'class',
                text: 'Class',
                sort: true
            }, {
                dataField: 'strength',
                text: 'Strength',
                sort: true
            }, {
                dataField: 'branch',
                text: 'Branch',
                sort: true
            }
            ];
            var abc = (
                <Page>
                    {modalMarkup}
                    <div style={{ marginBottom: "1%", float: "right" }}><Button primary onClick={this.showClassesModal}>Add Class</Button></div>
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
                                                dataField: 'class',
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
        } else if (this.state.selected == 5) {
            
        } else if (this.state.selected == 8) {
            
        } else {
            var abc = (<div>In progress</div>);
        }
        if (this.state.isLoaded && this.state.classLoaded && this.state.branchLoaded && this.state.subjectLoaded) {
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

    showClassesModal = () => {
        this.setState({ showClassesModal: true });
    }

    handleShowClassesModalClose = () => {
        this.resetClassesFields();
    }

    resetClassesFields = () => {
        this.setState({showClassesModal: false, selectedBranch: "", selectedClass: "", selectedSubject: "", classSelectValidationError: ""});
    }

    handleClassChange = (newValue) => {
        if (this.state.selectedBranch == "") {
          this.setState({ classSelectValidationError: "Select branch first" })
        } else {
          this.setState({ selectedClass: newValue, classSelectValidationError: "" });
        }
    }

    handleSubjectChange = (newValue) => {
        this.setState({ selectedSubject: newValue});
    }
    
      handleBranchChange = (newValue) => {
        var data = {
          branch: newValue
        }
        Axios({
          method: "post",
          url: "http://www.srmheavens.com/erp/class/bclass/",
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': this.props.token
          },
          data: data
        }).then(response => response.data).then(data => {
          var options = [];
          for (var i = 0; i < data.length; i++) {
            options.push({ label: data[i].class, value: data[i].class });
          }
          this.setState({ classOptions: options, selectedBranch: newValue, classSelectValidationError: "" });
        });
      };
}

export default TeacherProfile;