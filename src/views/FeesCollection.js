import React from 'react';
import { Button, FormLayout, Modal, Page, Select, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import Axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

let standardFilter;

class FeesCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      standardOptions: [],
      showFeeCollectionModal: false,
      studentID: "",
      isLoaded: false,
      standardLoaded: false,
      selectedStandard: "",
      amountCollectedFieldValue: ""
    };
    this.renderDetailsButtons = this.renderDetailsButtons.bind(this);
    this.renderCollectFeesButtons = this.renderCollectFeesButtons.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/fph/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ name: tableData[i].fName + " " + tableData[i].lName, class: tableData[i].std, studentID: tableData[i].studentID, totalFee: tableData[i].totalFee, totalPaid: tableData[i].TotalPaid || 0, due: tableData[i].totalFee - tableData[i].TotalPaid || 0 });
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
      var options = [{ label: "All", value: "" }];
      for (var i = 0; i < data.length; i++) {
        options.push({ label: data[i].Ci_classStandard, value: data[i].Ci_classStandard });
      }
      this.setState({ standardOptions: options, standardLoaded: true });
    });
  }

  render() {
    var modalMarkup;
    modalMarkup = (
      <Modal
        open={this.state.showFeeCollectionModal}
        onClose={this.handleshowFeeCollectionModalClose}
        title="Subject Details"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Student ID"
              value={this.state.studentID}
              type="text"
              readOnly
            />
            <TextField
              label="Amount collected"
              value={this.state.amountCollectedFieldValue}
              onChange={this.handleAmountCollectedFieldChange}
              type="text"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    );
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'name',
      text: 'Student',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }, {
      dataField: 'class',
      text: 'Std',
      sort: true,
      filter: selectFilter({
        options: this.state.standardOptions,
        getFilter: (filter) => {
          standardFilter = filter;
        }
      }),
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      }
    }, {
      dataField: 'studentID',
      text: 'Student ID',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      }
    }, {
      dataField: 'totalFee',
      text: 'Total Fees',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      }
    }, {
      dataField: 'totalPaid',
      text: 'Total Paid',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      }
    }, {
      dataField: 'due',
      text: 'Due',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      }
    }, {
      dataField: 'details',
      text: 'Details',
      formatter: this.renderDetailsButtons,
      headerStyle: (colum, colIndex) => {
        return { width: "10%" };
      }
    }, {
      dataField: 'fee',
      text: 'Collect Fees',
      formatter: this.renderCollectFeesButtons,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    }
    ];

    var abc = (
      <Page>
        {modalMarkup}
        <div style={{ width: "100px" }}>
          <Select
            options={this.state.standardOptions}
            onChange={this.handleStandardChange}
            value={this.state.selectedStandard}
          />
        </div>
        <br />
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
                    filter={filterFactory()}
                    defaultSorted = {[{
                      dataField: 'name',
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
    if (this.state.isLoaded && this.state.standardLoaded) {
      return abc;
    } else {
      return null;
    }
  }

  handleStandardChange = (newValue) => {
    standardFilter(newValue);
    this.setState({ selectedStandard: newValue });
  }

  handleAmountCollectedFieldChange = (amountCollectedFieldValue) => {
    this.setState({ amountCollectedFieldValue });
  };

  renderDetailsButtons(cell, row) {
    return (
      <Button>Details</Button>
    );
  }

  renderCollectFeesButtons(cell, row) {
    return (
      <Button primary onClick={this.showFeeCollectionModal.bind(this, cell, row)}>Collect Fees</Button>
    );
  }

  showSubmitMessage = () => {
    var data = {
      sID: this.state.studentID,
      amtPaid: this.state.amountCollectedFieldValue
    };
    this.resetFields();
    Axios({
      method: "post",
      url: "http://www.srmheavens.com/erp/fph/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      },
      data: data
    }).then(response => response.data)
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        this.fetchData();
        this.setState({ showFeeCollectionModal: false });
      })
      .catch(error => console.error('Error:', error));
  }

  showFeeCollectionModal = (cell, row) => {
    this.setState({ showFeeCollectionModal: true, studentID: row.studentID });
  }

  handleshowFeeCollectionModalClose = () => {
    this.resetFields();
  }

  resetFields = () => {
    this.setState({
      showFeeCollectionModal: false,
      amountCollectedFieldValue: ""
    });
  }
}

export default FeesCollection;