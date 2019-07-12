import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import styled from 'styled-components';
import { createApolloFetch } from 'apollo-fetch';

// Styled Components
const FormContainer = styled.div`
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6rem;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const StyleInput = styled.input`
  display: block;
  width: 350px;
  height: 30px;
  color: grey;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  padding-left: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100px;
  height: 30px;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
`;

const EditHeader = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
`;
// End of Styled Components

const fetch = createApolloFetch({
    uri: 'http://localhost:4000/graphql',
  });

  
class ContactAddForm extends PureComponent {
    addContact = (
        { displayName, title, location, company},
            id,
    ) => {
        fetch({
        query: `mutation
          addContact(
              $id: Int!,
              $displayName: String!,
              $title: String!,
              $location: String!,
              $company: String!
              ){
              addContact(
                id: id,
                displayName: $displayName,
                title: $title,
                location: $location,
                company: $company
              ) {
                  id
                  displayName
                  title
                  location
                  company
              }
          }`,
          variables: {
              displayName,
              title,
              location,
              company,
              id
          },
        })
        .then(res => {
            const addedContact = res.data.addContact;

            this.props.dispatch({
                type: 'ADD_CONTACT',
                payload: addedContact
            });
            this.props.dispatch({
                type: 'SET_CURRENT_CONTACT',
                payload: addedContact,
            });
            this.props.dispatch({ type: 'TOGGLE_ADD_CONTACT' });
        })   
        .catch(err => {
            console.error(err);
        })
    };

    render() {
        const {
            displayName,
            title,
            location,
            company,
            id
        } = this.props;

    return(
        <FormContainer id="contact-edit-form">
        <EditHeader>Add Contact</EditHeader>
        <Formik
          initialValues={{
            displayName,
            title,
            location,
            company,
          }}
          onSubmit={values => this.addContact(values, id)}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit} id="edit-form">
              <StyledLabel htmlFor="displayName">Name</StyledLabel>
              <StyleInput
                type="text"
                name="displayName"
                id="displayName"
                onChange={handleChange}
                value={values.displayName}
              />
              <StyledLabel htmlFor="title">Title</StyledLabel>
              <StyleInput
                type="text"
                name="title"
                id="title"
                onChange={handleChange}
                value={values.title}
              />{' '}
              <StyledLabel htmlFor="location">Location</StyledLabel>
              <StyleInput
                type="text"
                name="location"
                id="location"
                onChange={handleChange}
                value={values.location}
              />{' '}
              <StyledLabel htmlFor="company">Company</StyledLabel>
              <StyleInput
                type="text"
                name="company"
                id="company"
                onChange={handleChange}
                value={values.company}
              />
              <SubmitButton type="submit" disabled={isSubmitting}>
                Submit
              </SubmitButton>
            </Form>
          )}
        />
      </FormContainer>
    );
    }

}

ContactAddForm.propTypes = {
    displayName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  };
  
  export default ContactAddForm;