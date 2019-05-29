import React from 'react';
import { Button, FormLayout, Modal, Page, Select, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import validator from 'validator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'
import Axios from 'axios';


class Buses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      branchOptions: [],
      isLoaded: false,
      showBusesModal: false,
      busNameFieldValue: "",
      busCapacityFieldValue: "",
      driverNameFieldValue: "",
      driverPhoneNumberFieldValue: "",
      busRouteFieldValue: "",
      selected: 'busName',
      selectedBranch: "",
      busNameFieldValidationError: "",
      busCapacityFieldValidationError: "",
      driverNameFieldValidationError: "",
      driverPhoneNumberFieldValidationError: "",
      busRouteFieldValidationError: "",
      branchSelectValidationError: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/bus/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ busName: tableData[i].Bi_busName, route: tableData[i].Bi_busRoute, capacity: tableData[i].Bi_busCapacity, driver: tableData[i].Bi_busDriverName, phone: tableData[i].Bi_driverPhone });
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
        open={this.state.showBusesModal}
        onClose={this.handleShowBusesModalClose}
        title="Bus Details"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Bus Name"
                value={this.state.busNameFieldValue}
                onChange={this.handleBusNameFieldChange}
                type="text"
                error={this.state.busNameFieldValidationError}
              />
              <TextField
                label="Bus Capacity"
                value={this.state.busCapacityFieldValue}
                onChange={this.handleBusCapacityFieldChange}
                type="text"
                error={this.state.busCapacityFieldValidationError}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Driver name"
                value={this.state.driverNameFieldValue}
                onChange={this.handleDriverNameFieldChange}
                type="text"
                error={this.state.driverNameFieldValidationError}
              />
              <TextField
                label="Driver phone number"
                value={this.state.driverPhoneNumberFieldValue}
                onChange={this.handleDriverPhoneNumberFieldChange}
                type="text"
                error={this.state.driverPhoneNumberFieldValidationError}
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Bus Route"
                value={this.state.busRouteFieldValue}
                onChange={this.handleBusRouteFieldChange}
                type="text"
                error={this.state.busRouteFieldValidationError}
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
      dataField: 'busName',
      text: 'Bus Name',
      sort: true
    }, {
      dataField: 'route',
      text: 'Route',
      sort: true
    }, {
      dataField: 'capacity',
      text: 'Capacity',
      sort: true
    }, {
      dataField: 'driver',
      text: 'Driver',
      sort: true
    }, {
      dataField: 'phone',
      text: 'Phone',
      sort: true
    }
    ];

    var abc = (
      <Page>
        {modalMarkup}
        <div style={{ marginLeft: "89%", marginBottom: "1%" }}><Button primary onClick={this.showBusesModal}>Add Bus</Button></div>
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
  showBusesModal = () => {
    this.setState({ showBusesModal: true });
  }

  handleBusNameFieldChange = (busNameFieldValue) => {
    this.setState({ busNameFieldValue, busNameFieldValidationError: "" });
  };

  handleBusCapacityFieldChange = (busCapacityFieldValue) => {
    this.setState({ busCapacityFieldValue, busCapacityFieldValidationError: "" });
  };

  handleDriverNameFieldChange = (driverNameFieldValue) => {
    this.setState({ driverNameFieldValue, driverNameFieldValidationError: "" });
  };

  handleDriverPhoneNumberFieldChange = (driverPhoneNumberFieldValue) => {
    this.setState({ driverPhoneNumberFieldValue, driverPhoneNumberFieldValidationError: "" });
  };

  handleBusRouteFieldChange = (busRouteFieldValue) => {
    this.setState({ busRouteFieldValue, busRouteFieldValidationError: "" });
  };

  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue, branchSelectValidationError: "" });
  };

  handleShowBusesModalClose = () => {
    this.resetFields();
  };

  validate = () => {
    if (validator.isEmpty(this.state.busNameFieldValue, { ignore_whitespace: true })) {
      var busNameInvalid = true;
      this.setState({ busNameFieldValidationError: "Bus Name cannot be empty" })
    }
    if (!validator.isNumeric(this.state.busCapacityFieldValue, { ignore_whitespace: true })) {
      var busCapacityInvalid = true;
      this.setState({ busCapacityFieldValidationError: "Bus Capacity should be numeric" })
    }
    if (validator.isEmpty(this.state.driverNameFieldValue, { ignore_whitespace: true })) {
      var driverNameInvalid = true;
      this.setState({ driverNameFieldValidationError: "Driver Name cannot be empty" })
    }
    if (!validator.isMobilePhone(this.state.driverPhoneNumberFieldValue) || this.state.driverPhoneNumberFieldValue.length !== 10) {
      var driverPhoneNumberInvalid = true;
      this.setState({ driverPhoneNumberFieldValidationError: "Driver phone number is invalid" })
    }
    if (validator.isEmpty(this.state.busRouteFieldValue, { ignore_whitespace: true })) {
      var busRouteInvalid = true;
      this.setState({ busRouteFieldValidationError: "Bus Route cannot be empty" })
    }
    if (!this.state.selectedBranch) {
      var branchInvalid = true;
      this.setState({ branchSelectValidationError: "Branch is required" })
    }
    if (busNameInvalid || busCapacityInvalid || driverNameInvalid || driverPhoneNumberInvalid || busRouteInvalid || branchInvalid) {
      return false;
    } else {
      return true;
    }
  }

  resetFields = () => {
    this.setState({
      showBusesModal: false,
      busNameFieldValue: "",
      busCapacityFieldValue: "",
      driverNameFieldValue: "",
      driverPhoneNumberFieldValue: "",
      busRouteFieldValue: "",
      selectedBranch: "",
      busNameFieldValidationError: "",
      busCapacityFieldValidationError: "",
      driverNameFieldValidationError: "",
      driverPhoneNumberFieldValidationError: "",
      busRouteFieldValidationError: "",
      branchSelectValidationError: ""
    });
  }
  showSubmitMessage = () => {
    var valid = this.validate();
    if (valid) {
      var data = {
        bName: this.state.busNameFieldValue,
        bRoute: this.state.busRouteFieldValue,
        bCapacity: this.state.busCapacityFieldValue,
        bDriver: this.state.driverNameFieldValue,
        dPhone: this.state.driverPhoneNumberFieldValue,
        branchName: this.state.selectedBranch
      };
      this.resetFields();

      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/bus/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data)
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          this.fetchData();
          this.setState({ showBusesModal: false });
        })
        .catch(error => console.error('Error:', error));
    }
  }
}

export default Buses;