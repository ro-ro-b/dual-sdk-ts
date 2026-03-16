import type { HttpTransport } from '../transport.js';
import type { Action, ActionType, PaginatedResponse } from '../types.js';

export class EventBusModule {
  constructor(private http: HttpTransport) {}

  async execute(body: { action_type: string; payload?: Record<string, unknown> } & Record<string, unknown>): Promise<Action> {
    return this.http.request('POST', '/ebus/actions', { body });
  }

  async listActions(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<Action>> {
    return this.http.request('GET', '/ebus/actions', { query: params });
  }

  async getAction(actionId: string): Promise<Action> {
    return this.http.request('GET', `/ebus/actions/${actionId}`);
  }

  async executeBatch(actions: Array<Record<string, unknown>>): Promise<Action[]> {
    return this.http.request('POST', '/ebus/actions/batch', { body: { actions } });
  }

  async listActionTypes(params?: { limit?: number; next?: string }): Promise<PaginatedResponse<ActionType>> {
    return this.http.request('GET', '/ebus/action-types', { query: params });
  }

  async createActionType(body: { name: string } & Record<string, unknown>): Promise<ActionType> {
    return this.http.request('POST', '/ebus/action-types', { body });
  }

  async getActionType(actionTypeId: string): Promise<ActionType> {
    return this.http.request('GET', `/ebus/action-types/${actionTypeId}`);
  }

  async updateActionType(actionTypeId: string, body: Partial<ActionType>): Promise<ActionType> {
    return this.http.request('PUT', `/ebus/action-types/${actionTypeId}`, { body });
  }
}
