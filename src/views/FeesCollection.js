import React from 'react';
import { Button, Card, FormLayout, Modal, Page, Select, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import Axios from 'axios';
import Async from "react-async";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

let standardFilter;
var feeHistoryComponent;

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
      amountCollectedFieldValue: "",
      admissionFee: "",
      labFee: "",
      busFee: "",
      hostelFee: "",
      miscellanousFee: "",
      concessionFee: "",
      totalFee: "",
      selectedTerm: "",
      showFeeHistory: false,
      termOptions: [{ label: "Select Term", value: "" }, { label: "Term 1", value: "Term1" }, { label: "Term 2", value: "Term2" }, { label: "Term 3", value: "Term3" },]
    };
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
      dataField: 'fee',
      formatter: this.renderCollectFeesButtons,
      headerStyle: (colum, colIndex) => {
        return { width: "15%" };
      },
    }
    ];

    const expandRow = {
      renderer: row => {
        return (
          <div>
            <Async promiseFn={this.showFeeDetails} row={row}>
              {({ data, error, isLoading }) => {
                if (data) {
                  return (
                    <div>
                      <div style={{ width: "fit-content" }}>
                        <Select
                          options={this.state.termOptions}
                          onChange={this.handleTermChange.bind(this, row)}
                          value={this.state.selectedTerm}
                        />
                      </div>
                      <br />
                      <Card title="FEE STRUCTURE" sectioned>
                        <div className="rulerParent">
                          <div className="feeType">Admission Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.admissionFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType">Lab Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.labFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType">Bus Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.busFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType">Hostel Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.hostelFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType">Miscellanous Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.miscellanousFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType">Concession Fee</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee">{data.concessionFee}</div>
                        </div>
                        <div className="rulerParent">
                          <div className="feeType" style={{ fontWeight: "bolder" }}>Total Fees</div>
                          <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
                          <div className="fee" style={{ fontWeight: "bolder" }}>{data.totalFee}</div>
                        </div>
                      </Card>
                    </div>
                  );
                }
              }
              }
            </Async>
            {this.state.showFeeHistory ? feeHistoryComponent : null}
          </div>
        )
      },
      showExpandColumn: true,
      expandColumnPosition: 'right',
      expandByColumnOnly: true,
      onlyOneExpanding: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        return null;
      },
      expandColumnRenderer: ({ expanded }) => {
        if (expanded) {
          return (
            <div className="feeDetails"><Button>Hide</Button></div>
          );
        }
        return (
          <div className="feeDetails"><Button>Details</Button></div>
        );
      }
    };

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
                    defaultSorted={[{
                      dataField: 'name',
                      order: 'asc'
                    }]}
                    keyField="studentID"
                    expandRow={expandRow}
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

  handleTermChange = (row, newValue) => {
    if (newValue !== "") {
      var data = {
        sID: row.studentID,
        term: newValue
      };
      Axios({
        method: "post",
        url: "http://www.srmheavens.com/erp/fph/td",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': this.props.token
        },
        data: data
      }).then(response => response.data)
        .then(response => { this.showHistoryDetails(newValue, response) })
        .catch(error => console.error('Error:', error));
    } else {
      this.setState({ showFeeHistory: false });
    }
    this.setState({ selectedTerm: newValue });
  }

  handleAmountCollectedFieldChange = (amountCollectedFieldValue) => {
    this.setState({ amountCollectedFieldValue });
  };

  renderCollectFeesButtons(cell, row) {
    return (
      <Button primary onClick={this.showFeeCollectionModal.bind(this, cell, row)}>Collect Fees</Button>
    );
  }

  showHistoryDetails(newValue, abc) {
    const feeHistoryColumns = [{
      dataField: 'date',
      text: 'Date',
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }, {
      dataField: 'term',
      text: 'Term',
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }, {
      dataField: 'termFee',
      text: 'Fee',
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }, {
      dataField: 'termPaid',
      text: 'Amount Paid',
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }, {
      dataField: 'termDue',
      text: 'Closing Due',
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      }
    }];
    if (newValue === "Term1") {
      var feeHistory = abc.t1History;
      var termFee = abc.term1Fee;
      var termPaid = abc.term1Paid;
      var termDue = abc.term1Due;
      var feeAmount = abc.term1Fee;
    } else if (newValue === "Term2") {
      var feeHistory = abc.t2History;
      var termFee = abc.term2Fee;
      var termPaid = abc.term2Paid;
      var termDue = abc.term2Due;
      var feeAmount = abc.term2Fee;
    } else if (newValue === "Term3") {
      var feeHistory = abc.t3History;
      var termFee = abc.term3Fee;
      var termPaid = abc.term3Paid;
      var termDue = abc.term3Due;
      var feeAmount = abc.term3Fee;
    }
    var feeHistoryData = [];
    for (var i = 0; i < feeHistory.length; i++) {
      var date = feeHistory[i].paidOn;
      var amountPaid = feeHistory[i].amountPaid;
      var amountdue = termFee - amountPaid;
      date = new Date(date);
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, 0);
      const dt = `${date.getDate()}`.padStart(2, 0);
      const stringDate = [year, month, dt].join("-");
      feeHistoryData.push({ date: stringDate, term: newValue, termFee: feeAmount, termPaid: amountPaid, termDue: amountdue });
      termFee = amountdue;
    }
    feeHistoryComponent = (
      <div>
        <br />
        <Card title="SUMMARY" sectioned>
          <div className="rulerParent">
            <div className="feeType">{newValue} Fee</div>
            <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
            <div className="fee">{feeAmount}</div>
          </div>
          <div className="rulerParent">
            <div className="feeType">{newValue} Paid</div>
            <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
            <div className="fee">{termPaid}</div>
          </div>
          <div className="rulerParent">
            <div className="feeType">{newValue} Due</div>
            <div style={{ flexGrow: 1 }}><hr className="ruler" /></div>
            <div className="fee">{termDue}</div>
          </div>
        </Card>
        <Card title="PAYMENTS" sectioned>
          <ToolkitProvider
            keyField="id"
            data={feeHistoryData}
            columns={feeHistoryColumns}
            search
          >
            {
              props => {
                return (
                  <div>
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
        </Card>
      </div>
    );
    this.setState({ showFeeHistory: true });
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

  showFeeDetails = (val) => {
    this.setState({ selectedTerm: "", showFeeHistory: false });
    var data = {
      sID: val.row.studentID
    };
    return Axios({
      method: "post",
      url: "http://www.srmheavens.com/erp/fph/fd",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      },
      data: data
    }).then(response => response.data)
      .then(response => response[0])
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