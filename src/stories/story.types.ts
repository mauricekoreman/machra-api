import { Story } from './story.entity';

export interface GetStories {
  data: Story[];
  page: number;
  limit: number;
}
