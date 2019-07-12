const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
  } = require('graphql');

  const Db = require('./db');

const Pet = new GraphQLObjectType({
    name: 'Pet',
    description: 'Represents a pet',
    fields() {
        return {
            id: {
                type: GraphQLInt,
                resolve (pet) {
                  return pet.id;
                }
              },
            displayName: {
                type: GraphQLString,
                resolve (pet) {
                    return pet.displayName;
                }
            },
            petType: {
                type: GraphQLString,
                resolve (pet) {
                    return pet.petType;
                }
            }
        }
    }
})

const Relationship = new GraphQLObjectType({
    name: 'Relationship',
    description: 'Represents a relationship',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve (relationship) {
                     return relationship.id;
                }
              },
            iAm: {
                type: GraphQLString,
                resolve (relationship) {
                     return relationship.iAm;
                }
            },
            relatedTo: {
                type: GraphQLString,
                resolve (relationship) {
                     return relationship.relatedTo;
                }
            },
            type: {
                type: GraphQLString,
                resolve (relationship) {
                    return relationship.type;
                }
            }
        }
    }
});

const Contact = new GraphQLObjectType({
    name: 'Contact',
    description: 'Represents a contact',
    fields () {
        return {
            id: {
                type: GraphQLInt,
                resolve (contact) {
                  return contact.id;
                }
              },
            displayName: {
                type: GraphQLString,
                resolve (contact) {
                  return contact.displayName;
                }
            },
            title: {
                type: GraphQLString,
                resolve (contact) {
                  return contact.title;
                }
            },
            location: {
                type: GraphQLString,
                resolve (contact) {
                  return contact.location;
                }
            },
            company: {
                type: GraphQLString,
                resolve (contact) {
                  return contact.company;
                }
            },
            pets: {
                type: new GraphQLList(Pet),
                resolve (contact) {
                  return contact.getPets();
                }
            },
            relationships: {
                type: new GraphQLList(Relationship),
                resolve (contact, contactId) {
                  return contact.getRelationships(contactId);
                }
            },
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'root query objec',
    fields() {
        return {
            oneContact: {
                type: new GraphQLList(Contact),
                args: {
                    id: {
                      type: GraphQLInt
                    },
                    displayName: {
                        type: GraphQLString
                    }
                },
                    resolve (root, args) {
                        return Db.models.contacts.findAll({ where: args });
                      }
             },
            allContacts: {
                type: new GraphQLList(Contact),
                resolve: function () {
                    const contacts = Db.models.contacts.findAll({
                        order: [
                          ['id', 'ASC']
                        ],
                      })
                      if (!contacts) {
                        throw new Error('Error')
                      }
                      return contacts
                    }
                },
            }
        }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Functions to set',
    fields() {
        return {
            addContact: {
                type: Contact,
                args: {
                    displayName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    title: {
                        type: GraphQLString
                    },
                    location: {
                        type: GraphQLString
                    },
                    company: {
                        type: GraphQLString
                    },
                },
                resolve (source, args) {
                    return Db.models.contacts.create({
                        displayName: args.displayName,
                        title: args.title,
                        location: args.location,
                        company: args.company
                    })
                }
            },
            addPet: {
                type: Pet,
                args: {
                    ownerId: {
                        type: GraphQLNonNull(GraphQLInt)
                    },
                    displayName: {
                        type: GraphQLNonNull(GraphQLString)
                    },
                    petType: {
                        type: GraphQLNonNull(GraphQLString)
                    }
                },
                resolve (source, args) {
                    return Db.models.contacts.findOne({
                        where: {
                            id: args.ownerId
                        }
                    })
                    .then( contact => {
                        return contact.createPet({
                            displayName: args.displayName,
                            petType: args.petType
                        })
                    })
                }
            },
            addRelationship: {
                type: Relationship,
                args: {
                    relationId: {
                        type: GraphQLNonNull(GraphQLInt)
                    },
                    iAm: {
                        type: GraphQLNonNull(GraphQLString)
                    },
                    relatedTo: {
                        type: GraphQLNonNull(GraphQLString)
                    },
                    type: {
                        type: GraphQLNonNull(GraphQLString)
                    }
                },
                resolve (source, args) {
                    return Db.models.contacts.findOne({
                        where: {
                            displayName: args.relatedTo
                        }
                    })
                    .then( contact => {
                        return contact.createRelationship({
                            iAm: args.iAm,
                            relatedTo: args.relatedTo,
                            type: args.type
                        })
                    })
                }
            }
        }
    }
})

const Schema = new GraphQLSchema({
    query:  Query,
    mutation: Mutation
});

module.exports = Schema;