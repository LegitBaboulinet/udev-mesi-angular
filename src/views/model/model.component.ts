import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { MessageService } from 'src/services/message.service';
import { ActivatedRoute } from '@angular/router';
import { Model } from '../../models/model.model';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss']
})
export class ModelComponent implements OnInit, OnDestroy {

  public isLoading: boolean;

  private messagesSub: Subscription;
  public messages: Map<string, string>;

  private modelSub: Subscription;
  public models: Array<Model>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private modelService: ModelService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.messagesSub = this.messageService.messagesSub.subscribe((messages: Map<string, string>) => {
      this.messages = new Map<string, string>();
      this.messages.set('close', messages.get('close'));
      this.messages.set('menu_models', messages.get('menu_models'));
      this.messages.set('cannot_communicate_with_api', messages.get('cannot_communicate_with_api'));
    });
    this.messageService.sendMessages();

    // Affichage d'un message si demandé
    this.activatedRoute.params
      .subscribe(params => {
        const message = params.message;
        if (message) {
          this.snackBar.open(message, this.messages.get('close'), { duration: 5000 });
        }
      });

    // Récupération des modèles
    this.modelSub = this.modelService.modelSub.subscribe((models: Array<Model>) => {
      this.models = models;
      this.isLoading = false;
    });
    this.modelService.fetchModels()
      .catch(err => {
        this.snackBar.open(`${this.messages.get('cannot_communicate_with_api')}: ${err}`,
          this.messages.get('close'), { duration: 5000 });
      });
  }

  ngOnDestroy() {
    this.modelSub.unsubscribe();
    this.messagesSub.unsubscribe();
  }
}
