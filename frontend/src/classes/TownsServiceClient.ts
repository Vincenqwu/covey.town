import axios, { AxiosInstance, AxiosResponse } from 'axios';
import assert from 'assert';
import { ServerPlayer } from './Player';
import { ServerConversationArea } from './ConversationArea';

/**
 * The format of a request to join a Town in Covey.Town, as dispatched by the server middleware
 */
export interface TownJoinRequest {
  /** userName of the player that would like to join * */
  userName: string;
  /** ID of the town that the player would like to join * */
  coveyTownID: string;
  /**
   * 
   */
  accountUsername?: string;
}

/**
 * The format of a response to join a Town in Covey.Town, as returned by the handler to the server
 * middleware
 */
export interface TownJoinResponse {
  /** Unique ID that represents this player * */
  coveyUserID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  coveySessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: ServerPlayer[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Names and occupants of any existing ConversationAreas */
  conversationAreas: ServerConversationArea[];
}

/**
 * Payload sent by client to create a Town in Covey.Town
 */
export interface TownCreateRequest {
  username: string;
  friendlyName: string;
  isPubliclyListed: boolean;
}

/**
 * Response from the server for a Town create request
 */
export interface TownCreateResponse {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Response from the server for a Town list request
 */
export interface TownListResponse {
  towns: CoveyTownInfo[];
}

/**
 * Payload sent by the client to delete a Town
 */
export interface TownDeleteRequest {
  coveyTownID: string;
  coveyTownPassword: string;
}

/**
 * Payload sent by the client to update a Town.
 * N.B., JavaScript is terrible, so:
 * if(!isPubliclyListed) -> evaluates to true if the value is false OR undefined, use ===
 */
export interface TownUpdateRequest {
  coveyTownID: string;
  coveyTownPassword: string;
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export interface ConversationCreateRequest {
  coveyTownID: string;
  sessionToken: string;
  conversationArea: ServerConversationArea;
}

/**
 * Envelope that wraps any response from the server
 */
export interface ResponseEnvelope<T> {
  isOK: boolean;
  message?: string;
  response?: T;
}

export interface UserUpdateRequest {
  username: string;
  password: string;
  email: string;
}

export type CoveyTownInfo = {
  friendlyName: string;
  coveyTownID: string;
  currentOccupancy: number;
  maximumOccupancy: number
};

export type CoveyTownInfoForUser = {
  _id: string,
  coveyTownId: string,
  userId: string,
  townUpdatePassword: string,
  isPublic: boolean,
  friendlyName: string,
  capacity: number,
  createdAt: string,
  updatedAt: string,
  __v: number;
};

export interface RequestHeader {
  'x-access-token': string;
}
export interface RequestConfig {
  headers: RequestHeader;
}

export interface UserRegisterRequest {
  username: string;
  password: string;
  email: string;
}

/**
 * Payload sent by the client to sign in a user
 */
export interface UserLoginRequest {
  username: string;
  password: string;
}

export default class TownsServiceClient {
  private _axios: AxiosInstance;

  /**
   * Construct a new Towns Service API client. Specify a serviceURL for testing, or otherwise
   * defaults to the URL at the environmental variable REACT_APP_ROOMS_SERVICE_URL
   * @param serviceURL
   */
  constructor(serviceURL?: string) {
    const baseURL = serviceURL || process.env.REACT_APP_TOWNS_SERVICE_URL;
    assert(baseURL);
    this._axios = axios.create({ baseURL });
  }

  static unwrapOrThrowError<T>(response: AxiosResponse<ResponseEnvelope<T>>, ignoreResponse = false): T {
    if (response.data.isOK) {
      if (ignoreResponse) {
        return {} as T;
      }
      assert(response.data.response);
      return response.data.response;
    }
    throw new Error(`Error processing request: ${response.data.message}`);
  }

  async createTown(requestData: TownCreateRequest, requestConfig: RequestConfig): Promise<TownCreateResponse> {
    const responseWrapper = await this._axios.post<ResponseEnvelope<TownCreateResponse>>('/towns', requestData, requestConfig);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async updateTown(requestData: TownUpdateRequest, requestConfig: RequestConfig): Promise<void> {
    const responseWrapper = await this._axios.patch<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}`, requestData, requestConfig);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async deleteTown(requestData: TownDeleteRequest): Promise<void> {
    const responseWrapper = await this._axios.delete<ResponseEnvelope<void>>(`/towns/${requestData.coveyTownID}/${requestData.coveyTownPassword}`);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper, true);
  }

  async listTowns(requestConfig: RequestConfig): Promise<TownListResponse> {
    const responseWrapper = await this._axios.get<ResponseEnvelope<TownListResponse>>('/towns', requestConfig);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async joinTown(requestData: TownJoinRequest, requestConfig: RequestConfig): Promise<TownJoinResponse> {
    const responseWrapper = await this._axios.post('/sessions', requestData, requestConfig);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }
  
  async createConversation(requestData: ConversationCreateRequest, requestConfig: RequestConfig) : Promise<void>{
    const responseWrapper = await this._axios.post(`/towns/${requestData.coveyTownID}/conversationAreas`, requestData, requestConfig);
    return TownsServiceClient.unwrapOrThrowError(responseWrapper);
  }

  async userRegister(requestData: UserRegisterRequest) : Promise<any>{
    const responseWrapper = await this._axios.post('/users/register', requestData);
    return responseWrapper;
  }

  async userLogin(requestData: UserLoginRequest) : Promise<any>{
    const responseWrapper = await this._axios.post('/users/login', requestData);
    return responseWrapper;
  }

  async deleteUser(username: string, requestConfig: RequestConfig) : Promise<any>{
    const responseWrapper = await this._axios.delete(`/users/${username}`, requestConfig);
    return responseWrapper;
  }

  async updateUser(requestData: UserUpdateRequest, requestConfig: RequestConfig) : Promise<any>{
    const responseWrapper = await this._axios.put(`/users/${requestData.username}`, requestData, requestConfig);
    return responseWrapper;
  }

  async getUser(username: string, requestConfig: RequestConfig) : Promise<any>{
    const responseWrapper = await this._axios.get(`/users/${username}`, requestConfig);
    return responseWrapper;
  }

  async userValidateJWT(requestConfig: RequestConfig) : Promise<any>{
    const responseWrapper = await this._axios.get('/users/validate', requestConfig);
    return responseWrapper;
  }
  


}
