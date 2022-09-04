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
  selectedPicImg: any;
  customer = new Customer();
  isFetching = false;
  customerForm: FormGroup;

  constructor(
    private customersService: CustomersService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.selectedPicImg = '../../assets/icons/personv02.svg';
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

  onSaveCustomer() {
    if (!this.customerForm.valid) {
      this.messageBox('Please provide a valid customer information');
    } else {
      const customerDto = new CustomerDto();
      const customer = new Customer();

      customer.customerName = this.customerForm.value.customerName;
      customer.contactNo = this.customerForm.value.contactNo;
      customer.address = this.customerForm.value.address;
      customer.sssNo = this.customerForm.value.sssNo;
      customer.hdmfNo = this.customerForm.value.hdmfNo;
      customer.phicNo = this.customerForm.value.phicNo;
      customer.tinNo = this.customerForm.value.tinNo;
      customer.bloodType = this.customerForm.value.bloodType;
      customer.erContactPerson = this.customerForm.value.erContactPerson;
      customer.erContactNo = this.customerForm.value.erContactNo;
      customer.erContactAddress = this.customerForm.value.erContactAddress;

      customerDto.customer = customer;

      if (this.selectedPicture !== undefined) {
        const pic = new FormData();
        pic.append('picture', this.selectedPicture, this.selectedPicture.name);
        customerDto.origCustomerPicture = pic;
      }

      this.customersService.postCustomer(customerDto).subscribe((res) => {
        console.log(res);
      });
    }
  }

  onPictureFileChange(event) {
    console.log(event.target.files[0]);
    this.selectedPicture = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event2) => {
      this.selectedPicImg = reader.result;
    };
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
