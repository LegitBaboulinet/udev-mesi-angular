import { Injectable } from '@angular/core';
import { Constructor } from 'src/models/constructor.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConstructorService {

  private endpoint = 'manufacturer';
  private HEADERS: any;

  private _constructorSub: Subject<Array<Constructor>>;
  private _constructors: Array<Constructor>;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this._constructorSub = new Subject<Array<Constructor>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get constructorSub(): Subject<Array<Constructor>> {
    return this._constructorSub;
  }

  public fetchConstructors(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
        .subscribe(res => {
          this._constructors = (res['manufacturers']) ? res['manufacturers'] : [];
          this._constructorSub.next(this._constructors);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getConstructorById(id: number): Promise<Constructor> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          let manufacturer = (res['manufacturer']) ? res['manufacturer'] : undefined;
          if (manufacturer) {
            resolve(res['manufacturer']);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public saveConstructor(constructor: Constructor): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('name', constructor.name);

      // Appel du web service
      let response: Observable<any>;
      if (constructor.id) {
        body.set('id', constructor.id.toString())
        response = this.httpClient.put(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.HEADERS });
      } else {
        response = this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err.error['message']);
      })
    });
  }

  public deleteConstructor(constructor: Constructor): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (constructor.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${constructor.id}`,
        { headers: this.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err.error['message']);
      });
    });
  }
}
