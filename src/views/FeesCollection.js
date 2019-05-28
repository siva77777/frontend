import React from 'react';
import { Page } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'


class FeesCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      subjectNameFieldValue: "",
      subjectCodeFieldValue: "",
      isLoaded: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/subject/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ subjectName: tableData[i].SCi_subjectName, subjectCode: tableData[i].SCi_subjectCode });
      }
      this.setState({ rows: rows, isLoaded: true });
    });
  }

  render() {
    const { SearchBar } = Search;

    const columns = [{
      dataField: 'subjectName',
      text: 'Subject Name',
      sort: true
    }, {
      dataField: 'subjectCode',
      text: 'Subject Code',
      sort: true
    }
    ];

    var abc = (
      <Page>
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

  handleSubjectNameFieldChange = (subjectNameFieldValue) => {
    this.setState({ subjectNameFieldValue });
  };

  handleSubjectCodeFieldChange = (subjectCodeFieldValue) => {
    this.setState({ subjectCodeFieldValue });
  };

  resetFields = () => {
    this.setState({
      subjectNameFieldValue: "",
      subjectCodeFieldValue: ""
    });
  }
  showSubmitMessage = () => {
    var data = {
      sName: this.state.subjectNameFieldValue,
      sCode: this.state.subjectCodeFieldValue,
    };
    this.resetFields();
    Axios({
      method: "post",
      url: "http://www.srmheavens.com/erp/subject/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      },
      data: data
    }).then(response => response.data)
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        this.fetchData();
      })
      .catch(error => console.error('Error:', error));
  }
}

export default FeesCollection;