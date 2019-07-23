import React from 'react';
import { Banner, Button, FormLayout, Modal, Page, TextField } from '@shopify/polaris';
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
      isLoaded: false,
      showBusesModal: false,
      busNameFieldValue: "",
      busCapacityFieldValue: "",
      driverNameFieldValue: "",
      driverPhoneNumberFieldValue: "",
      busRouteFieldValue: "",
      selected: 'busName',
      busNameFieldValidationError: "",
      busCapacityFieldValidationError: "",
      driverNameFieldValidationError: "",
      driverPhoneNumberFieldValidationError: "",
      busRouteFieldValidationError: "",
      showBranchSelectionWarning: false
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
        url: "http://www.srmheavens.com/erp/bus/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        }
      }).then(response => response.data).then(data => {
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ busName: tableData[i].busName, capacity: tableData[i].busCapacity, busRoute: tableData[i].busRoute, driver: tableData[i].driverName, phone: tableData[i].driverPhone, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    } else {
      var data = {
        branch: this.props.branch
      }
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/bus/bbus",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data).then(data => {
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ busName: tableData[i].busName, capacity: tableData[i].busCapacity, busRoute: tableData[i].busRoute, driver: tableData[i].driverName, phone: tableData[i].driverPhone, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    }
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
          {this.state.showBranchSelectionWarning ? <Banner
              title="Select branch in menu bar"
            ></Banner> : null}
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
      dataField: 'capacity',
      text: 'Capacity',
      sort: true
    }, {
      dataField: 'busRoute',
      text: 'Bus Route',
      sort: true
    }, {
      dataField: 'driver',
      text: 'Driver',
      sort: true
    }, {
      dataField: 'phone',
      text: 'Phone',
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
        <div style={{ marginBottom: "1%", float: "right" }}><Button primary onClick={this.showBusesModal}>Add Bus</Button></div>
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
                      dataField: 'busName',
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
    if (this.props.branch == "") {
      var branchInvalid = true;
      this.setState({ showBranchSelectionWarning: true });
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
      busNameFieldValidationError: "",
      busCapacityFieldValidationError: "",
      driverNameFieldValidationError: "",
      driverPhoneNumberFieldValidationError: "",
      busRouteFieldValidationError: "",
      showBranchSelectionWarning: false
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
        branchName: this.props.branch
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