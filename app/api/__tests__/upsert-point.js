// https://github.com/EnCiv/civil-pursuit/issues/129

import upsertPoint from '../upsert-point';
import Points from '../../models/points';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

let client;
let db;

beforeAll(async () => {
    const mongoServer = new MongoMemoryServer();
    client = await MongoClient.connect(await mongoServer.getUri(), {});
    db = client.db();
    Points.setCollectionProps();
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
