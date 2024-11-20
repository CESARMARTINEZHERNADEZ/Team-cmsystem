import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-serial-number-modal',
  templateUrl: './serial-number-modal.component.html',
  styleUrls: ['./serial-number-modal.component.scss'],
})
export class SerialNumberModalComponent {
  @Input() consumableName: string = '';
  @Input() serialNumbers: string[] = []; // This should match the name used in the template

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}