import React from 'react';
import { Button, FormLayout, Modal, Page, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'


class Hostels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      isLoaded: false,
      showHostelsModal: false,
      hallNameFieldValue: "",
      hallCapacityFieldValue: "",
      hallWardenFieldValue: "",
      wardenPhoneNumberFieldValue: "",
      remarks: "",
    };
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/hostel/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      console.log(data, "22222");
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ hallName: tableData[i].Hi_hallName, hallCapacity: tableData[i].Hi_hallCapacity, hallWarden: tableData[i].Hi_hallWarden, wardenPhoneNumber: tableData[i].Hi_hallWardenPhone, remarks: tableData[i].Hi_hallRemarks });
      }
      this.setState({ rows: rows, isLoaded: true });
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
              />
              <TextField
                label="Hall Capacity"
                value={this.state.hallCapacityFieldValue}
                onChange={this.handleHallCapacityFieldChange}
                type="text"
              />
            </FormLayout.Group>
            <FormLayout.Group>
              <TextField
                label="Hall Warden"
                value={this.state.hallWardenFieldValue}
                onChange={this.handleHallWardenFieldChange}
                type="text"
              />
              <TextField
                label="Warden phone number"
                value={this.state.wardenPhoneNumberFieldValue}
                onChange={this.handleWardenPhoneNumberFieldChange}
                type="text"
              />
            </FormLayout.Group>
            <TextField
              label="Remarks"
              value={this.state.remarks}
              onChange={this.handleRemarksFieldChange}
              type="text"
            />
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
    this.setState({ hallNameFieldValue });
  };

  handleHallCapacityFieldChange = (hallCapacityFieldValue) => {
    this.setState({ hallCapacityFieldValue });
  };

  handleHallWardenFieldChange = (hallWardenFieldValue) => {
    this.setState({ hallWardenFieldValue });
  };

  handleWardenPhoneNumberFieldChange = (wardenPhoneNumberFieldValue) => {
    this.setState({ wardenPhoneNumberFieldValue });
  };

  handleRemarksFieldChange = (remarks) => {
    this.setState({ remarks });
  };

  handleShowHostelsModalClose = () => {
    this.resetFields();
  };

  resetFields = () => {
    this.setState({
      showHostelsModal: false,
      hallNameFieldValue: "",
      hallCapacityFieldValue: "",
      hallWardenFieldValue: "",
      wardenPhoneNumberFieldValue: "",
      remarks: "",
    });
  }
  showSubmitMessage = () => {
    var data = {
      hName: this.state.hallNameFieldValue,
      hCapacity: this.state.hallCapacityFieldValue,
      hWarden: this.state.hallWardenFieldValue,
      wPhone: this.state.wardenPhoneNumberFieldValue,
      hRemarks: this.state.remarks
    };
    this.resetFields();
    Axios({
      method: "post",
      url: "http://www.srmheavens.com/hostel/",
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

export default Hostels;