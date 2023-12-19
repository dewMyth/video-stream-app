import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Video } from '../types/Video.type';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.css'],
})
export class ViewVideoComponent implements OnInit {
  public videoId: string = '';
  preload: string = 'auto';
  api: VgApiService;
  video: Video;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _videoService: VideoService
  ) {
    this.videoId = this.activatedRoute.snapshot.params.videoId;
  }

  async ngOnInit(): Promise<void> {
    this._videoService.getVideoDetailsById(this.videoId).subscribe(
      (data: Video) => {
        this.video = data;
      },
      (error) => {
        console.error('Error fetching video details:', error);
      }
    );
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;

    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      // Set the video to the beginning
      this.api.getDefaultMedia().currentTime = 0;
    });
  }
}
