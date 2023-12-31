import { Component, OnInit } from '@angular/core';
import { UploadVideoComponent } from '../upload-video/upload-video.component';
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  openUploadVideo() {
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '1000px',
      height: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {}
}
