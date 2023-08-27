import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Story } from './story.entity';
import { StoriesRepository } from './stories.repository';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { GetStories } from './story.types';

@Injectable()
export class StoriesService {
  private logger = new Logger();
  constructor(private storiesRepository: StoriesRepository) {}

  getStories(filterDto: GetStoriesFilterDto): Promise<GetStories> {
    return this.storiesRepository.getStories(filterDto);
  }

  async getStoryById(id: string): Promise<Story> {
    try {
      const found = await this.storiesRepository.findOneBy({ id });
      if (!found) {
        throw new NotFoundException(`Story with id "${id}" not found.`);
      }

      return found;
    } catch (error) {
      if (error.code === '22P02') {
        throw new BadRequestException(`Invalid id "${id}"`);
      } else {
        this.logger.error(`Failed to get story with id "${id}".`, error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    return this.storiesRepository.createStory(createStoryDto);
  }

  async deleteStoryById(id: string): Promise<void> {
    const result = await this.storiesRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Story with id "${id}" not found.`);
    }
  }

  async updateStoryById(
    id: string,
    updateStoryDto: UpdateStoryDto,
  ): Promise<Story> {
    const story = await this.getStoryById(id);

    const { title, description } = updateStoryDto;

    Object.assign(story, {
      title: title.trim(),
      description: description.trim(),
      ...updateStoryDto,
    });

    await this.storiesRepository.save(story);

    return story;
  }
}
