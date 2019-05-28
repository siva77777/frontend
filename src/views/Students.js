import React from 'react';
import { Button, FormLayout, Modal, Page, Popover, RadioButton, Select, TextField } from '@shopify/polaris';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Axios from 'axios';
import validator from 'validator';
import Calendar from 'react-calendar';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css'

var _MISCELLANOUS_FEE = 15000;
var _ADMISSION_FEE = 15000;
var _BUS_FEE = 20000;
var _HOSTEL_FEE = 0;
var _LAB_FEE = 20000;
var _CONCESSION_FEE = 0;
class Students extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      classOptions: [],
      branchOptions: [],
      busNameOptions: [],
      hallOptions: [],
      showStudentsModal: false,
      showFirstPage: true,
      showSecondPage: false,
      showThirdPage: false,
      date: new Date(),
      active: false,
      firstNameFieldValue: "",
      lastNameFieldValue: "",
      emailAddressFieldValue: "",
      phoneNumberFieldValue: "",
      addressFieldValue: "",
      fatherFirstNameFieldValue: "",
      fatherLastNameFieldValue: "",
      motherFirstNameFieldValue: "",
      motherLastNameFieldValue: "",
      fatherOccupationFieldValue: "",
      motherOccupationFieldValue: "",
      parentPhoneNumberFieldValue: "",
      guardianNameFieldValue: "",
      guardianPhoneNumberFieldValue: "",
      busFeeFieldValue: _BUS_FEE,
      hostelFeeFieldValue: _HOSTEL_FEE,
      admissionFeeFieldValue: _ADMISSION_FEE,
      labFeeFieldValue: _LAB_FEE,
      miscellanousFeeFieldValue: _MISCELLANOUS_FEE,
      concessionFeeFieldValue: _CONCESSION_FEE,
      totalFeeFieldValue: _BUS_FEE + _HOSTEL_FEE + _ADMISSION_FEE + _LAB_FEE + _MISCELLANOUS_FEE - _CONCESSION_FEE,
      value: "DAY SCHOLAR",
      selectedClass: "",
      selectedGender: "",
      selectedCategory: "",
      selectedBranch: "",
      selectedBus: "",
      selectedHall: "",
      classSelectValidationError: "",
      busSelectValidationError: "",
      genderSelectValidationError: "",
      monthSelectValidationError: "",
      hallSelectValidationError: "",
      categorySelectValidationError: "",
      branchSelectValidationError: "",
      firstNameFieldValidationError: "",
      lastNameFieldValidationError: "",
      emailAddressFieldValidationError: "",
      phoneNumberFieldValidationError: "",
      fatherFirstNameFieldValidationError: "",
      fatherLastNameFieldValidationError: "",
      motherFirstNameFieldValidationError: "",
      motherLastNameFieldValidationError: "",
      parentPhoneNumberFieldValidationError: "",
      isLoaded: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/admission/students/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var tableData = data;
      var rows = [];
      for (var i = 0; i < tableData.length; i++) {
        rows.push({ studentID: tableData[i].Si_studentID, name: tableData[i].Si_firstName + " " + tableData[i].Si_lastName, class: tableData[i].Ci_classStandard, parent: tableData[i].Pi_fatherFirstName + " " + tableData[i].Pi_fatherLastName, phone: tableData[i].Pi_parentPhone, residentDetails: tableData[i].Si_residentDetails });
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
      var options = [];
      for (var i = 0; i < data.length; i++) {
        options.push({ label: data[i].Ci_classStandard, value: data[i].Ci_classStandard });
      }
      this.setState({ classOptions: options });
    });
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/bus/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var options = [];
      for (var i = 0; i < data.length; i++) {
        options.push({ label: data[i].Bi_busName, value: data[i].Bi_busName });
      }
      this.setState({ busNameOptions: options });
    });
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/hostel/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var options = [];
      for (var i = 0; i < data.length; i++) {
        options.push({ label: data[i].Hi_hallName, value: data[i].Hi_hallName });
      }
      this.setState({ hallOptions: options });
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
    const year = this.state.date.getFullYear();
    const month = `${this.state.date.getMonth() + 1}`.padStart(2, 0);
    const date = `${this.state.date.getDate()}`.padStart(2, 0);
    const stringDate = [year, month, date].join("-");
    const activator = (
      <div className="calendar">
        <TextField value={stringDate} onFocus={this.handleShowCalendar} />
      </div>
    );
    const genderOptions = [
      { label: 'Male', value: "MALE" },
      { label: 'Female', value: "FEMALE" }
    ];

    const categoryOptions = [
      { label: 'General', value: "GENERAL" },
      { label: 'OBC', value: "OBC" },
      { label: 'SC', value: "SC" },
      { label: 'ST', value: "ST" },
    ];
    var modalMarkup;
    if (this.state.showFirstPage) {
      modalMarkup = (
        <Modal
          open={this.state.showStudentsModal}
          onClose={this.handleShowStudentsModalClose}
          title="Heading"
          primaryAction={{
            content: 'Continue',
            onAction: this.handleShowStudentsModalSecondPage,
          }}
          secondaryActions={[{
            content: 'Back',
            onAction: this.handleShowStudentsModalClose,
          }]}
        >
          <Modal.Section>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="First name"
                  value={this.state.firstNameFieldValue}
                  onChange={this.handleFirstNameFieldChange}
                  type="text"
                  error={this.state.firstNameFieldValidationError}
                />
                <TextField
                  label="Last name"
                  value={this.state.lastNameFieldValue}
                  onChange={this.handleLastNameFieldChange}
                  type="text"
                  error={this.state.lastNameFieldValidationError}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <Select
                  label="Class"
                  options={this.state.classOptions}
                  onChange={this.handleClassChange}
                  value={this.state.selectedClass}
                  placeholder="Select Class"
                  error={this.state.classSelectValidationError}
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
              <TextField
                label="Email address"
                value={this.state.emailAddressFieldValue}
                onChange={this.handleEmailAddressFieldChange}
                type="email"
                placeholder="name@email.com"
                error={this.state.emailAddressFieldValidationError}
              />
              <TextField
                label="Phone number"
                value={this.state.phoneNumberFieldValue}
                onChange={this.handlePhoneNumberFieldChange}
                error={this.state.phoneNumberFieldValidationError}
              />
              <FormLayout.Group condensed>
                <div>Date of birth:{'\u00A0'}{'\u00A0'}</div>
                <Popover
                  active={this.state.active}
                  activator={activator}
                  onClose={this.togglePopover}
                >
                  <Calendar onChange={this.handleDateChange} value={this.state.date} maxDate={new Date()} />
                </Popover>
              </FormLayout.Group>
              <FormLayout.Group condensed>
                <Select
                  label="Gender"
                  options={genderOptions}
                  onChange={this.handleGenderChange}
                  value={this.state.selectedGender}
                  placeholder="Select Gender"
                  error={this.state.genderSelectValidationError}
                />
                <Select
                  label="Category"
                  options={categoryOptions}
                  onChange={this.handleCategoryChange}
                  value={this.state.selectedCategory}
                  placeholder="Select Category"
                  error={this.state.categorySelectValidationError}
                />
              </FormLayout.Group>
              <TextField
                label="Address"
                value={this.state.addressFieldValue}
                onChange={this.handleAddressFieldChange}
                type="text"
                multiline
              />
              <FormLayout.Group condensed>
                <div className="Polaris-Label">Select residential type: </div>
                <RadioButton
                  label="Day scholar"
                  checked={this.state.value === 'DAY SCHOLAR'}
                  name="studentStay"
                  id="DAY SCHOLAR"
                  onChange={this.handleStudentStayChange}
                />
                <RadioButton
                  label="Hosteller"
                  checked={this.state.value === 'HOSTELLER'}
                  name="studentStay"
                  id="HOSTELLER"
                  onChange={this.handleStudentStayChange}
                />
              </FormLayout.Group>
              {this.state.value === 'DAY SCHOLAR' ? <Select
                label="Bus Name"
                options={this.state.busNameOptions}
                onChange={this.handleBusChange}
                value={this.state.selectedBus}
                placeholder="Select Bus"
                error={this.state.busSelectValidationError}
              /> : <Select
                  label="Hall Name"
                  options={this.state.hallOptions}
                  onChange={this.handleHallChange}
                  value={this.state.selectedHall}
                  placeholder="Select Hall"
                  error={this.state.hallSelectValidationError}
                />}
            </FormLayout>
          </Modal.Section>
        </Modal>
      );
    } else if (this.state.showSecondPage) {
      modalMarkup = (
        <Modal
          open={this.state.showStudentsModal}
          onClose={this.handleShowStudentsModalClose}
          title="Heading"
          primaryAction={{
            content: 'Continue',
            onAction: this.handleShowStudentsModalThirdPage,
          }}
          secondaryActions={[{
            content: 'Back',
            onAction: this.handleShowStudentsModalFirstPage,
          }]}
        >
          <Modal.Section>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Father First name"
                  value={this.state.fatherFirstNameFieldValue}
                  onChange={this.handleFatherFirstNameFieldChange}
                  type="text"
                  error={this.state.fatherFirstNameFieldValidationError}
                />
                <TextField
                  label="Father Last name"
                  value={this.state.fatherLastNameFieldValue}
                  onChange={this.handleFatherLastNameFieldChange}
                  type="text"
                  error={this.state.fatherLastNameFieldValidationError}
                />
                <TextField
                  label="Mother First name"
                  value={this.state.motherFirstNameFieldValue}
                  onChange={this.handleMotherFirstNameFieldChange}
                  type="text"
                  error={this.state.motherFirstNameFieldValidationError}
                />
                <TextField
                  label="Mother Last name"
                  value={this.state.motherLastNameFieldValue}
                  onChange={this.handleMotherLastNameFieldChange}
                  type="text"
                  error={this.state.motherLastNameFieldValidationError}
                />
                <TextField
                  label="Father occupation"
                  value={this.state.fatherOccupationFieldValue}
                  onChange={this.handleFatherOccupationFieldChange}
                  type="text"
                />
                <TextField
                  label="Mother occupation"
                  value={this.state.motherOccupationFieldValue}
                  onChange={this.handleMotherOccupationFieldChange}
                  type="text"
                />
                <TextField
                  label="Guardian name"
                  value={this.state.guardianNameFieldValue}
                  onChange={this.handleGuardianNameFieldChange}
                  type="text"
                />
                <TextField
                  label="Guardian phone number"
                  value={this.state.guardianPhoneNumberFieldValue}
                  onChange={this.handleGuardianPhoneNumberFieldChange}
                  type="text"
                />
                <TextField
                  label="Parent phone number"
                  value={this.state.parentPhoneNumberFieldValue}
                  onChange={this.handleParentPhoneNumberFieldChange}
                  type="text"
                  error={this.state.parentPhoneNumberFieldValidationError}
                />
              </FormLayout.Group>
            </FormLayout>
          </Modal.Section>
        </Modal>
      );
    } else if (this.state.showThirdPage) {
      modalMarkup = (
        <Modal
          open={this.state.showStudentsModal}
          onClose={this.handleShowStudentsModalClose}
          title="Heading"
          primaryAction={{
            content: 'Submit',
            onAction: this.showSubmitMessage,
          }}
          secondaryActions={[{
            content: 'Back',
            onAction: this.handleShowStudentsModalSecondPage,
          }]}
        >
          <Modal.Section>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="Bus fee"
                  value={this.state.busFeeFieldValue}
                  onChange={this.handleBusFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Hostel fee"
                  value={this.state.hostelFeeFieldValue}
                  onChange={this.handleHostelFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Admission fee"
                  value={this.state.admissionFeeFieldValue}
                  onChange={this.handleAdmissionFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Lab fee"
                  value={this.state.labFeeFieldValue}
                  onChange={this.handleLabFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Miscellanous fee"
                  value={this.state.miscellanousFeeFieldValue}
                  onChange={this.handleMiscellanousFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Concession fee"
                  value={this.state.concessionFeeFieldValue}
                  onChange={this.handleConcessionFeeFieldChange}
                  type="text"
                />
                <TextField
                  label="Total fee"
                  value={this.state.totalFeeFieldValue}
                  type="text"
                  readOnly
                />
              </FormLayout.Group>
            </FormLayout>
          </Modal.Section>
        </Modal>
      );
    }

    const { SearchBar } = Search;

    const columns = [{
      dataField: 'studentID',
      text: 'Student ID',
      sort: true
    }, {
      dataField: 'name',
      text: 'Name',
      sort: true
    }, {
      dataField: 'class',
      text: 'Class',
      sort: true
    }, {
      dataField: 'parent',
      text: 'Parent',
      sort: true
    }, {
      dataField: 'phone',
      text: 'Phone',
      sort: true
    }, {
      dataField: 'residentDetails',
      text: 'Resident Details',
      sort: true
    }
    ];

    var abc = (
      <Page>
        {modalMarkup}
        <div style={{ marginLeft: "89%", marginBottom: "1%" }}><Button primary onClick={this.showStudentsModal}>Add Student</Button></div>
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

  handleFirstNameFieldChange = (firstNameFieldValue) => {
    this.setState({ firstNameFieldValue, firstNameFieldValidationError: "" });
  };

  handleLastNameFieldChange = (lastNameFieldValue) => {
    this.setState({ lastNameFieldValue, lastNameFieldValidationError: "" });
  };


  handleEmailAddressFieldChange = (emailAddressFieldValue) => {
    this.setState({ emailAddressFieldValue, emailAddressFieldValidationError: "" });
  };

  handlePhoneNumberFieldChange = (phoneNumberFieldValue) => {
    this.setState({ phoneNumberFieldValue, phoneNumberFieldValidationError: "" });
  };

  handleAddressFieldChange = (addressFieldValue) => {
    this.setState({ addressFieldValue });
  }

  handleFatherFirstNameFieldChange = (fatherFirstNameFieldValue) => {
    this.setState({ fatherFirstNameFieldValue, fatherFirstNameFieldValidationError: "" });
  }

  handleFatherLastNameFieldChange = (fatherLastNameFieldValue) => {
    this.setState({ fatherLastNameFieldValue, fatherLastNameFieldValidationError: "" });
  }

  handleMotherFirstNameFieldChange = (motherFirstNameFieldValue) => {
    this.setState({ motherFirstNameFieldValue, motherFirstNameFieldValidationError: "" });
  }

  handleMotherLastNameFieldChange = (motherLastNameFieldValue) => {
    this.setState({ motherLastNameFieldValue, motherLastNameFieldValidationError: "" });
  }

  handleFatherOccupationFieldChange = (fatherOccupationFieldValue) => {
    this.setState({ fatherOccupationFieldValue });
  }

  handleMotherOccupationFieldChange = (motherOccupationFieldValue) => {
    this.setState({ motherOccupationFieldValue });
  }

  handleGuardianNameFieldChange = (guardianNameFieldValue) => {
    this.setState({ guardianNameFieldValue });
  }

  handleGuardianPhoneNumberFieldChange = (guardianPhoneNumberFieldValue) => {
    this.setState({ guardianPhoneNumberFieldValue });
  }

  handleParentPhoneNumberFieldChange = (parentPhoneNumberFieldValue) => {
    this.setState({ parentPhoneNumberFieldValue, parentPhoneNumberFieldValidationError: "" });
  }

  handleShowCalendar = () => {
    this.setState({ active: true });
  }

  handleDateChange = (date) => {
    this.setState({ date, active: false });
  }

  handleBusFeeFieldChange = (busFeeFieldValue) => {
    this.setState({ busFeeFieldValue }, () => this.calculateTotalFee());
  }

  handleHostelFeeFieldChange = (hostelFeeFieldValue) => {
    this.setState({ hostelFeeFieldValue }, () => this.calculateTotalFee());
  }

  handleAdmissionFeeFieldChange = (admissionFeeFieldValue) => {
    this.setState({ admissionFeeFieldValue }, () => this.calculateTotalFee());
  }

  handleLabFeeFieldChange = (labFeeFieldValue) => {
    this.setState({ labFeeFieldValue }, () => this.calculateTotalFee());
  }

  handleMiscellanousFeeFieldChange = (miscellanousFeeFieldValue) => {
    this.setState({ miscellanousFeeFieldValue }, () => this.calculateTotalFee());
  }

  handleConcessionFeeFieldChange = (concessionFeeFieldValue) => {
    this.setState({ concessionFeeFieldValue }, () => this.calculateTotalFee());
  }

  calculateTotalFee = () => {
    var totalFee = parseInt(this.state.busFeeFieldValue) + parseInt(this.state.hostelFeeFieldValue) + parseInt(this.state.admissionFeeFieldValue) + parseInt(this.state.labFeeFieldValue) + parseInt(this.state.miscellanousFeeFieldValue) - parseInt(this.state.concessionFeeFieldValue);
    this.setState({ totalFeeFieldValue: totalFee });
  }

  handleShowStudentsModalClose = () => {
    this.resetFields();
    this.setState({ showStudentsModal: false });
  };

  handleShowStudentsModalFirstPage = () => {
    this.setState({ showFirstPage: true, showSecondPage: false, showThirdPage: false });
  }

  handleShowStudentsModalSecondPage = () => {
    var isValid = this.validateFirstPage();
    if (isValid) {
      this.setState({ showFirstPage: false, showSecondPage: true, showThirdPage: false });
    }
  }

  handleShowStudentsModalThirdPage = () => {
    var isValid = this.validateSecondPage();
    if (isValid) {
      this.setState({ showFirstPage: false, showSecondPage: false, showThirdPage: true });
    }
  }

  handleClassChange = (newValue) => {
    this.setState({ selectedClass: newValue, classSelectValidationError: "" });
  };

  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue, branchSelectValidationError: "" });
  };

  handleGenderChange = (newValue) => {
    this.setState({ selectedGender: newValue, genderSelectValidationError: "" });
  }

  handleCategoryChange = (newValue) => {
    this.setState({ selectedCategory: newValue, categorySelectValidationError: "" });
  }

  handleStudentStayChange = (checked, newValue) => {
    if (newValue == 'DAY SCHOLAR') {
      this.setState({ value: newValue, busFeeFieldValue: 20000, hostelFeeFieldValue: 0 }, () => this.calculateTotalFee());
    } else {
      this.setState({ value: newValue, busFeeFieldValue: 0, hostelFeeFieldValue: 40000 }, () => this.calculateTotalFee());
    }
  };

  handleBusChange = (newValue) => {
    this.setState({ selectedBus: newValue, busSelectValidationError: "" });
  }

  handleHallChange = (newValue) => {
    this.setState({ selectedHall: newValue, hallSelectValidationError: "" });
  }

  validateFirstPage = () => {
    if (validator.isEmpty(this.state.firstNameFieldValue, { ignore_whitespace: true })) {
      var firstNameInvalid = true;
      this.setState({ firstNameFieldValidationError: "Student First Name cannot be empty" })
    }
    if (validator.isEmpty(this.state.lastNameFieldValue, { ignore_whitespace: true })) {
      var lastNameInvalid = true;
      this.setState({ lastNameFieldValidationError: "Student Last Name cannot be empty" })
    }
    if (!validator.isEmail(this.state.emailAddressFieldValue)) {
      var emailInvalid = true;
      this.setState({ emailAddressFieldValidationError: "Invalid Email ID" })
    }
    if (!validator.isMobilePhone(this.state.phoneNumberFieldValue) || this.state.phoneNumberFieldValue.length !== 10) {
      var phoneNumberInvalid = true;
      this.setState({ phoneNumberFieldValidationError: "Invalid Mobile number" })
    }
    if (!this.state.selectedClass) {
      var classInvalid = true;
      this.setState({ classSelectValidationError: "Class is required" })
    }
    if (!this.state.selectedBranch) {
      var branchInvalid = true;
      this.setState({ branchSelectValidationError: "Branch is required" })
    }
    if (!this.state.selectedGender) {
      var genderInvalid = true;
      this.setState({ genderSelectValidationError: "Gender is required" })
    }
    if (!this.state.selectedCategory) {
      var categoryInvalid = true;
      this.setState({ categorySelectValidationError: "Category is required" })
    }
    if (this.state.value === "DAY SCHOLAR") {
      if (!this.state.selectedBus) {
        var busInvalid = true;
        this.setState({ busSelectValidationError: "Bus is required" })
      }
    } else {
      if (!this.state.selectedHall) {
        var hallInvalid = true;
        this.setState({ hallSelectValidationError: "Hall is required" })
      }
    }
    if (firstNameInvalid || lastNameInvalid || emailInvalid || phoneNumberInvalid || classInvalid || branchInvalid || genderInvalid || categoryInvalid || (this.state.value === "DAY SCHOLAR" && busInvalid) || (this.state.value !== "DAY SCHOLAR" && hallInvalid)) {
      return false;
    } else {
      return true;
    }
  }

  validateSecondPage = () => {
    if (validator.isEmpty(this.state.fatherFirstNameFieldValue, { ignore_whitespace: true })) {
      var fatherFirstNameInvalid = true;
      this.setState({ fatherFirstNameFieldValidationError: "Father First Name cannot be empty" })
    }
    if (validator.isEmpty(this.state.fatherLastNameFieldValue, { ignore_whitespace: true })) {
      var fatherLastNameInvalid = true;
      this.setState({ fatherLastNameFieldValidationError: "Father Last Name cannot be empty" })
    }
    if (validator.isEmpty(this.state.motherFirstNameFieldValue, { ignore_whitespace: true })) {
      var motherFirstNameInvalid = true;
      this.setState({ motherFirstNameFieldValidationError: "Mother First Name cannot be empty" })
    }
    if (validator.isEmpty(this.state.motherLastNameFieldValue, { ignore_whitespace: true })) {
      var motherLastNameInvalid = true;
      this.setState({ motherLastNameFieldValidationError: "Mother Last Name cannot be empty" })
    }
    if (!validator.isMobilePhone(this.state.parentPhoneNumberFieldValue) || this.state.parentPhoneNumberFieldValue.length !== 10) {
      var parentPhoneNumberInvalid = true;
      this.setState({ parentPhoneNumberFieldValidationError: "Parent phone number is invalid" })
    }
    if (fatherFirstNameInvalid || fatherLastNameInvalid || motherFirstNameInvalid || motherLastNameInvalid || parentPhoneNumberInvalid) {
      return false;
    } else {
      return true;
    }
  }

  resetFields = () => {
    this.setState({
      showStudentsModal: false,
      firstNameFieldValue: "",
      lastNameFieldValue: "",
      emailAddressFieldValue: "",
      phoneNumberFieldValue: "",
      addressFieldValue: "",
      fatherFirstNameFieldValue: "",
      fatherLastNameFieldValue: "",
      motherFirstNameFieldValue: "",
      motherLastNameFieldValue: "",
      fatherOccupationFieldValue: "",
      motherOccupationFieldValue: "",
      parentPhoneNumberFieldValue: "",
      guardianNameFieldValue: "",
      guardianPhoneNumberFieldValue: "",
      showFirstPage: true,
      showSecondPage: false,
      value: "DAY SCHOLAR",
      selectedClass: "",
      selectedGender: "",
      selectedCategory: "",
      selectedBranch: "",
      selectedBus: "",
      selectedHall: "",
      busFeeFieldValue: _BUS_FEE,
      hostelFeeFieldValue: _HOSTEL_FEE,
      admissionFeeFieldValue: _ADMISSION_FEE,
      labFeeFieldValue: _LAB_FEE,
      miscellanousFeeFieldValue: _MISCELLANOUS_FEE,
      concessionFeeFieldValue: _CONCESSION_FEE,
      totalFeeFieldValue: _BUS_FEE + _HOSTEL_FEE + _ADMISSION_FEE + _LAB_FEE + _MISCELLANOUS_FEE - _CONCESSION_FEE,
      classSelectValidationError: "",
      busSelectValidationError: "",
      genderSelectValidationError: "",
      monthSelectValidationError: "",
      hallSelectValidationError: "",
      categorySelectValidationError: "",
      branchSelectValidationError: "",
      firstNameFieldValidationError: "",
      lastNameFieldValidationError: "",
      emailAddressFieldValidationError: "",
      phoneNumberFieldValidationError: "",
      fatherFirstNameFieldValidationError: "",
      fatherLastNameFieldValidationError: "",
      motherFirstNameFieldValidationError: "",
      motherLastNameFieldValidationError: "",
      parentPhoneNumberFieldValidationError: "",
    });
  }

  showStudentsModal = () => {
    this.setState({ showStudentsModal: true });
  }

  showSubmitMessage = () => {
    const year = this.state.date.getFullYear();
    const month = `${this.state.date.getMonth() + 1}`.padStart(2, 0);
    const date = `${this.state.date.getDate()}`.padStart(2, 0);
    var data = {
      ffName: this.state.fatherFirstNameFieldValue,
      flName: this.state.fatherLastNameFieldValue,
      mfName: this.state.motherFirstNameFieldValue,
      mlName: this.state.motherLastNameFieldValue,
      pPhone: this.state.phoneNumberFieldValue,
      fOccupation: this.state.fatherOccupationFieldValue,
      mOccupation: this.state.motherOccupationFieldValue,
      gName: this.state.guardianNameFieldValue,
      gPhone: this.state.guardianPhoneNumberFieldValue,
      std: this.state.selectedClass,
      fName: this.state.firstNameFieldValue,
      lName: this.state.lastNameFieldValue,
      gender: this.state.selectedGender,
      category: this.state.selectedCategory,
      dob: year + "-" + month + "-" + date,
      email: this.state.emailAddressFieldValue,
      address: this.state.addressFieldValue,
      bName: this.state.selectedBranch,
      rDetails: this.state.value,
      busFee: this.state.busFeeFieldValue,
      hostelFee: this.state.hostelFeeFieldValue,
      admissionFee: this.state.admissionFeeFieldValue,
      labFee: this.state.labFeeFieldValue,
      miscellanousFee: this.state.miscellanousFeeFieldValue,
      concessionFee: this.state.concessionFeeFieldValue,
      totalFee: parseInt(this.state.totalFeeFieldValue)
    };
    if (this.state.value == "HOSTELLER") {
      data.hallName = this.state.selectedHall
    } else {
      data.busName = this.state.selectedBus
    }
    this.resetFields();
    Axios({
      method: "post",
      url: "http://www.srmheavens.com/erp/admission/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      },
      data: data
    }).then(response => response.data)
      .then(response => {
        this.fetchData();
        this.setState({ showStudentsModal: false });
      })
      .catch(error => console.error('Error:', error));
  }
}

export default Students;