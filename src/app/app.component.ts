import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {CreateActivityComponent} from './modals/create-activity/create-activity.component';
import {PersistenceService} from './services/persistence.service';
import IActivity from './interfaces/iActivity';
import {Observable} from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {Search} from './pipes/filter';
import {MigrateService} from './services/migrate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, CommonModule, MatIcon, MatCardModule, MatFormField, FormsModule, MatLabel, ReactiveFormsModule, MatInput, Search],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'maxes';

  readonly dialog = inject(MatDialog);
  readonly persistenceService = inject(PersistenceService);
  readonly migrateService = inject(MigrateService);
  protected searchForm = new FormGroup({
    search: new FormControl('')
  });

  constructor() {
    this.migrateService.migrate();
  }

  openDialog(uuid?: string): void {
    let toEdit: IActivity | undefined;

    if (uuid) {
      toEdit = this.persistenceService.getByUUID(uuid);
    }

    const dialogRef = this.dialog.open(CreateActivityComponent, {
      data: toEdit || {},
    });

    dialogRef.afterClosed().subscribe((result: IActivity | null) => {
      console.log(result);
      if (result?.name)
        if (result.uuid)
          this.persistenceService.editActivity(result.uuid, result.name, result.max, result.workload);
        else
          this.persistenceService.addActivity(result.name, result.max, result.workload);
    });
  }

  get activities$(): Observable<IActivity[]> {
    return this.persistenceService.activities.asObservable();
  }

  delete(uuid: string): void {
    if(window.confirm('Delete ?'))
      this.persistenceService.delete(uuid)
  }
}
