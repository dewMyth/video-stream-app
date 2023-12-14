import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import { UploadVideoResponse } from './upload-video/UploadVideoResponse';

@Injectable({
  providedIn: 'root',
})
export class UploadVideoService {
  constructor(private _httpClient: HttpClient) {}

  uploadVideo(uploadedFile: File): Observable<UploadVideoResponse> {
    const formData = new FormData();
    formData.append('file', uploadedFile as Blob, uploadedFile.name);

    // API Call to backend
    return this._httpClient.post<UploadVideoResponse>(
      'http://localhost:8080/api/videos',
      formData
    );
  }
}
