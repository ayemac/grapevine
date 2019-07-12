import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import Fuse from 'fuse.js';
import { createApolloFetch } from 'apollo-fetch';
import styled from 'styled-components';


// Styled Components
const ContactListContainer = styled.div`
  display: flex;
  height: 100%;
`;

const SideBarHeading = styled.div`
  text-align: center;
  margin: 1rem 0;
  font-size: 1.2rem;
`;

const SearchInput = styled.input`
  -webkit-appearance: none;
  display: block;
  width: 200px;
  height: 30px;
  color: grey;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  padding-left: 1rem;
  border-radius: 30px;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  text-decoration: none;
  padding: 1rem;
  &:visited {
    color: black;
  }
`;

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  background: #ddd;
  padding: 1rem;
  flex: 1;
  border-radius: 5px 0 0 5px;
`;

const ContactDetailsWrapper = styled.div`
  width: 560px;
`;

const ContactListItem = styled.li`
  list-style: none;
  padding: 0;
  border-bottom: 1px solid grey;
  &:hover {
    background-color: lightgrey;
  }
`;

const NoMatchPlaceHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 5;
  height: 100%;
`;
// End of Styled Components

export const fetch = createApolloFetch({
    uri: 'http://localhost:4000/graphql',
  });

const query = `
  query oneContact(id: Int!) {
    oneContact(id: $id) {
      ...contactFields
    }
  }
  fragment contactFields on Contact {
    id
    displayName
    title
    location
    company
    pets
    relationships
  }
`;

const setVariables = index => ({
    id: index
});

const NoMatch = () => (
    <NoMatchPlaceHolder>
        No one's here. Please add some contacts!
    </NoMatchPlaceHolder>
);

class ContactListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            searchResult: this.props.allContacts,
        }
    }

    componentWillMount() {
        const id = window.location.pathname.replace('/contact/', '');
        this.oneContact(id);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.allContacts !== this.props.allContacts) {
            this.setState({ searchResult: nextProps.allContacts})
        }

        if (this.props.location.pathname !== nextProps.location.pathname) {
            this.oneContact(nextProps.location.pathname.replace('/contact/', ''));
          }
    }


oneContact = index => {
    fetch({
        query,
        variables: setVariables(index),
    })
    .then(({ data}) => {
        this.props.dispatch({
            type: 'SET_CURRENT_CONTACT',
            payload: data.oneContact,
        })
    })
    .catch(err => {
        console.error(err)
    });
};

handleKeyChange = event => {
    const { allContacts } = this.props;
    const options = {
        shouldSort:true,
        threshold: 0.1,
        location: 0,
        distance: 50,
        minMatchCharLength: 1,
        keys: ['displayName', 'title', 'location', 'company', 'pets'],
    }
    const fuse = new Fuse(allContacts, options);
    let result;
    if (event.target.value === '') {
        result = allContacts;
    } else {
        result = fuse.search(event.target.value);
    }

    this.setState({
        searchResult: result,
        searchInput: event.target.value,
    });
};

handleSubmit = event => event.preventDefault();

handleClick = index => {
    this.oneContact(index);
};

    render() {
        const { searchResult } = this.state;
        const { routes } = this.props;

        return(
            <div>
                <ContactListContainer id="contactlist-container">
                <SideBar>
                    <SideBarHeading>All Contacts</SideBarHeading>
                    <form onSubmit={this.handleSubmit}>
                        <SearchInput
                            value={this.state.searchInput}
                            placeholder="Search"
                            onChange={this.handleKeyChange}
                            type='search'
                            />
                    </form>
                    <ul>
                        {searchResult &&
                        searchResult.map(contact => (
                        <ContactListItem key={contact.id}>
                            <StyledLink
                                to={`/contact/${contact.id}`}
                                key={contact.id}
                                onClick={this.handleClick.bind(this, contact.id)}
                                >
                                    {contact.displayName}
                                </StyledLink>
                        </ContactListItem>
                        ))}
                    </ul>
                </SideBar>
                <ContactDetailsWrapper>
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                            key= {index}
                            path = {route.path}
                            exact={route.exact}
                            component={route.main}
                            />
                        ))}
                        <Route component={NoMatch} />
                    </Switch>
                </ContactDetailsWrapper>
                </ContactListContainer>
            </div>
        )
    }
};

ContactListItems.propTypes = {
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        exact: PropTypes.bool,
        path: PropTypes.string.isRequired,
        main: PropTypes.func.isRequired,
      }),
    ).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

const mapStateToProps = state => ({
    allContacts: state.contactList.allContacts,
    routes: state.contactList.routes,
  });
  
export default withRouter(connect(mapStateToProps)(ContactListItems));
  