import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Model } from 'src/models/model.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable()
export class ModelService {

  private endpoint: string = "model";

  private _modelSub: Subject<Array<Model>>;
  private _models: Array<Model>;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this._modelSub = new Subject<Array<Model>>();
  }

  public get modelSub(): Subject<Array<Model>> {
    return this._modelSub;
  }

  public fetchModels(): Promise<null> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint,
        { headers: this.configService.HEADERS })
        .subscribe(res => {
          this._models = res['models'];
          this._modelSub.next(this._models);
          resolve();
        }, err => {
          // TODO: Gérer les erreurs
          reject();
        });
    });
  }

  public getModelById(id: number): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.configService.URL + this.endpoint + `/${id}`,
      { headers: this.configService.HEADERS })
        .subscribe(res => {
          resolve(res['model']);
        }), err => {
          //TODO: Gérer les erreurs;
          reject(err);
        }
    });
  }

  public saveConstructor(model: Model): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();
      body.set('name', model.name);

      // Appel du web service
      let response: Observable<any>;
      if (model.id) {
        body.set('id', model.id.toString())
        response = this.httpClient.put(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS });
      } else {
        response = this.httpClient.post(this.configService.URL + this.endpoint, body.toString(),
        { headers: this.configService.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err);
      })
    });
  }

  public deleteModel(model: Model): Promise<null> {
    return new Promise((resolve, reject) => {

      const body = new URLSearchParams();

      // Appel du web service
      let response: Observable<any>;
      if (model.id) {
        body.set('id', model.id.toString())
        response = this.httpClient.delete(this.configService.URL + this.endpoint + `/${model.id}`,
        { headers: this.configService.HEADERS });
      }

      // Récupération de la réponse
      response.subscribe(res => {
        if (res['status'] === 'OK') {
          resolve();
        } else {
          reject();
        }
      }, err => {
        reject(err);
      })
    });
  }
}