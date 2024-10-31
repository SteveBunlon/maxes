import {Pipe, PipeTransform} from '@angular/core';
import IActivity from '../interfaces/iActivity';

@Pipe({standalone: true, name: 'searchPipe'})
export class Search implements PipeTransform {
  transform(activities : IActivity[] | null, searchValue: string | null){
    if (!searchValue || !activities) return activities;

    return activities.filter(activity => activity.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1);
  }
}
