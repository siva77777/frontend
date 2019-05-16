import React from 'react';
import { Button, FormLayout, Modal, Page, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import MyCourses from './timetable/MyCourses.jsx';

class Standards extends React.Component {
  constructor(props) {
    super(props);
    this.class = "";
    this.state = {
      rows: [],
      showStandardsModal: false,
      standardFieldValue: "",
      capacityFieldValue: "",
      showTimeTable: false,
      isLoaded: false
    };
    this.renderButtons = this.renderButtons.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/class/",
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
  }

  render() {
    var modalMarkup;
    modalMarkup = (
      <Modal
        open={this.state.showStandardsModal}
        onClose={this.handleshowStandardsModalClose}
        title="Heading"
        primaryAction={{
          content: 'Submit',
          onAction: this.showSubmitMessage,
        }}
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Standard"
              value={this.state.standardFieldValue}
              onChange={this.handleStandardFieldChange}
              type="text"
            />
            <TextField
              label="Capacity"
              value={this.state.capacityFieldValue}
              onChange={this.handleCapacityFieldChange}
              type="text"
            />
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
                  />
                </div>
              )
            }
          }
        </ToolkitProvider>
      </Page>
    );

    if (this.state.showTimeTable) {
      return <MyCourses />;
    } else if (this.state.isLoaded) {
      return abc;
    } else {
      return null;
    }
  }
  showStandardsModal = () => {
    this.setState({ showStandardsModal: true });
  }

  handleStandardFieldChange = (standardFieldValue) => {
    this.setState({ standardFieldValue });
  };

  handleCapacityFieldChange = (capacityFieldValue) => {
    this.setState({ capacityFieldValue });
  };

  handleshowStandardsModalClose = () => {
    this.resetFields();
  };

  resetFields = () => {
    this.setState({
      showStandardsModal: false,
      standardFieldValue: "",
      capacityFieldValue: "",
    });
  }
  showSubmitMessage = () => {
    var data = {
      std: this.state.standardFieldValue,
      strength: this.state.capacityFieldValue,
    };
    this.resetFields();
    Axios({
      method: "post",
      url: "http://www.srmheavens.com/class/",
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
  renderButtons(cell, row) {
    console.log(this, this.show, "dsadsad");
    return (
      <a style={{ color: "blue", cursor: "pointer" }} onClick={this.show.bind(this, cell, row)}>
        {cell}
      </a>
    );
  }
  show = (cell, row) => {
    this.class = cell;
    this.setState({ showTimeTable: true })
  }
}

export default Standards;