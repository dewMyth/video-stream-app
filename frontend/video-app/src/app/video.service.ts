import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Video } from './types/Video.type';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private httpClient: HttpClient) {}

  getVideoDetailsById(videoId: string) {
    return this.httpClient.get<Video>(
      `http://localhost:8080/api/videos/${videoId}`
    );
  }
}
