import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
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

  readonly data = inject<IActivity>(MAT_DIALOG_DATA);

  protected form = new FormGroup({
    name: new FormControl(this.data.name || '', [Validators.required]),
    max: new FormControl(this.data.max || 0, [Validators.required, Validators.min(1)]),
  })

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

  get validateButtonAction(): string {
    return this.data.uuid ? 'Edit' : 'Create';
  }
}
