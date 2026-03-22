import type { HttpTransport } from '../transport.js';
import type {
  Action, ActionType, PaginatedResponse, PaginationParams,
  ExecuteActionRequest, CreateActionTypeRequest,
} from '../types.js';

export class EventBusModule {
  constructor(private http: HttpTransport) {}

  async execute(body: ExecuteActionRequest): Promise<Action> {
    return this.http.request('POST', '/ebus/execute', { body });
  }

  async listActions(params?: PaginationParams): Promise<PaginatedResponse<Action>> {
    return this.http.request('GET', '/ebus/action-logs', { query: params });
  }

  async getAction(actionId: string): Promise<Action> {
    return this.http.request('GET', `/ebus/action-logs/${actionId}`);
  }

  async executeBatch(actions: ExecuteActionRequest[]): Promise<Action[]> {
    return this.http.request('POST', '/ebus/actions/batch', { body: { actions } });
  }

  async listActionTypes(params?: PaginationParams): Promise<PaginatedResponse<ActionType>> {
    return this.http.request('GET', '/ebus/action-types', { query: params });
  }

  async createActionType(body: CreateActionTypeRequest): Promise<ActionType> {
    return this.http.request('POST', '/ebus/action-types', { body });
  }

  async getActionType(actionTypeId: string): Promise<ActionType> {
    return this.http.request('GET', `/ebus/action-types/${actionTypeId}`);
  }

  async updateActionType(actionTypeId: string, body: Partial<ActionType>): Promise<ActionType> {
    return this.http.request('PUT', `/ebus/action-types/${actionTypeId}`, { body });
  }
}
