import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import IActivity from '../../interfaces/iActivity';

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatFormField, MatLabel, ReactiveFormsModule, FormsModule, MatButtonModule],
  templateUrl: './create-activity.component.html',
  styleUrl: './create-activity.component.css'
})
export class CreateActivityComponent {

  readonly dialog = inject(MatDialogRef<CreateActivityComponent>);
  readonly data = inject<IActivity>(MAT_DIALOG_DATA);

  protected form = new FormGroup({
    name: new FormControl(this.data.name || '', [Validators.required]),
    max: new FormControl(this.data.max || '', [Validators.required, Validators.min(1)]),
    workload: new FormControl(this.data.workload || '', [Validators.required, Validators.min(1)]),
  });

  constructor() {
    this.form.controls.max.valueChanges.subscribe((value) => {
      this.form.controls.workload.setValue(Math.round(0.80*(parseInt(value?.toString() || '0'))), {
        emitModelToViewChange: true,
        emitEvent: false,
        onlySelf: true,
        emitViewToModelChange: false,
      });
    })

    this.form.controls.workload.valueChanges.subscribe((value) => {
      this.form.controls.max.setValue(Math.round(1.25 * parseInt(value?.toString() || '0')), {
        emitModelToViewChange: true,
        emitEvent: false,
        onlySelf: true,
        emitViewToModelChange: false,
      });
    })
  }

  cancel() {
    return null;
  }

  createOrEdit() {
    if (this.data.uuid) {
      return {
        uuid: this.data.uuid,
        ...this.form.value,
      }
    }

    return this.form.value;
  }

  submit() {
    if (this.form.valid) {
      this.dialog.close(this.form.value);
    }
  }

  get validateButtonAction(): string {
    return this.data.uuid ? 'Edit' : 'Create';
  }

  protected readonly close = close;
}
