import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContactAddForm from './ContactAddForm';

// Styled Components
const ContactDetailsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;

const Label = styled.div`
  display: inline-block;
  font-weight: 600;
  width: 100px;
`;

const AddButton = styled.button`
  width: 80px;
  height: 30px;
  border-radius: 10px;
  padding: 0 1rem;
  font-size: 1rem;
  cursor: pointer;
  background: lightgrey;
`;

const ContactDetailsWrapper = styled.div`
  padding: 1rem 2rem;
  flex-grow: 5;
`;

const ContactDetailsItem = styled.div`
  padding: 0.5rem;
`;

const Header = styled.h2`
  margin-bottom: 1rem;
  padding: 0.5rem;
`;
// End of Styled Components

class ContactDetails extends PureComponent{
    handleAddFormClick = () => {
        this.props.dispatch({ type: 'TOGGLE_ADD_CONTACT' });
      };

    render(){
        const { contactDetails, isAddingContact, dispatch } = this.props;

        return(
            <ContactDetailsContainer id="contact-detail-container">
                <MenuBar>
                <AddButton onClick={this.handleAddFormClick}>Add</AddButton>
                </MenuBar>

                {isAddingContact ? (
          <ContactAddForm
            id="contact-add-form"
            displayName={contactDetails.displayName}
            title={contactDetails.title}
            location={contactDetails.location}
            company={contactDetails.company}
            dispatch={dispatch}
          />
        ) : (
          contactDetails && (
            <ContactDetailsWrapper id="contact-details-wrapper">
              <Header>
                {contactDetails.displayName}
              </Header>
              <ContactDetailsItem>
                <Label>Title:</Label>
                {contactDetails.title}
              </ContactDetailsItem>
              <ContactDetailsItem>
                <Label>Location:</Label>
                {contactDetails.location}
              </ContactDetailsItem>
              <ContactDetailsItem>
                <Label>Company:</Label>
                {contactDetails.company}
              </ContactDetailsItem>
            </ContactDetailsWrapper>
          )
        )}
      </ContactDetailsContainer>
        );
    }
}

ContactDetails.propTypes = {
    contactDetails: PropTypes.shape({
      displayName: PropTypes.string,
      title: PropTypes.string,
      location: PropTypes.string,
      company: PropTypes.string,
    }).isRequired,
    isAddingContact: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };
  
  const mapStateToProps = state => ({
    contactDetails: state.contactList.selectedContact,
    isAddingContact: state.contactList.isAddingContact,
  });
  
  export default connect(mapStateToProps)(ContactDetails);
  