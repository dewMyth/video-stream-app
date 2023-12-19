import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { Observable } from 'rxjs';
import { UploadVideoResponse } from './upload-video/UploadVideoResponse';
import { SaveVideoDetailsInput } from './save-video-details/dto/save-video-details.input';
import { SaveVideoDetailsResponse } from './save-video-details/dto/save-video-details.response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadVideoService {
  constructor(private _httpClient: HttpClient) {}

  uploadVideo(
    uploadedFile: File,
    type: string,
    videoId?: string
  ): Observable<any> | undefined {
    const formData = new FormData();
    formData.append('file', uploadedFile as Blob, uploadedFile.name);

    // API Call to backend
    switch (type) {
      case 'VIDEO':
        const req = new HttpRequest(
          'POST',
          'http://localhost:8080/api/videos',
          formData,
          {
            reportProgress: true,
          }
        );

        return this._httpClient.request(req).pipe(
          map((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              const percentDone = Math.round(
                (100 * event.loaded) / event.total
              );
              return { type: 'progress', value: percentDone };
            } else if (event.type === HttpEventType.Response) {
              return { type: 'complete', data: event.body };
            }
            return event;
          })
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
