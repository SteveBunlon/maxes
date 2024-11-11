import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import IActivity from '../interfaces/iActivity';

const STORAGE_NAME: string = 'activities';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  public activities: BehaviorSubject<IActivity[]> = new BehaviorSubject(new Array<IActivity>());

  constructor() {
    this.getActivities();
  }

  addActivity(activityName: string, max: number, workload: number): void {
    if (!activityName) return;

    this.activities.value.push({
      uuid: crypto.randomUUID(),
      name: activityName,
      max: max,
      workload: workload,
    });

    this.save();
  }

  editActivity(uuid: string, name: string, max: number, workload: number): void {
    const toEdit = this.getByUUID(uuid);

    if (!toEdit) return;

    toEdit.name = name;
    toEdit.max = max;
    toEdit.workload = workload;

    this.save();
  }

  getActivities(): void {
    const activities = window.localStorage.getItem(STORAGE_NAME) || '';

    if (activities === '') {
      this.activities.next([]);
      return;
    }

    const parsedActivities: IActivity[] = activities.split(';').map(activity => {
      const values = activity.split(':');

      return {
        uuid: values[0],
        name: values[1],
        max: parseInt(values[2]),
        workload: parseInt(values[3]),
      }
    });

    this.activities.next(parsedActivities);
  }

  getByUUID(uuid: string): IActivity | undefined {
    return this.activities.value.find(a => a.uuid === uuid);
  }

  save(): void {
    window.localStorage.setItem(STORAGE_NAME, this.activities.value.reduce((acc, activity, currentIndex) => {
      if (currentIndex === 0)
        return `${activity.uuid}:${activity.name}:${activity.max}:${activity.workload}`;
      else
        return acc + `;${activity.uuid}:${activity.name}:${activity.max}:${activity.workload}`;
    }, ''));

    this.getActivities();
  }

  delete(uuid: string) {
    const index = this.activities.value.findIndex(a => a.uuid === uuid);
    this.activities.value.splice(index, 1);

    this.save();
  }
}
