import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { ProjectBroker } from '../../classes/project-broker.model';
import { ProjectBrokerage } from '../../classes/project-brokerage.model';
import { ProjectClient } from '../../classes/project-client.model';
import { ProjectContract } from '../../classes/project-contract.model';
import { ProjectUnitDto } from '../../classes/project-unit-dto.model';
import { ProjectUnit } from '../../classes/project-unit.model';
import { Project } from '../../classes/project.model';
import { UnitClass } from '../../classes/unit-class.model';
import { BrokerageSearchComponent } from '../../project-brokerages/brokerage-search/brokerage-search.component';
import { BrokerSearchComponent } from '../../project-brokers/broker-search/broker-search.component';
import { ClientSearchComponent } from '../../project-clients/client-search/client-search.component';
import { ProjectUnitsService } from '../../services/project-units.service';
import { ProjectContractDto } from '../../classes/project-contract-dto.model';
import { ProjectContractsService } from '../../services/project-contracts.service';
import { ProjectContractEquitySchedule } from '../../classes/project-contract-equity-schedule.model';

@Component({
  selector: 'app-project-unit-detail',
  templateUrl: './project-unit-detail.page.html',
  styleUrls: ['./project-unit-detail.page.scss'],
})
export class ProjectUnitDetailPage implements OnInit, OnDestroy {
  user: User;
  project: Project;
  unit: ProjectUnit;
  equitySchedules: ProjectContractEquitySchedule[];
  unitForm: FormGroup;
  contractForm: FormGroup;

  unitClass = UnitClass;

  isUploading = false;
  dataHaveChanged = false;
  isFetching = false;
  modalOpen = false;
  showCurrentContract = false;

