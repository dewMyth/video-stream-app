import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import { UploadVideoResponse } from './upload-video/UploadVideoResponse';
import { SaveVideoDetailsInput } from './save-video-details/dto/save-video-details.input';
import { SaveVideoDetailsResponse } from './save-video-details/dto/save-video-details.response';

@Injectable({
  providedIn: 'root',
})
export class UploadVideoService {
  constructor(private _httpClient: HttpClient) {}

  uploadVideo(
    uploadedFile: File,
    type: string,
    videoId?: string
  ): Observable<UploadVideoResponse> | undefined {
    const formData = new FormData();
    formData.append('file', uploadedFile as Blob, uploadedFile.name);

    // API Call to backend
    switch (type) {
      case 'VIDEO':
        return this._httpClient.post<UploadVideoResponse>(
          'http://localhost:8080/api/videos',
          formData
        );
      case 'THUMBNAIL':
        return this._httpClient.post<UploadVideoResponse>(
          `http://localhost:8080/api/videos/thumbnail?videoId=${videoId}`,
          formData
        );
      default:
        return;
    }
  }

  saveDetails(
    data: SaveVideoDetailsInput
  ): Observable<SaveVideoDetailsResponse> | undefined {
    return this._httpClient.put<SaveVideoDetailsResponse>(
      'http://localhost:8080/api/videos/edit',
      data
    );
  }
}
