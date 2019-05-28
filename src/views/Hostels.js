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


class Hostels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      branchOptions: [],
      isLoaded: false,
      showHostelsModal: false,
      hallNameFieldValue: "",
      hallCapacityFieldValue: "",
      hallWardenFieldValue: "",
      wardenPhoneNumberFieldValue: "",
      selectedBranch: "",
      remarks: "",
      hallNameFieldValidationError: "",
      hallCapacityFieldValidationError: "",
      hallWardenFieldValidationError: "",
      wardenPhoneNumberValidationError: "",
      branchSelectValidationError: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/hostel/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ hallName: tableData[i].Hi_hallName, hallCapacity: tableData[i].Hi_hallCapacity, hallWarden: tableData[i].Hi_hallWarden, wardenPhoneNumber: tableData[i].Hi_hallWardenPhone, remarks: tableData[i].Hi_hallRemarks });
      }
      this.setState({ rows: rows, isLoaded: true });
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
      this.setState({ branchOptions: options });
    });
  }

  render() {
    var modalMarkup;
    modalMarkup = (
      <Modal
        open={this.state.showHostelsModal}
        onClose={this.handleShowHostelsModalClose}
        title="Heading"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Hall Name"
                value={this.state.hallNameFieldValue}
                onChange={this.handleHallNameFieldChange}
                type="text"
                error={this.state.hallNameFieldValidationError}
              />
              <TextField
                label="Hall Capacity"
                value={this.state.hallCapacityFieldValue}
                onChange={this.handleHallCapacityFieldChange}
                type="text"
                error={this.state.hallCapacityFieldValidationError}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Hall Warden"
                value={this.state.hallWardenFieldValue}
                onChange={this.handleHallWardenFieldChange}
                type="text"
                error={this.state.hallWardenFieldValidationError}
              />
              <TextField
                label="Warden phone number"
                value={this.state.wardenPhoneNumberFieldValue}
                onChange={this.handleWardenPhoneNumberFieldChange}
                type="text"
                error={this.state.wardenPhoneNumberValidationError}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <Select
                label="Branch"
                options={this.state.branchOptions}
                onChange={this.handleBranchChange}
                value={this.state.selectedBranch}
                placeholder="Select Branch"
                error={this.state.branchSelectValidationError}
              />
              <TextField
                label="Remarks"
                value={this.state.remarks}
                onChange={this.handleRemarksFieldChange}
                type="text"
              />
            </FormLayout.Group>
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'hallName',
      text: 'Hall Name',
      sort: true
    }, {
      dataField: 'hallCapacity',
      text: 'Hall Capacity',
      sort: true
    }, {
      dataField: 'hallWarden',
      text: 'Hall Warden',
      sort: true
    }, {
      dataField: 'wardenPhoneNumber',
      text: 'Warden Phone Number',
      sort: true
    }, {
      dataField: 'remarks',
      text: 'Remarks',
      sort: true
    }
    ];

    var abc = (
      <Page>
        {modalMarkup}
        <div style={{ marginLeft: "89%", marginBottom: "1%" }}><Button primary onClick={this.showHostelsModal}>Add Hostel</Button></div>
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
  showHostelsModal = () => {
    this.setState({ showHostelsModal: true });
  }

  handleHallNameFieldChange = (hallNameFieldValue) => {
    this.setState({ hallNameFieldValue, hallNameFieldValidationError: "" });
  };

  handleHallCapacityFieldChange = (hallCapacityFieldValue) => {
    this.setState({ hallCapacityFieldValue, hallCapacityFieldValidationError: "" });
  };

  handleHallWardenFieldChange = (hallWardenFieldValue) => {
    this.setState({ hallWardenFieldValue, hallWardenFieldValidationError: "" });
  };

  handleWardenPhoneNumberFieldChange = (wardenPhoneNumberFieldValue) => {
    this.setState({ wardenPhoneNumberFieldValue, wardenPhoneNumberValidationError: "" });
  };

  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue, branchSelectValidationError: "" });
  };

  handleRemarksFieldChange = (remarks) => {
    this.setState({ remarks });
  };

  handleShowHostelsModalClose = () => {
    this.resetFields();
  };

  validate = () => {
    if (validator.isEmpty(this.state.hallNameFieldValue, { ignore_whitespace: true })) {
      var hallNameInvalid = true;
      this.setState({ hallNameFieldValidationError: "Hall Name cannot be empty" })
    }
    if (!validator.isNumeric(this.state.hallCapacityFieldValue, { ignore_whitespace: true })) {
      var hallCapacityInvalid = true;
      this.setState({ hallCapacityFieldValidationError: "Hall Capacity should be numeric" })
    }
    if (validator.isEmpty(this.state.hallWardenFieldValue, { ignore_whitespace: true })) {
      var hallWardenInvalid = true;
      this.setState({ hallWardenFieldValidationError: "Hall Warden cannot be empty" })
    }
    if (!validator.isMobilePhone(this.state.wardenPhoneNumberFieldValue) || this.state.wardenPhoneNumberFieldValue.length !== 10) {
      var wardenPhoneNumberInvalid = true;
      this.setState({ wardenPhoneNumberValidationError: "Warden phone number is invalid" })
    }
    if (!this.state.selectedBranch) {
      var branchInvalid = true;
      this.setState({ branchSelectValidationError: "Branch is required" })
    }
    if (hallNameInvalid || hallCapacityInvalid || hallWardenInvalid || wardenPhoneNumberInvalid || branchInvalid) {
      return false;
    } else {
      return true;
    }
  }

  resetFields = () => {
    this.setState({
      showHostelsModal: false,
      hallNameFieldValue: "",
      hallCapacityFieldValue: "",
      hallWardenFieldValue: "",
      wardenPhoneNumberFieldValue: "",
      remarks: "",
      selectedBranch: "",
      hallNameFieldValidationError: "",
      hallCapacityFieldValidationError: "",
      hallWardenFieldValidationError: "",
      wardenPhoneNumberValidationError: "",
      branchSelectValidationError: ""
    });
  }
  showSubmitMessage = () => {
    var valid = this.validate();
    if (valid) {
      var data = {
        hName: this.state.hallNameFieldValue,
        hCapacity: this.state.hallCapacityFieldValue,
        hWarden: this.state.hallWardenFieldValue,
        wPhone: this.state.wardenPhoneNumberFieldValue,
        bName: this.state.selectedBranch,
        hRemarks: this.state.remarks
      };
      this.resetFields();
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/hostel/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data)
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          this.fetchData();
          this.setState({ showHostelsModal: false });
        })
        .catch(error => console.error('Error:', error));
    }
  }
}

export default Hostels;