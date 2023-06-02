import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Story } from './story.entity';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('stories')
@UseGuards(AuthGuard())
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getStories(@Query() filterDto: GetStoriesFilterDto): Promise<Story[]> {
    return this.storiesService.getStories(filterDto);
  }

  @Get('/:id')
  getStoryById(@Param('id') id: string): Promise<Story> {
    return this.storiesService.getStoryById(id);
  }

  @Post()
  createStory(@Body() createstoryDto: CreateStoryDto): Promise<Story> {
    return this.storiesService.createStory(createstoryDto);
  }

  @Delete('/:id')
  deleteStoryById(@Param('id') id: string): Promise<void> {
    return this.storiesService.deleteStoryById(id);
  }

  @Patch('/:id')
  updateStoryById(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ): Promise<Story> {
    return this.storiesService.updateStoryById(id, updateStoryDto);
  }
}
