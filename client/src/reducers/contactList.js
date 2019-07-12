const initialState = {
    selectedContact: {
        displayName: '',
        title: '',
        location: '',
        company: '',
        pets: [],
        relationships: []
    },
    allContacts: [],
    routes: [],
    isAddingContact: false
}

const contactList = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_CURRENT_CONTACT':
        return {
          ...state,
          selectedContact: {
            ...action.payload,
          },
        };
      case 'SET_ALL_CONTACTS':
        return {
          ...state,
          allContacts: action.payload,
        };
      case 'SET_ROUTES':
        return {
          ...state,
          routes: action.payload,
        };
      case 'ADD_CONTACT':
          return{
            ...state,
            allContacts: [...state.allContacts, action.payload]
          };
          case 'TOGGLE_ADD_CONTACT':
                return {
                  ...state,
                  isAddingContact: !state.isAddingContact,
                };
        default:
                return state;
        }
}

export default contactList;