import Points from '../../models/points';
import { Mongo } from '@enciv/mongo-collections';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';

const USER1 = '6667d5a33da5d19ddc304a6b';
const POINT1 = new ObjectId('6667d688b20d8e339ca50020');
let MemoryServer;

beforeAll(async () => {
    MemoryServer = await MongoMemoryServer.create();
    const uri = MemoryServer.getUri()
    await Mongo.connect(uri)
})

afterAll(async () => {
    await Mongo.disconnect()
    await MemoryServer.stop()
})

describe('Point property validation', () => {
    test('_id validation passes for valid _id', () => {
        const invalidPoint = {
            _id: 'invalid',
            title: 'valid',
            description: 'valid'
        }
        const validation = Points.validate(invalidPoint)
        expect(validation.error).toBeDefined()
        expect(validation.error).toBe("\"_id\" with value \"invalid\" fails to match the valid mongo id pattern")
    })

    test('_id validation passes for valid _id', () => {
        const validPoint = {
            _id: POINT1.toHexString(),
            title: 'valid',
            description: 'valid'
        }
        const validation = Points.validate(validPoint)
        expect(validation.result).toBeDefined()
    })


})
