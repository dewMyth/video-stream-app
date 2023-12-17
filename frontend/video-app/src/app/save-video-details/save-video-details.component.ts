import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilService } from '../utils/util.service';
import {
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
  NgxFileDropEntry,
} from 'ngx-file-drop';
import { UploadVideoService } from '../upload-video.service';
import { UploadVideoResponse } from '../upload-video/UploadVideoResponse';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-save-video-details',
  templateUrl: './save-video-details.component.html',
  styleUrls: ['./save-video-details.component.css'],
})
export class SaveVideoDetailsComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  fileUploaded: boolean = false;
  fileEntry: FileSystemFileEntry | undefined;
  fileName: string = '';
  btnText: string = 'Upload Thumbnail';

  constructor(
    public dialogRef: MatDialogRef<SaveVideoDetailsComponent>,
    private _utilService: UtilService,
    private _videoService: UploadVideoService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  public shortUrl: any;
  public thumbnailUrl: any;
  public statuses: string[] = ['PUBLIC', 'PRIVATE', 'UNLISTED'];
  // public tags: string[] = [];

  @Input() videoData: any;

  onNoClick(): void {
    this.dialogRef.close();
  }

  async ngOnInit() {
    console.log(this.videoData);

    this._utilService
      .urlShortner(this.videoData.videoUrl)
      .subscribe((shortUrl: string) => {
        this.videoData = {
          ...this.videoData,
          shortUrl,
        };

        console.log(this.videoData);
      });
  }

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

          this.fileEntry?.file((file: File) => {
            this.generateThumbnail(file);
          });

          this.fileEntry?.file((file) => {
            this._videoService
              .uploadVideo(file, 'THUMBNAIL', this.videoData.videoId)
              ?.subscribe((data: any) => {
                this.thumbnailUrl = data;
              });
          });
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
  generateThumbnail(file: File) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      console.log(event.target);
      this.thumbnailUrl = event.target.result;
      console.log(this.thumbnailUrl);
    };

    reader.readAsDataURL(file);
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  // ChipList Handle
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  // Saving Form
  videoDetailsForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: [''],
    visibility: ['', Validators.required],
  });

  onSubmit() {
    const payload = {
      ...this.videoDetailsForm.value,
      tags: this.tags,
      id: this.videoData.videoId,
    };

    this._videoService.saveDetails(payload)?.subscribe((data) => {
      this.dialogRef.close();
      this.router.navigateByUrl(`/video/${data.id}`);
    });
  }
}