  constructor(
    private unitsService: ProjectUnitsService,
    private contractsService: ProjectContractsService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private navCtrl: NavController,
    private modalSearch: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.unitForm = new FormGroup({
      unitCode: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      unitDescription: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      unitPrice: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      reservationAmt: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0)],
      }),
      unitClass: new FormControl('CONDO_UNIT', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.contractForm = new FormGroup({
      remarks: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });

    this.isFetching = true;
    this.unit = new ProjectUnit();
    this.unit.currentContract = new ProjectContract();
    this.unit.currentContract.client = new ProjectClient();
    this.unit.currentContract.broker = new ProjectBroker();
    this.unit.currentContract.brokerage = new ProjectBrokerage();
    this.project = new Project(1, 'TAGBALAI HEIGHTS TOWER 01');

    this.unit.unitPrice = 0;
    this.unit.reservationAmt = 0;
    this.unit.unitClass = 'CONDO_UNIT';

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('unitId')) {
        this.navCtrl.navigateBack('/tabs/project-units');
        return;
      }

      if (isNaN(Number(paramMap.get('unitId')))) {
        this.navCtrl.navigateBack('/tabs/project-units');
        return;
      }

      const unitId = Number(paramMap.get('unitId'));
      if (unitId > 0) {
        this.unitsService.getUnit(unitId).subscribe({
          next: (resData) => {
            if (!resData.unitId) {
              this.navCtrl.navigateBack('/tabs/project-units');
              return;
            }
            this.unit.unitId = resData.unitId;
            this.unit.unitCode = resData.unitCode;
            this.unit.unitDescription = resData.unitDescription;
            this.unit.unitPrice = resData.unitPrice;
            this.unit.reservationAmt = resData.reservationAmt;
            this.unit.unitClass = resData.unitClass;
            this.unit.unitStatus = resData.unitStatus;
            this.unit.version = resData.version;
            if (resData.currentContract != null) {
              this.unit.currentContract = resData.currentContract;
            }
            this.equitySchedules = resData.equitySchedules;
            this.unit.project = this.project;

            this.unitForm.patchValue({
              unitCode: resData.unitCode,
              unitDescription: resData.unitDescription,
              unitPrice: resData.unitPrice,
              reservationAmt: resData.reservationAmt,
              unitClass: resData.unitClass,
            });

            this.contractForm.patchValue({
              remarks: resData.currentContract?.remarks
            });
            this.isFetching = false;
          },
          error: () => {
            this.navCtrl.navigateBack('/tabs/project-units');
            this.isFetching = false;
            return;
          },
        });
      } else {
        this.unit.unitId = 0;
        this.user = this.authenticationService.getUserFromLocalCache();
        this.isFetching = false;
      }
    });
  }

  onSaveUnit() {
    if (this.isUploading || this.isFetching) {
      return;
    }

    this.isUploading = true;

    const unitDto = new ProjectUnitDto();

    unitDto.unitId = this.unit.unitId;
    unitDto.unitCode = this.unitForm.value.unitCode;
    unitDto.unitDescription = this.unitForm.value.unitDescription;
    unitDto.unitPrice = this.unitForm.value.unitPrice;
    unitDto.reservationAmt = this.unitForm.value.reservationAmt;
    unitDto.unitClass = this.unitForm.value.unitClass;
    unitDto.project = this.project;

    this.unitsService.postUnit(unitDto).subscribe({
      next: (resData) => {
        this.unit.unitId = resData.unitId;
        this.unit.unitStatus = resData.unitStatus;
        this.unit.project = resData.project;
        this.dataHaveChanged = true;
      },
      error: (err) => {
        this.isUploading = false;
      },
      complete: () => {
        this.isUploading = false;
        this.messageBox('Unit information has been saved successfully.');
      },
    });
  }

  onSaveContract() {
    if (this.isUploading || this.isFetching) {
      return;
    }

    this.isUploading = true;

    if (
      this.unit.currentContract?.client.clientId === undefined ||
      this.unit.currentContract.client.clientId === 0
    ) {
      this.messageBox('Please select a client.');
      this.isUploading = false;
      return;
    }

    const contractDto = new ProjectContractDto();

    if (
      this.unit.currentContract.contractId == undefined ||
      this.unit.currentContract.contractId == 0 ||
      this.unit.currentContract.contractId == null
    ) {
      contractDto.unit = this.unit;
      contractDto.client = this.unit.currentContract.client;
      contractDto.broker = this.unit.currentContract.broker;
      contractDto.brokerage = this.unit.currentContract.brokerage;
    } else {
      contractDto.contractId = this.unit.currentContract.contractId;
    }
    contractDto.remarks = this.contractForm.value.remarks;

    this.contractsService.postContract(contractDto).subscribe({
      next: (res) => {
        if (
          this.unit.currentContract.contractId == undefined ||
          this.unit.currentContract.contractId == 0 ||
          this.unit.currentContract.contractId == null
        ) {
          this.unit.currentContract.contractId = res.contractId;
          this.unit.currentContract.unitPrice = res.unitPrice;
          this.unit.currentContract.reservationAmt = res.reservationAmt;
          this.unit.currentContract.ttlReservationPaid = res.ttlReservationPaid;
          this.unit.currentContract.reservationBalance = res.reservationBalance;
          this.unit.currentContract.equityAmt = res.equityAmt;
          this.unit.currentContract.ttlEquityPaid = res.ttlEquityPaid;
          this.unit.currentContract.equityBalance = res.equityBalance;
          this.unit.currentContract.financingAmt = res.financingAmt;
          this.unit.currentContract.ttlFinancingPaid = res.ttlFinancingPaid;
          this.unit.currentContract.financingBalance = res.financingBalance;
          this.unit.currentContract.ttlPayment = res.ttlPayment;
          this.unit.currentContract.ttlBalance = res.ttlBalance;
        }
        this.dataHaveChanged = true;
      },
      error: (err) => {
        this.messageBox(err);
        this.isUploading = false;
      },
      complete: () => {
        this.messageBox('Contract information has been saved successfully.');
        this.isUploading = false;
      },
    });
  }

  onClientSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
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
            this.unit.currentContract.client = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onBrokerSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({
          component: BrokerSearchComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'broker') {
            this.unit.currentContract.broker = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  onBrokerageSearch() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      this.modalSearch
        .create({
          component: BrokerageSearchComponent,
          cssClass: 'custom-modal-styles',
        })
        .then((modalSearch) => {
          modalSearch.present();
          return modalSearch.onDidDismiss();
        })
        .then((resultData) => {
          if (resultData.role === 'brokerage') {
            this.unit.currentContract.brokerage = resultData.data;
          }
          this.modalOpen = false;
        });
    }
  }

  async messageBox(msg: string) {
    const toast = await this.toastCtrl.create({
      color: 'dark',
      duration: 2000,
      position: 'top',
      message: msg,
    });

    await toast.present();
  }

  ngOnDestroy(): void {
    if (this.dataHaveChanged) {
      this.unitsService.unitsHaveChanged.next(true);
    }
  }
}
