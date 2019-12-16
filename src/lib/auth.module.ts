import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';

@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
	exports: [LoginComponent]
})
export class AuthModule {}
