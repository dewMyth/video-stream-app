import { Comment } from './Comment.type';

export interface Video {
  id: string;
  title: string;
  description?: string;
  userId?: string | null;
  likes?: number | null;
  dislikes?: number | null;
  tags?: string[];
  videoUrl: string;
  videoStatus?: string | null;
  viewCount?: number | null;
  thumbnailUrl?: string;
  comments?: Comment[] | null; // Assuming Comment is another DTO for comments
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
