import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'footer-layout',
    templateUrl: './footer-layout.component.html'
})
export class FooterLayoutComponent implements OnInit{
    footerCredentialName: string = "ChargingStation";
    
    constructor() {}
    
    ngOnInit(): void {}
}