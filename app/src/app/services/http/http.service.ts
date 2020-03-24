import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth/auth.service';
import { ConfigService } from '../config/config.service';

/**
 * Class used for http request
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly baseUrl: string;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('api');
  }

  get(path: string, query: Record<string, any> = null) {
    const url = this.baseUrl + path;

    return this.httpClient.get(url, {
      params: query,
      headers: {
        ...this.getAuth(),
      },
    });
  }

  post(path: string, body: any, query: Record<string, any> = null) {
    const url = this.baseUrl + path;

    return this.httpClient.post(url, body, {
      params: query,
      headers: {
        ...this.getAuth(),
      },
    });
  }

  put(path: string, body: any, query: Record<string, any> = null) {
    const url = this.baseUrl + path;

    return this.httpClient.put(url, body, {
      params: query,
      headers: {
        ...this.getAuth(),
      },
    });
  }

  delete(path: string, query: Record<string, any> = null) {
    const url = this.baseUrl + path;

    return this.httpClient.delete(url, {
      params: query,
      headers: {
        ...this.getAuth(),
      },
    });
  }

  private getAuth() {
    const token = this.authService.getToken();
    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
