import Express, { Request, Response, NextFunction } from 'express';
import CORS from 'cors';
import http from 'http';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import * as TestUtils from './TestUtils';

import { UserLocation } from '../CoveyTypes';
import TownsServiceClient from './TownsServiceClient';
import addTownRoutes from '../router/towns';
import * as dbHandler from './db-handler';
import User from '../models/user';


jest.mock('../middleware/verifyJWT', () => jest.fn((_req: Request, _res: Response, next: NextFunction) => {
  next();
}));

type TestTownData = {
  friendlyName: string, coveyTownID: string,
  isPubliclyListed: boolean, townUpdatePassword: string
};

describe('TownServiceApiSocket', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;

  async function createTownForTesting(    
    username: string,
    friendlyNameToUse?: string, 
    isPublic = false): Promise<TestTownData> {
    const friendlyName = friendlyNameToUse !== undefined ? friendlyNameToUse :
      `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
    const ret = await apiClient.createTown({
      username,
      friendlyName,
      isPubliclyListed: isPublic,
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      coveyTownID: ret.coveyTownID,
      townUpdatePassword: ret.coveyTownPassword,
    };
  }
  async function createUserForTesting(username: string, password: string, email: string): Promise<string> {
    // create new user
    const newUser = new User({
      username,
      email,
      password,
    });
    await newUser.save();
    const user = await User.find({});
    return user[0].username.valueOf();
  }

  beforeAll(async () => {
    await dbHandler.connect();
    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addTownRoutes(server, app);
    server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
    server.close();
    TestUtils.cleanupSockets();
  });
  afterEach(async () => {
    TestUtils.cleanupSockets();
    await dbHandler.clearDatabase();
  });
  it('Rejects invalid CoveyTownIDs, even if otherwise valid session token', async () => {
    const username = await createUserForTesting('testUser', '111111111', 'test@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const { socketDisconnected } = TestUtils.createSocketClient(server, joinData.coveySessionToken, nanoid());
    await socketDisconnected;
  });
  it('Rejects invalid session tokens, even if otherwise valid town id', async () => {
    const username = await createUserForTesting('testUser1', '111111111', 'test1@gmail.com');
    const town = await createTownForTesting(username);
    await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const { socketDisconnected } = TestUtils.createSocketClient(server, nanoid(), town.coveyTownID);
    await socketDisconnected;
  });
  it('Dispatches movement updates to all clients in the same town', async () => {
    const username = await createUserForTesting('testUser2', '111111111', 'test2@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const joinData2 = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const joinData3 = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const socketSender = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID).socket;
    const { playerMoved } = TestUtils.createSocketClient(server, joinData2.coveySessionToken, town.coveyTownID);
    const { playerMoved: playerMoved2 } = TestUtils.createSocketClient(server, joinData3.coveySessionToken, town.coveyTownID);
    const newLocation: UserLocation = { x: 100, y: 100, moving: true, rotation: 'back' };
    socketSender.emit('playerMovement', newLocation);
    const [movedPlayer, otherMovedPlayer] = await Promise.all([playerMoved, playerMoved2]);
    expect(movedPlayer.location).toMatchObject(newLocation);
    expect(otherMovedPlayer.location).toMatchObject(newLocation);
  });
  it('Invalidates the user session after disconnection', async () => {
    // This test will timeout if it fails - it will never reach the expectation
    const username = await createUserForTesting('testUser3', '111111111', 'test3@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const { socket, socketConnected } = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID);
    await socketConnected;
    socket.close();
    const { socket: secondTryWithSameToken, socketDisconnected: secondSocketDisconnected } = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID);
    await secondSocketDisconnected;
    expect(secondTryWithSameToken.disconnected).toBe(true);
  });
  it('Informs all new players when a player joins', async () => {
    const username = await createUserForTesting('testUser4', '111111111', 'test4@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const joinData2 = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const { socketConnected, newPlayerJoined } = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID);
    const {
      socketConnected: connectPromise2,
      newPlayerJoined: newPlayerPromise2,
    } = TestUtils.createSocketClient(server, joinData2.coveySessionToken, town.coveyTownID);
    await Promise.all([socketConnected, connectPromise2]);
    const newJoinerName = nanoid();

    await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: newJoinerName });
    expect((await newPlayerJoined)._userName).toBe(newJoinerName);
    expect((await newPlayerPromise2)._userName).toBe(newJoinerName);

  });
  it('Informs all players when a player disconnects', async () => {
    const username = await createUserForTesting('testUse5', '111111111', 'tes5@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const joinData2 = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const userWhoLeaves = nanoid();
    const joinDataWhoLeaves = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: userWhoLeaves });
    const { socketConnected, playerDisconnected } = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID);
    const { socketConnected: connectPromise2, playerDisconnected: playerDisconnectPromise2 } = TestUtils.createSocketClient(server, joinData2.coveySessionToken, town.coveyTownID);
    const { socket: socketWhoLeaves, socketConnected: connectPromise3 } = TestUtils.createSocketClient(server, joinDataWhoLeaves.coveySessionToken, town.coveyTownID);
    await Promise.all([socketConnected, connectPromise2, connectPromise3]);
    socketWhoLeaves.close();
    expect((await playerDisconnected)._userName).toBe(userWhoLeaves);
    expect((await playerDisconnectPromise2)._userName).toBe(userWhoLeaves);

  });
  it('Informs all players when the town is destroyed', async () => {
    const username = await createUserForTesting('testUser6', '111111111', 'test6@gmail.com');
    const town = await createTownForTesting(username);
    const joinData = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const joinData2 = await apiClient.joinTown({ coveyTownID: town.coveyTownID, userName: nanoid() });
    const { socketDisconnected, socketConnected } = TestUtils.createSocketClient(server, joinData.coveySessionToken, town.coveyTownID);
    const { socketDisconnected: disconnectPromise2, socketConnected: connectPromise2 } = TestUtils.createSocketClient(server, joinData2.coveySessionToken, town.coveyTownID);
    await Promise.all([socketConnected, connectPromise2]);
    await apiClient.deleteTown({ coveyTownID: town.coveyTownID, coveyTownPassword: town.townUpdatePassword });
    await Promise.all([socketDisconnected, disconnectPromise2]);
  });
});
