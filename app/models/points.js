// app/models/points.js
const { Collection } = require('mongo-collections');

class Points extends Collection {
    static collectionName = 'points'; // name of the collection in MongoDB

    // Optional: Collection options objectt as defined in MongoDB createCollection
    static collectionOptions = {};

    // Optional: indexes array as defined in db.collection.createIndexes
    static collectionIndexes = [
        { key: { title: 1 }, name: 'title_index', unique: true }
    ];

    // Optional: Validation function
    static validate(doc) {
        if (!doc.title || !doc.description) {
            return { error: 'Title and description are required' };
        }
        return { result: doc };
    }

    // Initialize the point collection with some initial documents
    static initialDocs = [
        {
            _id: 'initial_point_1',
            title: 'Initial Point 1',
            description: 'This is the initial point 1.'
        },
        {
            _id: 'initial_point_2',
            title: 'Initial Point 2',
            description: 'This is the initial point 2.'
        }
    ];
}

Points.setCollectionProps(); // initialize the collection with the properties

module.exports = Points;
