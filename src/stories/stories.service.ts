import { Injectable, NotFoundException } from '@nestjs/common';
import { Story } from './story.entity';

@Injectable()
export class StoriesService {
  private stories: Story[] = [];

  getStories(): Story[] {
    return this.stories;
  }

  getStoryById(id: string): Story {
    const found = this.stories.find((story) => story.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }

    return found;
  }

  deleteStory(id: string): void {
    const found = this.getStoryById(id);
    this.stories = this.stories.filter((story) => story.id === found.id);
  }

  // getStoriesWithFilters(filterDto: GetStoriesFilterDto): Task[] {
  //   const { search, punishment, active, tile } = filterDto;

  //   // let stories = this.getStories();

  //   return this.stories;
  // }

  // createStory(createStoryDto: CreateStoryDto): Story {}
}
