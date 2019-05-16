import React from 'react';
import { AppProvider, Frame, Navigation, TopBar } from '@shopify/polaris';
import { Route } from "react-router-dom";
import Students from './views/Students';
import Buses from './views/Buses';
import Hostels from './views/Hostels';
import Standards from './views/Standards';
import Subjects from './views/Subjects';
import Teachers from './views/Teachers';

class App extends React.Component {

  state = {
    isLoading: false,
    token: "",
    showMobileNavigation: false
  };

  constructor(props) {
    super(props);
  }

  render() {

    const userMenuMarkup = (
      <TopBar.UserMenu
        name="Helen B."
        detail="Administrator"
        initials="H"
      />
    );

    const topBarMarkup = (
      <TopBar
        showNavigationToggle={true}
        userMenu={userMenuMarkup}
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
              icon: 'orders'
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
              icon: 'orders'
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
            <Route path="/students" render={() => <Students token={this.props.token} />} />
            <Route path="/buses" render={() => <Buses token={this.props.token} />} />
            <Route path="/hostels" render={() => <Hostels token={this.props.token} />} />
            <Route path="/standards" render={() => <Standards token={this.props.token} />} />
            <Route path="/subjects" render={() => <Subjects token={this.props.token} />} />
            <Route path="/teachers" render={() => <Teachers token={this.props.token} />} />
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
}

export default App;