import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-serial-numberlend-modal',
  templateUrl: './serial-numberlend-modal.component.html',
  styleUrls: ['./serial-numberlend-modal.component.scss'],
})
export class SerialNumberlendModalComponent {
  @Input() consumableName: string = '';
  @Input() serialNumbers: string[] = [];
  @Input() reason: string ='';
  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }
}
