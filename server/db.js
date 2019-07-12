const Sequelize = require('sequelize');

const Conn = new Sequelize(
    'address_book',
    'ayema',
    '183714',
    {
        dialect: 'postgres',
        host: 'localhost'
    }
); 

const Contact = Conn.define('contacts', {
    displayName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    company: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

const Pet = Conn.define('pets', {
    displayName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    petType: {
        type: Sequelize.ENUM('dog', 'cat', 'bird'),
        allowNull: false
    }
});

const Relationship = Conn.define('relationships', {
    iAm: {
        type: Sequelize.STRING,
        allowNull: false
    },
    relatedTo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Relations
const petTag = Conn.define('petTag', {});
Contact.hasMany(Pet);
Pet.belongsToMany(Contact, { through: petTag});
Contact.hasMany(Relationship);
Relationship.belongsTo(Contact);



// Conn.sync({ force: false })
//     .then(() => {
//         console.log(`Database and tables created`)
//     })


// const { Conn, Contact, Pet, Relationship } = require('./db');
const {green, red} = require('chalk');

const contacts = [
    {
    displayName: "Kenneth Lai",
    title: "Software Engineer",
    company: "Grapevine",
    location: "New York City"
    },
    {
    displayName: "Andrew Reiner",
    title: "Cofounder",
    company: "Grapevine",
    location: "New York City"
    },
    {
    displayName: "Lloyd Emelle",
    title: "Lead Hacker",
    company: "Grapevine",
    location: "New York City"
    },
    {
    displayName: "Rich Prior",
    title: "Lead Designer",
     company: "Grapevine",
    location: "New York City"
    },
    {
        displayName: "Gina Lee",
        title: "CEO",
        company: "BanCard Plus",
        location: "New York City"
    },
    {
        displayName: "Kristen Reiner",
        title: "Investor Relations Business Development",
        company: "The Blackstone Group",
        location: "New York City"
    },
    {
        displayName: "Stacey",
        title: null,
        company: null,
        location: "New York City"
    },
    {
        displayName: "Leah Prior",
        title: null,
        company: null,
        location: "New York City",
    }
]

const pets = [
    {
        displayName: "Nike",
        petType: 'dog',
        contactId: 2
    },
    {
        displayName: "Jjong",
        petType: 'dog',
        contactId: 5
    },
    {
        displayName: "Sweetie",
        petType: 'cat',
        contactId: 5
    }
]

const relationships = [
    {
        iAm: "Kenneth Lai",
        relatedTo: "Gina Lee",
        type: 'Boyfriend',
        contactId: 5
    },
    {
        iAm: "Gina Lee",
        relatedTo: "Kenneth Lai",
        type: 'Girlfriend',
        contactId: 1
    },
    {
        iAm: "Andrew Renier",
        relatedTo: "Kristen Reiner",
        type: 'Husband',
        contactId: 6
    },
    {
        iAm: "Kristen Reiner",
        relatedTo: "Andrew Renier",
        type: 'Wife',
        contactId: 2
    },
    {
        iAm: "Lloyd Emelle",
        relatedTo: "Stacey",
        type: 'Boyfriend',
        contactId: 7
    },
    {
        iAm: "Stacey",
        relatedTo: "Lloyd Emelle",
        type: 'Girlfriend',
        contactId: 3
    },
    {
        iAm: "Rich Prior",
        relatedTo: "Leah Prior",
        type: 'Husband',
        contactId: 8
    },
    {
        iAm: "Leah Prior",
        relatedTo: "Rich Prior",
        type: 'Wife',
        contactId: 4
    }
]


const seed = async() => {
    await Conn.sync({force: true});

    await Promise.all(contacts.map(contact => Contact.create(contact)));
    await Promise.all(pets.map(pet => Pet.create(pet)));
    await Promise.all(relationships.map(relationship => Relationship.create(relationship)));

    console.log(green('Seeding success'));
};

seed()
    .catch(err => {
        console.error(red('Oh noes! Something went wrong!'));
        console.error(err);
});

module.exports = Conn;
