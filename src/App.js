import React from 'react';
import { AppProvider, Frame, Navigation, Select, TopBar } from '@shopify/polaris';
import { Route } from "react-router-dom";
import Students from './views/Students';
import Buses from './views/Buses';
import Hostels from './views/Hostels';
import Standards from './views/Standards';
import Subjects from './views/Subjects';
import Teachers from './views/Teachers';
import Guardians from './views/Guardians';
import FeesCollection from './views/FeesCollection';
import StudentProfile from './views/StudentProfile';
import Complaints from './views/Complaints';
import Axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.fetchData();
    this.state = {
      isLoading: false,
      token: "",
      showMobileNavigation: false,
      branchOptions: [],
      selectedBranch: ""
    }
  }

  fetchData() {
    Axios({
      method: "get",
      url: "http://www.srmheavens.com/erp/branch/",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.token
      }
    }).then(response => response.data).then(data => {
      var options = [{ label: "Select Branch", value: "" }];
      for (var i = 0; i < data.length; i++) {
        options.push({ label: data[i].SBi_branchName, value: data[i].SBi_branchName });
      }
      this.setState({ branchOptions: options });
    });
  }

  render() {

    const userMenuMarkup = (
      <TopBar.UserMenu
        name={this.props.user}
        detail="Administrator"
        initials={this.props.user[0]}
      />
    );
    const secondaryMenuMarkup = (
      <TopBar.Menu
        activatorContent={
          <div style={{ color: "black", textAlign: "left", width: "200px" }}>
            <Select
              options={this.state.branchOptions}
              onChange={this.handleBranchChange}
              value={this.state.selectedBranch}
            />
          </div>
        }
      />
    );

    const topBarMarkup = (
      <TopBar
        showNavigationToggle={true}
        userMenu={userMenuMarkup}
        secondaryMenu={secondaryMenuMarkup}
        onNavigationToggle={this.state.showMobileNavigation}
      />
    );

    const navigationMarkup = (
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              label: 'Home',
              icon: 'home'
            },
            {
              label: 'Students',
              icon: 'orders',
              onClick: () => this.props.history.push('/students')
            },
            {
              label: 'Teachers',
              icon: 'orders',
              onClick: () => this.props.history.push('/teachers')
            },
            {
              label: 'Guardians',
              icon: 'orders',
              onClick: () => this.props.history.push('/guardians')
            },
            {
              label: 'Standards',
              icon: 'orders',
              onClick: () => this.props.history.push('/standards')
            },
            {
              label: 'Subjects',
              icon: 'orders',
              onClick: () => this.props.history.push('/subjects')
            },
            {
              label: 'Exams',
              icon: 'orders'
            },
            {
              label: 'ExtraCurricular',
              icon: 'orders'
            },
            {
              label: 'Fees Collection',
              icon: 'orders',
              onClick: () => this.props.history.push('/feesCollection')
            },
            {
              label: 'Buses',
              icon: 'orders',
              onClick: () => this.props.history.push('/buses')
            },
            {
              label: 'Hostels',
              icon: 'orders',
              onClick: () => this.props.history.push('/hostels')
            },
            {
              label: 'Staff',
              icon: 'orders'
            },
            {
              label: 'Complaints',
              icon: 'orders',
              onClick: () => this.props.history.push('/complaints')
            }
          ]}
        />
      </Navigation>
    );

    const theme = {
      colors: {
        topBar: {
          background: '#357997',
        },
      }
    };

    return (
      <div style={{ height: '500px' }}>
        <AppProvider theme={theme}>
          <Frame
            topBar={topBarMarkup}
            navigation={navigationMarkup}
            showMobileNavigation={this.state.showMobileNavigation}
            onNavigationDismiss={this.hideMobileNavigation}
          >
            <Route path="/students" render={() => <Students token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/buses" render={() => <Buses token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/hostels" render={() => <Hostels token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/standards" render={() => <Standards token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/subjects" render={() => <Subjects token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/teachers" render={() => <Teachers token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/feesCollection" render={() => <FeesCollection token={this.props.token} branch={this.state.selectedBranch} />} />
            <Route path="/guardians" render={() => <Guardians token={this.props.token} branch={this.state.selectedBranch} history={this.props.history}/>} />
            <Route path="/studentProfile" render={() => <StudentProfile token={this.props.token} history={this.props.history}/>} />
            <Route path="/complaints" render={() => <Complaints token={this.props.token} branch={this.state.selectedBranch} />} />
          </Frame>
        </AppProvider>
      </div>
    );
  }
  showMobileNavigation = () => {
    this.setState({ showMobileNavigation: true });
  }
  hideMobileNavigation = () => {
    this.setState({ showMobileNavigation: false });
  }
  handleBranchChange = (newValue) => {
    this.setState({ selectedBranch: newValue });
  };
}

export default App;