import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/Security/classes/user.model';
import { AuthenticationService } from 'src/app/Security/services/authentication.service';
import { ProjectClient } from '../../classes/project-client.model';
import { ProjectContract } from '../../classes/project-contract.model';
import { ProjectUnitDto } from '../../classes/project-unit-dto.model';
import { ProjectUnit } from '../../classes/project-unit.model';
import { Project } from '../../classes/project.model';
import { UnitClass } from '../../classes/unit-class.model';
import { ProjectUnitsService } from '../../services/project-units.service';

@Component({
  selector: 'app-project-unit-detail',
  templateUrl: './project-unit-detail.page.html',
  styleUrls: ['./project-unit-detail.page.scss'],
})
export class ProjectUnitDetailPage implements OnInit {

  user: User;
  project: Project;
  unit: ProjectUnit;
  contract: ProjectContract;
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
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) { }

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
      unitClass: new FormControl("CONDO_UNIT", {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

    this.contractForm = new FormGroup({
      remarks: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

    this.isFetching = true;
    this.unit = new ProjectUnit();
    this.contract = new ProjectContract();
    this.project = new Project(1, "TAGBALAI HEIGHTS TOWER 01");

    this.unit.unitPrice = 0;
    this.unit.reservationAmt = 0;
    this.unit.unitClass = "CONDO_UNIT"

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
            this.unit.currentContract = resData.currentContract;
            this.unit.project = this.project;

            this.unitForm.patchValue({
              unitCode: resData.unitCode,
              unitDescription: resData.unitDescription,
              unitPrice: resData.unitPrice,
              reservationAmt: resData.reservationAmt,
              unitClass: resData.unitClass,
            });

            this.isFetching = false;
          },
          error: () => {
            this.navCtrl.navigateBack('/tabs/project-units');
            this.isFetching = false;
            return;
          }
        });
      } else {
        this.unit.unitId = 0;
        this.user = this.authenticationService.getUserFromLocalCache();
        this.isFetching = false;
      }
    });
  }

  onSaveUnit() {

    if (this.unit.unitId > 0) {
      return;
    }

    if (this.isUploading || this.isFetching) {
      return;
    }

    this.isUploading = true;

    const unitDto = new ProjectUnitDto();

    unitDto.unitCode = this.unitForm.value.unitCode;
    unitDto.unitDescription = this.unitForm.value.unitDescription;
    unitDto.unitPrice = this.unitForm.value.unitPrice;
    unitDto.reservationAmt = this.unitForm.value.reservationAmt;
    unitDto.unitClass = this.unitForm.value.unitClass;
    unitDto.project = this.project;

    console.log(unitDto);

    this.unitsService
      .postUnit(unitDto)
      .subscribe({
        next: (resData) => {
          this.unit.unitId = resData.unitId;
          this.unit.unitStatus = resData.unitStatus;
          this.unit.project = resData.project;

          this.isUploading = false;
          console.log(resData);
        }
      });
  }

  onSaveContract() {}

  onClientSearch() {}

}
