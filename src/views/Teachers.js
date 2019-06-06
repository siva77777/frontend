import React from 'react';
import { Button, FormLayout, Modal, Page, Select, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from 'axios';
import validator from 'validator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'


class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      branchOptions: [],
      showTeachersModal: false,
      isLoaded: false,
      selectedBranch: "",
      teacherNameFieldValue: "",
      teacherPhoneNumberFieldValue: "",
      teacherSpecializationFieldValue: "",
      teacherNameFieldValidationError: "",
      teacherPhoneNumberFieldValidationError: "",
      teacherSpecializationFieldValidationError: "",
      branchSelectValidationError: ""
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
        url: "http://www.srmheavens.com/erp/teacher/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        }
      }).then(response => response.data).then(data => {
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ teacherID: tableData[i].teacherID, teacherName: tableData[i].teacherName, teacherPhoneNumber: tableData[i].teacherPhone, teacherSpecialization: tableData[i].tSpecialization, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    } else {
      var data = {
        branch: this.props.branch
      }
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/teacher/bteacher",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data).then(data => {
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ teacherID: tableData[i].teacherID, teacherName: tableData[i].teacherName, teacherPhoneNumber: tableData[i].teacherPhone, teacherSpecialization: tableData[i].tSpecialization, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    }
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
      this.setState({ branchOptions: options });
    });
  }

  render() {
    var modalMarkup;
    modalMarkup = (
      <Modal
        open={this.state.showTeachersModal}
        onClose={this.handleshowTeachersModalClose}
        title="Teacher Details"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Teacher Name"
                value={this.state.teacherNameFieldValue}
                onChange={this.handleTeacherNameFieldChange}
                type="text"
                error={this.state.teacherNameFieldValidationError}
              />
              <TextField
                label="Teacher phone number"
                value={this.state.teacherPhoneNumberFieldValue}
                onChange={this.handleTeacherPhoneNumberFieldChange}
                type="text"
                error={this.state.teacherPhoneNumberFieldValidationError}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Teacher Specialization"
                value={this.state.teacherSpecializationFieldValue}
                onChange={this.handleTeacherSpecializationFieldChange}
                type="text"
                error={this.state.teacherSpecializationFieldValidationError}
              />
              <Select
                label="Branch"
                options={this.state.branchOptions}
                onChange={this.handleBranchChange}
                value={this.state.selectedBranch}
                placeholder="Select Branch"
                error={this.state.branchSelectValidationError}
              />
            </FormLayout.Group>
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'teacherID',
      text: 'Teacher ID',
      sort: true
    },
    {
      dataField: 'teacherName',
      text: 'Teacher Name',
      sort: true
    }, {
      dataField: 'teacherPhoneNumber',
      text: 'Phone Number',
      sort: true
    }, {
      dataField: 'teacherSpecialization',
      text: 'Specialization',
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
        <div style={{ marginBottom: "1%", float: "right" }}><Button primary onClick={this.showTeachersModal}>Add Teacher</Button></div>
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
                      dataField: 'teacherID',
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
  showTeachersModal = () => {
    this.setState({ showTeachersModal: true });
  }

  handleTeacherNameFieldChange = (teacherNameFieldValue) => {
    this.setState({ teacherNameFieldValue, teacherNameFieldValidationError: "" });
  };

  handleTeacherPhoneNumberFieldChange = (teacherPhoneNumberFieldValue) => {
    this.setState({ teacherPhoneNumberFieldValue, teacherPhoneNumberFieldValidationError: "" });
  };

  handleTeacherSpecializationFieldChange = (teacherSpecializationFieldValue) => {
    this.setState({ teacherSpecializationFieldValue, teacherSpecializationFieldValidationError: "" });
  };

  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue, branchSelectValidationError: "" });
  };

  validate = () => {
    if (validator.isEmpty(this.state.teacherNameFieldValue, { ignore_whitespace: true })) {
      var teacherNameInvalid = true;
      this.setState({ teacherNameFieldValidationError: "Teacher Name cannot be empty" })
    }
    if (!validator.isMobilePhone(this.state.teacherPhoneNumberFieldValue) || this.state.teacherPhoneNumberFieldValue.length !== 10) {
      var teacherPhoneNumberInvalid = true;
      this.setState({ teacherPhoneNumberFieldValidationError: "Teacher phone number is invalid" })
    }
    if (validator.isEmpty(this.state.teacherSpecializationFieldValue, { ignore_whitespace: true })) {
      var teacherSpecializationInvalid = true;
      this.setState({ teacherSpecializationFieldValidationError: "Teacher Specialization cannot be empty" })
    }
    if (!this.state.selectedBranch) {
      var branchInvalid = true;
      this.setState({ branchSelectValidationError: "Branch is required" })
    }
    if (teacherNameInvalid || teacherPhoneNumberInvalid || teacherSpecializationInvalid) {
      return false;
    } else {
      return true;
    }
  }

  handleshowTeachersModalClose = () => {
    this.resetFields();
  };

  resetFields = () => {
    this.setState({
      showTeachersModal: false,
      selectedBranch: "",
      teacherNameFieldValue: "",
      teacherPhoneNumberFieldValue: "",
      teacherSpecializationFieldValue: "",
      teacherNameFieldValidationError: "",
      teacherPhoneNumberFieldValidationError: "",
      teacherSpecializationFieldValidationError: "",
      branchSelectValidationError: ""
    });
  }
  showSubmitMessage = () => {
    var valid = this.validate();
    if (valid) {
      var data = {
        tName: this.state.teacherNameFieldValue,
        tPhone: this.state.teacherPhoneNumberFieldValue,
        tSpecialization: this.state.teacherSpecializationFieldValue,
        bName: this.state.selectedBranch
      };
      this.resetFields();
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/teacher/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data)
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          this.fetchData();
          this.setState({ showTeachersModal: false });
        })
        .catch(error => console.error('Error:', error));
    }
  }
}

export default Teachers;