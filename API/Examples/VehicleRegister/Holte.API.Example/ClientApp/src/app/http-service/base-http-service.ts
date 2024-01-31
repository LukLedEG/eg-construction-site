import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Injectable } from '@angular/core';

type HttpParamsObj = Record<string, string | number | boolean | readonly (string | number | boolean)[]>;

type HttpHeadersGetter = (headerName: string) => string;

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private readonly ApiExampleBaseAddress = 'https://localhost:7273/';

  protected constructor(protected readonly httpClient: HttpClient) {}

  resolveBackendUrl(url: string) {
    if (url.startsWith('/')) {
      url = url.substring(1);
    }

    console.log(`${this.ApiExampleBaseAddress}${url}`);

    return `${this.ApiExampleBaseAddress}${url}`;
  }

  post<T>(
    relativeUrl: string,
    data?: any,
    config?: { responseType: "json" },
    params?: HttpParamsObj,
  ): Observable<{ data?: T; headers?: HttpHeadersGetter }>;
  post(
    relativeUrl: string,
    data?: any,
    config?: { responseType: "arraybuffer" },
    params?: HttpParamsObj,
  ): Observable<{ data?: ArrayBuffer; headers?: HttpHeadersGetter }>;
  post<T>(
    relativeUrl: string,
    data?: any,
    config?: { responseType?: "json" | "arraybuffer" },
    params?: HttpParamsObj,
  ): Observable<{ data?: T | ArrayBuffer; headers?: HttpHeadersGetter }> {
    const url = this.resolveBackendUrl(relativeUrl);
    const httpParams = this.createHttpParams(params);
    return config?.responseType === "arraybuffer"
      // @ts-ignore
      ? this.httpClient.post(url, data, { responseType: "arraybuffer", observe: "response", params: httpParams }).pipe(
        map((result: any) => {
          return {
            data: result.body,
            headers: (key: string) => result.headers.get(key),
          };
        }),
      )
      // @ts-ignore
      : this.httpClient.post<T>(url, data, { observe: "response", params: httpParams }).pipe(
        map((result: any) => {
          return {
            data: result.body,
            headers: (key: string) => result.headers.get(key),
          };
        }),
      );
  }

  put<T>(relativeUrl: string, data?: any): Observable<{ data?: T }> {
    const url = this.resolveBackendUrl(relativeUrl);
    return this.httpClient.put<T>(url, data).pipe(
      map((result) => {
        return {
          data: result,
        };
      }),
    );
  }

  get<T>(
    relativeUrl: string,
    params?: HttpParamsObj,
    config?: { responseType?: "arraybuffer" | "json" | "text" | "blob"; headers?: HttpHeaders },
  ): Observable<{ data?: T | ArrayBuffer }> {
    const url = this.resolveBackendUrl(relativeUrl);
    const httpParams = this.createHttpParams(params);

    const options = {
      responseType: config?.responseType ?? 'json',
      params: httpParams,
      headers: config?.headers
    };

    return config?.responseType === "arraybuffer"
      // @ts-ignore
      ? this.httpClient.get(url, { responseType: "arraybuffer", params: httpParams }).pipe(
        map((result) => {
          return {
            data: result,
          };
        }),
      )
      // @ts-ignore
      : this.httpClient.get<T>(url, options).pipe(
        map((result) => {
          return {
            data: result,
          };
        }),
      );
  }

  delete<T>(relativeUrl: string, data?: any): Observable<{ data?: T }> {
    const url = this.resolveBackendUrl(relativeUrl);
    return this.httpClient.delete<T>(url, { body: data }).pipe(
      map((result) => {
        return {
          data: result,
        };
      }),
    );
  }

  protected createHttpParams(params?: HttpParamsObj) {
    if (!params) {
      return null;
    }

    // Remove 'null' & 'undefined' values from params obj.
    // Angular X will add them to query string while AngularJS will not.
    // example of obj {var1: 1, var2: null}
    // ?var1=1&var2=null -> throws error if var2 is not nullable on he backend
    // ?var1 -> ok
    const httpParams: HttpParamsObj = {};
    for (const key of Object.keys(params)) {
      const value = params[key];
      if (value != null) {
        httpParams[key] = value;
      }
    }
    return new HttpParams().appendAll(httpParams);
  }
}
