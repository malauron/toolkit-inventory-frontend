import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { DatePickerComponent } from 'src/app/custom-controls/date-picker/date-picker.component';
import { User } from 'src/app/Security/classes/user.model';
import { ProjectPaymentDetail } from '../../classes/project-payment-detail.model';
import { ProjectPayment } from '../../classes/project-payment.model';
import { ClientSearchComponent } from '../../project-clients/client-search/client-search.component';
import { ProjectContractsService } from '../../services/project-contracts.service';

@Component({
  selector: 'app-project-payment-detail',
  templateUrl: './project-payment-detail.page.html',
  styleUrls: ['./project-payment-detail.page.scss'],
})
export class ProjectPaymentDetailPage implements OnInit {
  user: User;
  payment: ProjectPayment;
  paymentDetails: ProjectPaymentDetail[];

  dateValue;
  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private mdl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private contractsService: ProjectContractsService
  ) {}

  ngOnInit() {
    this.payment = new ProjectPayment();
    this.payment.paymentId = 0;
    this.payment.ttlAmtPaid = 0;
  }

  onSavePayment() {}

  onClientSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: ClientSearchComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'client') {
            this.payment.client = resultData.data;
            this.contractsService
              .getActiveContracts(this.payment.client.clientId)
              .subscribe({
                next: (res) => {

                  this.paymentDetails = [];

                  res._embedded.projectContracts.forEach((resContract) => {
                    const tmpDetails = new ProjectPaymentDetail();
                    tmpDetails.contract = resContract;
                    tmpDetails.reservationPaid = 0;
                    tmpDetails.equityPaid = 0;
                    tmpDetails.financingPaid = 0;
                    tmpDetails.others = 0;
                    tmpDetails.ttlAmtPaid = 0;
                    this.paymentDetails.push(tmpDetails);
                  });

                },
                error: () => {},
                complete: () => {
                  this.modalOpen = false;
                },
              });
          } else {
            this.modalOpen = false;
          }
        });
    }
  }

  showReceivedDatePicker() {
    if (!this.modalOpen && !this.isUploading) {
      this.modalOpen = true;
      this.mdl
        .create({
          component: DatePickerComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modal) => {
          modal.present();
          return modal.onDidDismiss();
        })
        .then((modal) => {
          if (modal.role === 'setDate') {
            this.payment.dateReceived = modal.data;
            this.dateValue = format(parseISO(modal.data), 'MMMM dd, yyyy');
          }
          this.modalOpen = false;
        });
    }
  }
}
