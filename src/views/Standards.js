import React from 'react';
import { Banner, Button, FormLayout, Modal, Page, TextField } from '@shopify/polaris';
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
      showStandardsModal: false,
      standardFieldValue: "",
      capacityFieldValue: "",
      isLoaded: false,
      standardFieldValidationError: "",
      capacityFieldValidationError: "",
      showBranchSelectionWarning: false
    };
    this.renderButtons = this.renderButtons.bind(this);
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
        url: "http://www.srmheavens.com/erp/class/",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        }
      }).then(response => response.data).then(data => {
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ standard: tableData[i].class, capacity: tableData[i].classCapacity, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    } else {
      var data = {
        branch: this.props.branch
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
        var tableData = data;
        var rows = [];
        for (var i = 0; i < tableData.length; i++) {
          rows.push({ standard: tableData[i].class, capacity: tableData[i].classCapacity, branch: tableData[i].branch });
        }
        this.setState({ rows: rows, isLoaded: true });
      });
    }
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
          {this.state.showBranchSelectionWarning ? <Banner
              title="Select branch in menu bar"
            ></Banner> : null}
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
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'standard',
      text: 'Standard',
      formatter: this.renderButtons,
      sort: true
    }, {
      dataField: 'capacity',
      text: 'Capacity',
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
        <div style={{ marginBottom: "1%", float: "right" }}><Button primary onClick={this.showStandardsModal}>Add Standard</Button></div>
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

  handleshowStandardsModalClose = () => {
    this.resetFields();
  };

  renderButtons(cell, row) {
    return (
      <a style={{ color: "#5c6ac4", cursor: "pointer" }} onClick={this.show.bind(this, cell, row)}>
        {cell}
      </a>
    );
  }
  show = (cell, row) => {
    this.props.history.push({
      pathname: '/standardProfile',
      state: { standard: row.standard, branch: row.branch }
    })
  }

  validate = () => {
    if (validator.isEmpty(this.state.standardFieldValue, { ignore_whitespace: true })) {
      var standardInvalid = true;
      this.setState({ standardFieldValidationError: "Standard cannot be empty" })
    }
    if (!validator.isNumeric(this.state.capacityFieldValue, { ignore_whitespace: true })) {
      var capacityInvalid = true;
      this.setState({ capacityFieldValidationError: "Capacity should be numeric" })
    }
    if (this.props.branch == "") {
      var branchInvalid = true;
      this.setState({ showBranchSelectionWarning: true })
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
      standardFieldValue: "",
      capacityFieldValue: "",
      standardFieldValidationError: "",
      capacityFieldValidationError: "",
      showBranchSelectionWarning: false
    });
  }
  showSubmitMessage = () => {
    var valid = this.validate();
    if (valid) {
      var data = {
        std: this.state.standardFieldValue,
        strength: this.state.capacityFieldValue,
        bName: this.props.branch
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