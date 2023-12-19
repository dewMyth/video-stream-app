import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { UploadVideoService } from '../upload-video.service';
import { UploadVideoResponse } from './UploadVideoResponse';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.css'],
})
export class UploadVideoComponent {
  public files: NgxFileDropEntry[] = [];
  fileUploaded: boolean = false;
  fileEntry: FileSystemFileEntry | undefined;
  public btnText = 'SELECT FILES';
  fileName: string = '';
  showProgressBar = false;
  progressValue = 0;

  constructor(
    private _videoService: UploadVideoService,
    private router: Router,
    public dialogRef: MatDialogRef<UploadVideoComponent>
  ) {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        this.fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);
          this.fileName = droppedFile.relativePath;

          this.fileUploaded = true;

          /**
          // You could upload it like this:
          const formData = new FormData()
          formData.append('logo', file, relativePath)

          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })

          this.http.post('https://mybackend.com/api/upload/sanitize-and-save-logo', formData, { headers: headers, responseType: 'blob' })
          .subscribe(data => {
            // Sanitized logo returned from backend
          })
          **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  openSaveDetails() {
    console.log('Test');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @Output() updateVariableEvent = new EventEmitter();

  uploadVideo() {
    // Upload the Video to buttton
    if (this.fileEntry !== undefined) {
      this.fileEntry.file((file) => {
        this._videoService.uploadVideo(file, 'VIDEO')?.subscribe(
          (event) => {
            if (event.type === 1) {
              // HttpEventType.Sent (request sent, not relevant for progress)
            } else if (event.type === 'progress') {
              // HttpEventType.UploadProgress
              console.log(event);
              this.showProgressBar = true;
              this.progressValue = event.value;
              console.log(this.progressValue);
            } else if (event.type === 'complete') {
              // HttpEventType.Response (upload complete)
              this.showProgressBar = false;
              this.updateVariableEvent.emit({
                showDetailsView: true,
                ...event.data,
                fileName: this.fileName,
              });
            }
          }

          // (data) => {
          //   this.router.navigateByUrl('/save-video-details/' + data.videoId);
          //   this.updateVariableEvent.emit({
          //     showDetailsView: true,
          //     ...data,
          //     fileName: this.fileName,
          //   });
          // },
          // (error: any) => {
          //   this.updateVariableEvent.emit({
          //     showDetailsView: true,
          //     fileName: this.fileName,
          //     videoId: '657d2117cf3a2074a722a958',
          //     videoUrl:
          //       'https://firebasestorage.googleapis.com/v0/b/video-stream-app-cf76a.appspot.com/o/122dd4a4-3993-4bf3-aff1-d413b6c6145c.mp4?alt=media',
          //   });
          // }
        );
      });
    }
  }
}
