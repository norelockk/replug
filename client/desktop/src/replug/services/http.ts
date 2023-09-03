import { IS_DEVELOPMENT } from '@/const';

import { LogLevel } from '../../../../../shared/enums/Logger';
import { HttpMethod } from '@/types';

import Logger from '../logger';

const LOGGER: Logger = new Logger(IS_DEVELOPMENT ? LogLevel.DEBUG : 0, 'services.Http');

interface HttpClientConfig {
  baseUrl: string;
  token?: string;
  timeout?: number;
}

export default class HttpClient {
  private baseUrl: string;
  private token?: string;
  private timeout: number;
  private requestInterceptors: ((config: RequestInit) => RequestInit)[];
  private responseInterceptors: ((response: Response) => Response | Promise<Response>)[];

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl;
    this.token = config.token;
    this.timeout = config.timeout || 10000;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  addRequestInterceptor(interceptor: (config: RequestInit) => RequestInit) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T>(
    method: HttpMethod,
    endpoint: string,
    data?: Record<string, any>,
    queryParams?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${window.location.protocol}//${this.baseUrl}/${endpoint}`);
    if (queryParams) {
      for (const key in queryParams) {
        url.searchParams.append(key, queryParams[key]);
      }
    }

    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    let requestOptions: RequestInit = {
      method,
      headers,
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
    }

    for (const interceptor of this.requestInterceptors) requestOptions = interceptor(requestOptions);

    const controller: AbortController = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const response = await fetch(url.toString(), { ...requestOptions, signal });
      clearTimeout(timeoutId);

      let finalResponse = response;
      for (const interceptor of this.responseInterceptors) finalResponse = await interceptor(finalResponse);

      if (!finalResponse.ok) throw new Error(`HTTP Error: ${finalResponse.status}`);

      return finalResponse.json() as Promise<T>;
    } catch (error) {
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    queryParams?: Record<string, string>
  ): Promise<T> {
    return this.request('GET', endpoint, undefined, queryParams);
  }

  async post<T>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<T> {
    return this.request('POST', endpoint, data);
  }

  async put<T>(
    endpoint: string,
    data: Record<string, any>
  ): Promise<T> {
    return this.request('PUT', endpoint, data);
  }

  async delete<T>(
    endpoint: string,
    queryParams?: Record<string, string>
  ): Promise<T> {
    return this.request('DELETE', endpoint, undefined, queryParams);
  }
}