import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from './story.entity';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getStories(@Query() filterDto: GetStoriesFilterDto): Promise<Story[]> {
    return this.storiesService.getStories(filterDto);
  }

  @Post()
  createStory(@Body() createstoryDto: CreateStoryDto): Promise<Story> {
    return this.storiesService.createStory(createstoryDto);
  }

  // @Get('/:id')
  // getStoryById(@Param('id') id: string): Story {
  //   return this.storiesService.getStoryById(id);
  // }
}
