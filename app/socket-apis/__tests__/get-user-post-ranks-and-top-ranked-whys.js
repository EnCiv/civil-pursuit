// https://github.com/EnCiv/civil-pursuit/issues/208

import { MongoMemoryServer } from 'mongodb-memory-server';
import { Mongo } from '@enciv/mongo-collections';
import { ObjectId } from 'mongodb';
import Rankings from '../../models/rankings';
import Points from '../../models/points';
import getUserPostRanksAndTopRankedWhys from '../get-user-post-ranks-and-top-ranked-whys';

let memoryServer;
let db;

const synuser = { synuser: { id: new ObjectId().toString() } };

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create();
  const uri = memoryServer.getUri();
  await Mongo.connect(uri);
  db = Mongo.db;
  Rankings.setCollectionProps();
  Points.setCollectionProps();
});

afterAll(async () => {
  await Mongo.disconnect();
  await memoryServer.stop();
});

beforeEach(async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(async () => {
  console.error.mockRestore();
});

test('User not logged in', async () => {
  const callback = jest.fn();
  await getUserPostRanksAndTopRankedWhys.call({}, 'discussion1', 1, ['id1', 'id2'], callback);
  expect(callback).toHaveBeenCalledWith(undefined);
  expect(console.error).toHaveBeenCalledWith(expect.stringMatching(/no user logged in/));
});

test('10 points in ids, nothing ranked', async () => {
  const ids = Array.from({ length: 10 }, () => new ObjectId().toString());

  const callback = jest.fn();
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, ids, callback);

  expect(callback).toHaveBeenCalledWith({ ranks: [], whys: [] });
});

test('5 have 2 why mosts, 2 have why leasts, 1 has 1 why most, 1 has 1 why least – nothing ranked', async () => {
  const ids = Array.from({ length: 10 }, () => new ObjectId().toString());

  await db.collection('points').insertMany([
    ...ids.slice(0, 5).flatMap(id => [
      { _id: new ObjectId(), parentId: id, category: 'most', title: `Why Most 1 for ${id}`, userId: '123456' },
      { _id: new ObjectId(), parentId: id, category: 'most', title: `Why Most 2 for ${id}`, userId: '123456' },
    ]),
    ...ids.slice(5, 7).flatMap(id => [
      { _id: new ObjectId(), parentId: id, category: 'least', title: `Why Least 1 for ${id}`, userId: '123456' },
      { _id: new ObjectId(), parentId: id, category: 'least', title: `Why Least 2 for ${id}`, userId: '123456' },
    ]),
    { _id: new ObjectId(), parentId: ids[7], category: 'most', title: `Why Most for ${ids[7]}`, userId: '123456' },
    { _id: new ObjectId(), parentId: ids[8], category: 'least', title: `Why Least for ${ids[8]}`, userId: '123456' },
  ]);

  const callback = jest.fn();
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, ids, callback);

  expect(callback).toHaveBeenCalledWith({
    ranks: [],
    whys: expect.any(Array),
  });
});

test('Above scenario with 5 ranked, nothing for other 5', async () => {
  const ids = Array.from({ length: 10 }, () => new ObjectId().toString());

  const rankings = ids.slice(0, 5).map(id => ({
    _id: new ObjectId(),
    parentId: id,
    category: 'most',
    stage: 'post',
    discussionId: 'discussion1',
    round: 1,
    userId: '123456',
  }));

  if (rankings.length > 0) {
    await db.collection('rankings').insertMany(rankings);
  }

  const callback = jest.fn();
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, ids, callback);

  expect(callback).toHaveBeenCalledWith({
    ranks: expect.any(Array),
    whys: [],
  });
});

test('Above scenario with all ranked', async () => {
  const ids = Array.from({ length: 10 }, () => new ObjectId().toString());

  const rankings = ids.map(id => ({
    _id: new ObjectId(),
    parentId: id,
    category: 'most',
    stage: 'post',
    discussionId: 'discussion1',
    round: 1,
    userId: '123456',
  }));

  if (rankings.length > 0) {
    await db.collection('rankings').insertMany(rankings);
  }

  const callback = jest.fn();
  await getUserPostRanksAndTopRankedWhys.call(synuser, 'discussion1', 1, ids, callback);

  expect(callback).toHaveBeenCalledWith({
    ranks: expect.any(Array),
    whys: expect.any(Array),
  });
});
