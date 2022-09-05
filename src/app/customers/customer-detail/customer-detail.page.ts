import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CustomerDto } from 'src/app/classes/customer-dto.model';
import { Customer } from 'src/app/classes/customer.model';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.page.html',
  styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {

  selectedPicture: any;
  selectedSignature: any;
  displayPicture: any;
  displaySignature: any;
  displayImg: any;
  selectedSegment: 'picture';
  customer = new Customer();
  isFetching = false;
  customerForm: FormGroup;

  constructor(
    private customersService: CustomersService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.displayPicture = '../../assets/icons/personv05.svg';
    this.displaySignature = '../../assets/icons/signaturev04.svg';
    this.displayImg = this.displayPicture;
    this.customerForm = new FormGroup({
      customerName: new FormControl(null, {
        validators: [Validators.required],
      }),
      contactNo: new FormControl(''),
      address: new FormControl(''),
      sssNo: new FormControl(''),
      hdmfNo: new FormControl(''),
      phicNo: new FormControl(''),
      tinNo: new FormControl(''),
      bloodType: new FormControl(''),
      erContactPerson: new FormControl(''),
      erContactNo: new FormControl(''),
      erContactAddress: new FormControl(''),
    });
  }

  onSegmentChanged(event) {
    if (event.target.value === 'picture') {
      this.displayImg = this.displayPicture;
    } else {
      this.displayImg = this.displaySignature;
    }
    this.selectedSegment = event.target.value;
  }

  onPictureFileChange(event) {
    if (event.target.files[0] !== undefined) {
      this.selectedPicture = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event2) => {
        this.displayImg = reader.result;
        if (this.selectedSegment === 'picture') {
          this.displayPicture = reader.result;
          this.selectedPicture =  reader.result;
        } else {
          this.displaySignature = reader.result;
          this.selectedSignature =  reader.result;
        }
      };
    }
  }

  onSaveCustomer() {
    if (!this.customerForm.valid) {
      this.messageBox('Please provide a valid customer information');
    } else {
      const customerDto = new CustomerDto();
      const tmpCustomer = new Customer();

      tmpCustomer.customerName = this.customerForm.value.customerName;
      tmpCustomer.contactNo = this.customerForm.value.contactNo;
      tmpCustomer.address = this.customerForm.value.address;
      tmpCustomer.sssNo = this.customerForm.value.sssNo;
      tmpCustomer.hdmfNo = this.customerForm.value.hdmfNo;
      tmpCustomer.phicNo = this.customerForm.value.phicNo;
      tmpCustomer.tinNo = this.customerForm.value.tinNo;
      tmpCustomer.bloodType = this.customerForm.value.bloodType;
      tmpCustomer.erContactPerson = this.customerForm.value.erContactPerson;
      tmpCustomer.erContactNo = this.customerForm.value.erContactNo;
      tmpCustomer.erContactAddress = this.customerForm.value.erContactAddress;

      customerDto.customer = tmpCustomer;

      if (this.customer.customerId !== undefined) {
        customerDto.customer.customerId = this.customer.customerId;
      }

      if (this.selectedPicture !== undefined) {
        const customerData = new FormData();

        customerData.append(
          'customerDto',
          new Blob([JSON.stringify(customerDto)], {
            type: 'application/json',
          })
        );

        customerData.append(
          'pictureFile',
          this.selectedPicture,
          this.selectedPicture.name
        );

        this.customersService.postCustomerwdPic(customerData).subscribe(
          (res) => {
            if (this.customer.customerId === undefined) {
              this.customer = tmpCustomer;
              this.customer.customerId = res;
            }
            this.messageBox('Customer inormation has been saved successfully.');
          },
          (err) => {
            this.messageBox(
              // eslint-disable-next-line max-len
              'An error occured while trying to save the information. Please check your network connection and attached a picture with 1048576 bytes or less.'
            );
          }
        );
      } else {
        this.customersService.postCustomer(customerDto).subscribe(
          (res) => {
            if (this.customer.customerId === undefined) {
              this.customer = tmpCustomer;
              this.customer.customerId = res;
            }
            this.messageBox('Customer inormation has been saved successfully.');
          },
          (err) => {
            this.messageBox(
              // eslint-disable-next-line max-len
              'An error occured while trying to save the information. Please check your network connection and attached a picture with 1048576 bytes or less.'
            );
          }
        );
      }
    }
  }

  messageBox(msg: string) {
    this.toastCtrl
      .create({
        color: 'dark',
        duration: 2000,
        position: 'top',
        message: msg,
      })
      .then((res) => {
        res.present();
      });
  }
}
