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
import '../styles.css';

class Standards extends React.Component {
  constructor(props) {
    super(props);
    this.class = "";
    this.state = {
      rows: [],
      branchOptions: [],
      showStandardsModal: false,
      standardFieldValue: "",
      capacityFieldValue: "",
      isLoaded: false,
      selectedBranch: "",
      standardFieldValidationError: "",
      capacityFieldValidationError: "",
      branchSelectValidationError: ""
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/class/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ standard: tableData[i].Ci_classStandard, capacity: tableData[i].Ci_classCapacity });
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
        open={this.state.showStandardsModal}
        onClose={this.handleshowStandardsModalClose}
        title="Standard Details"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="Standard"
                value={this.state.standardFieldValue}
                onChange={this.handleStandardFieldChange}
                type="text"
                error={this.state.standardFieldValidationError}
              />
              <TextField
                label="Capacity"
                value={this.state.capacityFieldValue}
                onChange={this.handleCapacityFieldChange}
                type="text"
                error={this.state.capacityFieldValidationError}
              />
            </FormLayout.Group>
            <Select
              label="Branch"
              options={this.state.branchOptions}
              onChange={this.handleBranchChange}
              value={this.state.selectedBranch}
              placeholder="Select Branch"
              error={this.state.branchSelectValidationError}
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'standard',
      text: 'Standard',
      sort: true
    }, {
      dataField: 'capacity',
      text: 'Capacity',
      sort: true
    }
    ];

    var abc = (
      <Page>
        {modalMarkup}
        <div style={{ marginLeft: "89%", marginBottom: "1%" }}><Button primary onClick={this.showStandardsModal}>Add Standard</Button></div>
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
                    defaultSorted = {[{
                      dataField: 'standard',
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
  showStandardsModal = () => {
    this.setState({ showStandardsModal: true });
  }

  handleStandardFieldChange = (standardFieldValue) => {
    this.setState({ standardFieldValue, standardFieldValidationError: "" });
  };

  handleCapacityFieldChange = (capacityFieldValue) => {
    this.setState({ capacityFieldValue, capacityFieldValidationError: "" });
  };

  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue, branchSelectValidationError: "" });
  };

  handleshowStandardsModalClose = () => {
    this.resetFields();
  };

  validate = () => {
    if (validator.isEmpty(this.state.standardFieldValue, { ignore_whitespace: true })) {
      var standardInvalid = true;
      this.setState({ standardFieldValidationError: "Standard cannot be empty" })
    }
    if (!validator.isNumeric(this.state.capacityFieldValue, { ignore_whitespace: true })) {
      var capacityInvalid = true;
      this.setState({ capacityFieldValidationError: "Capacity should be numeric" })
    }
    if (!this.state.selectedBranch) {
      var branchInvalid = true;
      this.setState({ branchSelectValidationError: "Branch is required" })
    }
    if (standardInvalid || capacityInvalid || branchInvalid) {
      return false;
    } else {
      return true;
    }
  }

  resetFields = () => {
    this.setState({
      showStandardsModal: false,
      selectedBranch: "",
      standardFieldValue: "",
      capacityFieldValue: "",
      standardFieldValidationError: "",
      capacityFieldValidationError: "",
      branchSelectValidationError: ""
    });
  }
  showSubmitMessage = () => {
    var valid = this.validate();
    if (valid) {
      var data = {
        std: this.state.standardFieldValue,
        strength: this.state.capacityFieldValue,
        bName: this.state.selectedBranch
      };
      this.resetFields();
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/class/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data)
        .then(response => {
          console.log('Success:', JSON.stringify(response));
          this.fetchData();
          this.setState({ showStandardsModal: false });
        })
        .catch(error => console.error('Error:', error));
    }
  }
}

export default Standards;