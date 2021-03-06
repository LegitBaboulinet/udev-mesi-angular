import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { FlightDetail } from '../models/flightDetail.model';
import { FormatService } from './format.service';
import { AuthService } from './auth.service';


@Injectable()
export class FlightDetailService {

  private endpoint = 'flightDetails';
  private HEADERS: any;

  private _flightDetailsub: Subject<Array<FlightDetail>>;
  private _flightDetails: Array<FlightDetail>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private authService: AuthService,
    private formatService: FormatService
  ) {
    this._flightDetailsub = new Subject<Array<FlightDetail>>();

    // Configuration de l'entête HTTP
    this.HEADERS = this.configService.HEADERS;
    this.HEADERS['username'] = this.authService.username;
    this.HEADERS['token'] = this.authService.token;
  }

  public get flightDetailSub(): Subject<Array<FlightDetail>> {
    return this._flightDetailsub;
  }

  public fetchFlightDetails(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.HEADERS })
        .subscribe(res => {
          this._flightDetails = (res['flightDetails']) ? res['flightDetails'] : [];
          this._flightDetailsub.next(this._flightDetails);
          resolve();
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public getFlightDetailById(id: number): Promise<FlightDetail> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.HEADERS })
        .subscribe(res => {
          let flightDetail: FlightDetail = (res['flightDetails']) ? res['flightDetails'] : undefined;
          if (flightDetail) {
            flightDetail.departureDateTime = this.formatService.stringDateFormat(res['flightDetails'].departureDateTime);
            flightDetail.arrivalDateTime = this.formatService.stringDateFormat(res['flightDetails'].arrivalDateTime);
            resolve(flightDetail);
          } else {
            reject();
          }
        }, err => {
          reject(err.error['message']);
        });
    });
  }

  public saveFlightDetail(flightDetail: FlightDetail): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('departureDateTime', this.formatService.dateStringFormat(flightDetail.departureDateTime));
      body.set('arrivalDateTime', this.formatService.dateStringFormat(flightDetail.arrivalDateTime));
      body.set('flight', flightDetail.flight.id.toString());
      body.set('plane', flightDetail.plane.ARN);

      // Appel du web service
      let response: Observable<any>;
      if (flightDetail.id) {
        body.set('id', flightDetail.id.toString());
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
      });
    });
  }

  public deleteFlightDetail(flightDetail: FlightDetail): Promise<null> {
    return new Promise((resolve, reject) => {

      // Appel du web service
      let response: Observable<any>;
      if (flightDetail.id) {
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${flightDetail.id}`,
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
