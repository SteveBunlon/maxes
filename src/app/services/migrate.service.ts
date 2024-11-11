import {inject, Injectable} from '@angular/core';
import {PersistenceService} from './persistence.service';
import IActivity from '../interfaces/iActivity';

@Injectable({
  providedIn: 'root'
})
export class MigrateService {

  readonly persistenceService = inject(PersistenceService);

  constructor() { }

  migrate() {
    this.persistenceService.activities.value.forEach((activity: IActivity) => {
      if(!activity.workload) {
        this.persistenceService.editActivity(activity.uuid, activity.name, activity.max, Math.round(activity.max*0.80));
      }
    })
  }
}
