import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createApolloFetch } from 'apollo-fetch';
import styled from 'styled-components';
import { Router } from 'react-router-dom';
import ContactListItems from './components/ContactListItems';
import ContactDetails from './components/ContactDetails';
import history from './history';

// Styled-Components
const AppContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const AppHeader = styled.h1`
  text-align: center;
  width: 800px;
`;

const AddressBookWrapper = styled.div`
  display: flex;
  width: 800px;
  height: 600px;
  border: 1px grey solid;
  border-radius: 5px;
`;

const EmptyPlaceHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 5;
  height: 100%;
`;
// End of Styled Components

const fetch = createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});
class App extends Component {
  componentDidMount() {
    this.allContacts();
  }

  componentWillReceiveProps(nextProps) {
    // need to generate routes and store to redux after we get all contacts
    if (nextProps.allContacts !== this.props.allContacts) {
      this.routesGenerator(nextProps.allContacts);
    }
  }

  allContacts = () => {
    fetch({
      query: `{allContacts {
      id
      displayName
      title
      location
      company
    }}`,
    }).then(res => {
      this.props.dispatch({
        type: 'SET_ALL_CONTACTS',
        payload: res.data.allContacts,
      });
    });
  };

  // generate all the routes based on however many contacts we have
  routesGenerator = allContacts => {
    const routes = [
      {
        path: `/`,
        exact: true,
        main: () => (
          <EmptyPlaceHolder>Please select a contact to start</EmptyPlaceHolder>
        ),
      },
    ];
    allContacts.forEach(contact => {
      routes.push({
        path: `/contact/${contact.id}`,
        main: () => <ContactDetails />,
      });
    });
    this.props.dispatch({ type: 'SET_ROUTES', payload: routes });
  };

  render() {
    return (
      <AppContainer id="app-container">
        <AppHeader>Address Book</AppHeader>
        <AddressBookWrapper>
          <Router history={history}>
            <ContactListItems />
          </Router>
        </AddressBookWrapper>
      </AppContainer>
    );
  }
}

App.propTypes = {
  allContacts: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  allContacts: state.contactList.allContacts,
});

export default connect(mapStateToProps)(App);


// Global style for Styled-components