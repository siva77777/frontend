import React from 'react';
import { Button, FormLayout, Modal, Page, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
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
      selected: 'busName'
    };
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/bus/",
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
  }

  render() {
    var modalMarkup;
    modalMarkup = (
      <Modal
        open={this.state.showBusesModal}
        onClose={this.handleShowBusesModalClose}
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
                label="Bus Name"
                value={this.state.busNameFieldValue}
                onChange={this.handleBusNameFieldChange}
                type="text"
              />
              <TextField
                label="Bus Capacity"
                value={this.state.busCapacityFieldValue}
                onChange={this.handleBusCapacityFieldChange}
                type="text"
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Driver name"
                value={this.state.driverNameFieldValue}
                onChange={this.handleDriverNameFieldChange}
                type="text"
              />
              <TextField
                label="Driver phone number"
                value={this.state.driverPhoneNumberFieldValue}
                onChange={this.handleDriverPhoneNumberFieldChange}
                type="text"
              />
            </FormLayout.Group>
            <TextField
              label="Bus Route"
              value={this.state.busRouteFieldValue}
              onChange={this.handleBusRouteFieldChange}
              type="text"
            />
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
    this.setState({ busNameFieldValue });
  };

  handleBusCapacityFieldChange = (busCapacityFieldValue) => {
    this.setState({ busCapacityFieldValue });
  };

  handleDriverNameFieldChange = (driverNameFieldValue) => {
    this.setState({ driverNameFieldValue });
  };

  handleDriverPhoneNumberFieldChange = (driverPhoneNumberFieldValue) => {
    this.setState({ driverPhoneNumberFieldValue });
  };

  handleBusRouteFieldChange = (busRouteFieldValue) => {
    this.setState({ busRouteFieldValue });
  };

  handleShowBusesModalClose = () => {
    this.resetFields();
  };

  resetFields = () => {
    this.setState({
      showBusesModal: false,
      busNameFieldValue: "",
      busCapacityFieldValue: "",
      driverNameFieldValue: "",
      driverPhoneNumberFieldValue: "",
      busRouteFieldValue: ""
    });
  }
  showSubmitMessage = () => {
    var data = {
      bName: this.state.busNameFieldValue,
      bRoute: this.state.busRouteFieldValue,
      bCapacity: this.state.busCapacityFieldValue,
      bDriver: this.state.driverNameFieldValue,
      dPhone: this.state.driverPhoneNumberFieldValue
    };
    this.resetFields();

    Axios({
      method: "post",
      url: "http://www.srmheavens.com/bus/",
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

export default Buses;