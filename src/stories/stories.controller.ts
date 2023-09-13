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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { GetStories } from './story.types';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetStoriesFilterManagerDto } from './dto/get-stories-filter-admin.dto';

@Controller('stories')
@UseGuards(AuthGuard(), RolesGuard)
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getStories(@Query() filterDto: GetStoriesFilterDto): Promise<GetStories> {
    return this.storiesService.getStories(filterDto);
  }

  @Get('/manager')
  @Roles(Role.Admin, Role.Manager)
  getStoriesManager(
    @Query() filterDto: GetStoriesFilterManagerDto,
  ): Promise<Story[]> {
    return this.storiesService.getStoriesManager(filterDto);
  }

  @Get('/:id')
  getStoryById(@Param('id') id: string): Promise<Story> {
    return this.storiesService.getStoryById(id);
  }

  @Post()
  createStory(
    @Body() createstoryDto: CreateStoryDto,
    @GetUser() user: User,
  ): Promise<Story> {
    return this.storiesService.createStory(createstoryDto, user);
  }

  @Delete('/:id')
  @Roles(Role.Admin, Role.Manager)
  deleteStoryById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.storiesService.deleteStoryById(id, user);
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.Manager)
  updateStoryById(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
  ): Promise<Story> {
    return this.storiesService.updateStoryById(id, updateStoryDto);
  }
}
