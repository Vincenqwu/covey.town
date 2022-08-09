import assert from 'assert';
import CORS from 'cors';
import Express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { nanoid } from 'nanoid';
import { AddressInfo } from 'net';
import addTownRoutes from '../router/towns';
import userRouter from '../router/users';
import TownsServiceClient, { TownListResponse } from './TownsServiceClient';
import * as dbHandler from './db-handler';
import User from '../models/user';
import Town from '../models/town';


type TestTownData = {
  friendlyName: string;
  coveyTownID: string;
  isPubliclyListed: boolean;
  townUpdatePassword: string;
};

function expectTownListMatches(towns: TownListResponse, town: TestTownData) {
  const matching = towns.towns.find(townInfo => townInfo.coveyTownID === town.coveyTownID);
  if (town.isPubliclyListed) {
    expect(matching).toBeDefined();
    assert(matching);
    expect(matching.friendlyName).toBe(town.friendlyName);
  } else {
    expect(matching).toBeUndefined();
  }
}

describe('UserServiceAPIREST', () => {
  let server: http.Server;
  let apiClient: TownsServiceClient;

  async function createTownForTesting(
    token: string,
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
    }, {
      headers: {
        'x-access-token': token,
      },
    });
    return {
      friendlyName,
      isPubliclyListed: isPublic,
      coveyTownID: ret.coveyTownID,
      townUpdatePassword: ret.coveyTownPassword,
    };
  }

  async function registerUserForTesting(username: string, password: string, email: string): Promise<any> {
    const ret = await apiClient.userRegister({
      username,
      password,
      email,
    });
    return ret;
  }

  beforeAll(async () => {
    await dbHandler.connect();

    const app = Express();
    app.use(CORS());
    server = http.createServer(app);

    addTownRoutes(server, app);
    app.use('/users', userRouter);
    await server.listen();
    const address = server.address() as AddressInfo;

    apiClient = new TownsServiceClient(`http://127.0.0.1:${address.port}`);
  });
  /**
   * Clear all test data after every test.
   */
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });
  afterAll(async () => {
    await dbHandler.closeDatabase();
    await server.close();
  });
  describe('UserRegisterAPI', () => {
    it('Expect a user to register with username, password, and email successfully', async () => {
      const res = await registerUserForTesting('testuser1', 'testuser1', 'test1@gmail.com');
      expect(res.status).toBe(200);
    });
    it('Fail to register with duplicated username', async () => {
      await registerUserForTesting('testuser2', 'testuser2', 'test2@gmail.com');
      try {
        await registerUserForTesting('testuser2', 'testuser2', 'test2@gmail.com');
        fail('Expect username to be unique');
      } catch (err) {
        // Expected error
      }
    });
  });
  describe('UserLogInAPI', () => {
    beforeAll(async () => {
      await registerUserForTesting('testuser3', 'testuser3', 'test3@gmail.com');
    });
    it('Expect a user to login successfully', async () => {
      const res = await apiClient.userLogin({
        username: 'testuser3',
        password: 'testuser3',
      });
      expect(res.status).toBe(200);
    });
    it('Login fail if username is incorrect', async () => {
      try {
        const res = await apiClient.userLogin({
          username: 'falseusername',
          password: 'testuser3',
        });
        fail('Expect valid username');
      } catch (err) {
        // Expected error
      }
    });
    it('Login fail if password is incorrect', async () => {
      try {
        const res = await apiClient.userLogin({
          username: 'testuser3',
          password: 'falsepassword',
        });
        fail('Expect valid password');
      } catch (err) {
        // Expected error
      }
    });
  });
  describe('ValidateToken', () => {
    let token: string;
    beforeAll(async () => {
      await registerUserForTesting('testuser4', 'testuser4', 'test4@gmail.com');
      const res = await apiClient.userLogin({
        username: 'testuser4',
        password: 'testuser4',
      });
      token = res.data.token;
    });
    it('User validated with token is successful', async () => {
      const res = await apiClient.userValidateJWT({
        headers: {
          'x-access-token': token,
        },
      });
      expect(res.status).toBe(200);
    });
    it('User failed to validate with invalid token', async () => {
      try {
        await apiClient.userValidateJWT({
          headers: {
            'x-access-token': 'invalidtoken',
          },
        });
        fail('expect valid token');
      } catch (err) {
        // Expected error
      }
    });
  });
  describe('UserUpdateDelete', () => {
    let token: string;
    beforeAll(async () => {
      await registerUserForTesting('testuser5', 'testuser5', 'test5@gmail.com');
      const res = await apiClient.userLogin({
        username: 'testuser5',
        password: 'testuser5',
      });
      token = res.data.token;
    });
    it('User is updated successfully', async () => {
      let res = await apiClient.updateUser(
        {
          username: 'testuser5',
          password: '',
          email: 'updatedtest5@gmail.com',
        },
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      expect(res.status).toBe(200);
      res = await apiClient.getUser(
        'testuser5',
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      expect(res.data.email).toBe('updatedtest5@gmail.com');
    });
    it('User is deleted successfully', async () => {
      const res = await apiClient.deleteUser(
        'testuser5',
        {
          headers: {
            'x-access-token': token,
          },
        },
      );
      expect(res.status).toBe(200);
      const user = await User.findOne({ username: 'testuser5' });
      expect(user).toBe(null);
    });
  });
  describe('GetUserTownsAPI', () => {
    let token: string;
    beforeAll(async () => {
      await registerUserForTesting('testuser6', 'testuser6', 'test6@gmail.com');
      const res = await apiClient.userLogin({
        username: 'testuser6',
        password: 'testuser6',
      });
      token = res.data.token;
      await createTownForTesting(token, 'testuser6', 'friendlyTownForTest', true); 
    });
    it('CoveyTown is created successfully and has the correct userId', async () => {
      const user = await User.findOne({ username: 'testuser6' });
      const town = await Town.find({ userId: user?._id });
      expect(town.length).toBe(1);
      expect(town[0].userId).toBe(user?._id.toString());
    });
  });

});
