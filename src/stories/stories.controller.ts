import { Controller, Get, Param } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from './story.entity';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getStories(): Story[] {
    return this.storiesService.getStories();
  }

  @Get('/:id')
  getStoryById(@Param('id') id: string): Story {
    return this.storiesService.getStoryById(id);
  }
}
