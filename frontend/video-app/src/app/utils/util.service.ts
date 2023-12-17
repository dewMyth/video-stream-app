import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private _httpClient: HttpClient) {}

  urlShortner(url: string): Observable<string> {
    const payload = {
      url: url,
      description: 'string',
    };

    return this._httpClient
      .post<{ data: { tiny_url: string } }>(
        'https://api.tinyurl.com/create?api_token=7IccU5XpdM0xn1J4RYKAuYpSwelLTrdl8fQdhz7uNYtdHTtW7gCU0E8PxsP1',
        payload
      )
      .pipe(map((response) => response.data.tiny_url));
  }
}
