// app/apis/tests/upsert-point.test.js
const upsertPoint = require('../upsert-point');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const Points = require('../../models/points');

let client;
let db;

beforeAll(async () => {
    const mongoServer = new MongoMemoryServer();
    client = await MongoClient.connect(await mongoServer.getUri(), {});
    db = client.db();
    Points.setCollectionProps(); // Initialize collection properties
});

afterAll(async () => {
    await client.close();
});

test('Upsert a new document', async () => {
    const pointObj = { _id: '1', title: 'Point 1', description: 'Description 1' };
    const user = { id: 'user1' };

    const cb = jest.fn();

    await upsertPoint.call({ synuser: user }, pointObj, cb);

    expect(cb).toHaveBeenCalledTimes(1);
    const point = await db.collection('points').findOne({ _id: '1' });
    expect(point).toEqual({ ...pointObj, userId: 'user1' });
});

test('Upsert changes to an existing document', async () => {
    const pointObj = { _id: '1', title: 'Updated Point 1', description: 'Updated Description 1' };
    const user = { id: 'user1' };

    const cb = jest.fn();

    await upsertPoint.call({ synuser: user }, pointObj, cb);

    expect(cb).toHaveBeenCalledTimes(1);
    const point = await db.collection('points').findOne({ _id: '1' });
    expect(point).toEqual({ ...pointObj, userId: 'user1' });
});

test('User not logged in, not allowed to upsert a document', async () => {
    const pointObj = { _id: '2', title: 'Point 2', description: 'Description 2' };
    const cb = jest.fn();

    await upsertPoint.call({}, pointObj, cb);

    expect(cb).toHaveBeenCalledTimes(1);
    const point = await db.collection('points').findOne({ _id: '2' });
    expect(point).toBeNull();
});
