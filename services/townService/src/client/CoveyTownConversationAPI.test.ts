import CORS from 'cors';
import Express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import { mock, mockReset } from 'jest-mock-extended';
import CoveyTownController from '../lib/CoveyTownController';
import CoveyTownsStore from '../lib/CoveyTownsStore';
import addTownRoutes from '../router/towns';
import * as requestHandlers from '../requestHandlers/CoveyTownRequestHandlers';
import { createConversationForTesting } from './TestUtils';
import TownsServiceClient, { ServerConversationArea } from './TownsServiceClient';
import * as dbHandler from './db-handler';
import User from '../models/user';


jest.mock('../middleware/verifyJWT', () => jest.fn((_req: Request, _res: Response, next: NextFunction) => {
  next();
}));

type TestTownData = {
  friendlyName: string;
  coveyTownID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

describe('Create Conversation Area API', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;

  async function createTownForTesting(
    username: string,
    friendlyNameToUse?: string,
    isPublic = false,
  ): Promise<TestTownData> {
    const friendlyName =
      friendlyNameToUse !== undefined
        ? friendlyNameToUse
        : `${isPublic ? 'Public' : 'Private'}TestingTown=${nanoid()}`;
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
    await server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  afterEach(async () => {await dbHandler.clearDatabase();});
  afterAll(async () => {
    await dbHandler.closeDatabase();
    await server.close();
  });
  it('Executes without error when creating a new conversation', async () => {
    const username = await createUserForTesting('testUser', '111111111', 'test@gmail.com');
    const testingTown = await createTownForTesting(username, undefined, true);
    const testingSession = await apiClient.joinTown({
      userName: nanoid(),
      coveyTownID: testingTown.coveyTownID,
    });
    await apiClient.createConversationArea({
      conversationArea: createConversationForTesting(),
      coveyTownID: testingTown.coveyTownID,
      sessionToken: testingSession.coveySessionToken,
    });
  });
});
describe('conversationAreaCreateHandler', () => {

  const mockCoveyTownStore = mock<CoveyTownsStore>();
  const mockCoveyTownController = mock<CoveyTownController>();
  beforeAll(() => {
    // Set up a spy for CoveyTownsStore that will always return our mockCoveyTownsStore as the singleton instance
    jest.spyOn(CoveyTownsStore, 'getInstance').mockReturnValue(mockCoveyTownStore);
  });
  beforeEach(() => {
    // Reset all mock calls, and ensure that getControllerForTown will always return the same mock controller
    mockReset(mockCoveyTownController);
    mockReset(mockCoveyTownStore);
    mockCoveyTownStore.getControllerForTown.mockReturnValue(mockCoveyTownController);
  });
  it('Checks for a valid session token before creating a conversation area', ()=>{
    const coveyTownID = nanoid();
    const conversationArea :ServerConversationArea = { boundingBox: { height: 1, width: 1, x:1, y:1 }, label: nanoid(), occupantsByID: [], topic: nanoid() };
    const invalidSessionToken = nanoid();

    // Make sure to return 'undefined' regardless of what session token is passed
    mockCoveyTownController.getSessionByToken.mockReturnValueOnce(undefined);

    requestHandlers.conversationAreaCreateHandler({
      conversationArea,
      coveyTownID,
      sessionToken: invalidSessionToken,
    });
    expect(mockCoveyTownController.getSessionByToken).toBeCalledWith(invalidSessionToken);
    expect(mockCoveyTownController.addConversationArea).not.toHaveBeenCalled();
  });
});