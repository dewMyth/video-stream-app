import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.css'],
})
export class UploadModalComponent implements OnInit {
  constructor() {}

  showSaveDetails = false;
  uploadedVideoData: any;

  onUploadClick(uploadedData: any) {
    this.showSaveDetails = uploadedData.showDetailsView;
    this.uploadedVideoData = uploadedData;
  }

  ngOnInit(): void {}
}
