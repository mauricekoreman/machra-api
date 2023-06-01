import { Injectable } from '@nestjs/common';
import { Story } from './story.entity';
import { StoriesRepository } from './stories.repository';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoriesService {
  constructor(private storiesRepository: StoriesRepository) {}

  async getStories(filterDto: GetStoriesFilterDto): Promise<Story[]> {
    return this.storiesRepository.getStories(filterDto);
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    return this.storiesRepository.createStory(createStoryDto);
  }

  // getStoryById(id: string): Story {
  //   const found = this.stories.find((story) => story.id === id);

  //   if (!found) {
  //     throw new NotFoundException(`Task with id "${id}" not found`);
  //   }

  //   return found;
  // }

  // deleteStory(id: string): void {
  //   const found = this.getStoryById(id);
  //   this.stories = this.stories.filter((story) => story.id === found.id);
  // }

  // getStoriesWithFilters(filterDto: GetStoriesFilterDto): Task[] {
  //   const { search, punishment, active, tile } = filterDto;

  //   // let stories = this.getStories();

  //   return this.stories;
  // }
}
