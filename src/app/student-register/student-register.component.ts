import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

import { ConfirmPasswordValidator } from './password.validator';

@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css'],
})
export class StudentRegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  localItem: any;
  studData: any = [];

  emailMatch = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.localItem = localStorage.getItem('DATA');
    if (this.localItem == null) {
      this.studData = [];
    } else {
      this.studData = JSON.parse(this.localItem);
    }

    // console.log(this.studData);

    this.registrationForm = this.fb.group(
      {
        Fname: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        Lname: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
        std: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        address: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
          ],
        ],
        pass: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}$'
            ),
          ],
        ],
        cpass: ['', [Validators.required]],
        hobbyArray: new FormArray([]),
      },
      { validator: ConfirmPasswordValidator('pass', 'cpass') }
    );

    for (let i = 0; i < 1; i++) {
      this.createItem();
    }
  }

  get firstName() {
    return this.registrationForm.get('Fname');
  }

  get hobbies() {
    return this.registrationForm.get('hobbyArray') as FormArray;
  }

  get lastName() {
    return this.registrationForm.get('Lname');
  }

  get studentClass() {
    return this.registrationForm.get('std');
  }

  get stdGender() {
    return this.registrationForm.get('gender');
  }

  get stdAddress() {
    return this.registrationForm.get('address');
  }

  get stdEmail() {
    return this.registrationForm.get('email');
  }

  get stdMobNo() {
    return this.registrationForm.get('mobile');
  }

  get password() {
    return this.registrationForm.get('pass');
  }

  get confirmPass() {
    return this.registrationForm.get('cpass');
  }

  createItem() {
    this.hobbies.push(
      this.fb.group({
        hobby: [''],
      })
    );
  }

  form = new FormGroup({
    gender: new FormControl('', Validators.required),
  });

  changeGender(e: any) {
    console.log(e.target.value);
  }

  deleteHobby(i: any) {
    // console.log(i);

    this.hobbies.removeAt(i);
  }

  Register(): any {
    // console.log(this.registrationForm.value)

    let currentEmail = this.registrationForm.value.email;

    if (this.studData.length > 0) {
      for (let i = 0; i < this.studData.length; i++) {
        if (this.studData[i].email === currentEmail) {
          this.emailMatch = true;
        }
      }
    }

    if (this.emailMatch) {
      alert('Email is already exist');
      this.emailMatch = false;
    } else {
      // console.log(this.studData);
      this.studData.push(this.registrationForm.value);

      localStorage.setItem('DATA', JSON.stringify(this.studData));

      // console.log(localStorage.getItem('DATA'));

      alert('Form is Submitted');

      this.registrationForm.reset();

      while (this.hobbies.length > 1) {
        this.hobbies.removeAt(0);
      }
    }
  }
}
