import { Component, OnInit,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-buyinfo',
    templateUrl: './buyinfo.component.html',
    styleUrls: ['./buyinfo.component.scss']
})
export class BuyinfoComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<BuyinfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        console.log(this.data)
    }

}
