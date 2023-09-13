import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Story } from './story.entity';
import { StoriesRepository } from './stories.repository';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { GetStories } from './story.types';
import { User } from 'src/auth/user.entity';
import { GetStoriesFilterManagerDto } from './dto/get-stories-filter-admin.dto';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class StoriesService {
  private logger = new Logger();
  constructor(private storiesRepository: StoriesRepository) {}

  getStories(filterDto: GetStoriesFilterDto): Promise<GetStories> {
    return this.storiesRepository.getStories(filterDto);
  }

  getStoriesManager(filterDto: GetStoriesFilterManagerDto): Promise<Story[]> {
    return this.storiesRepository.getStoriesManager(filterDto);
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

  createStory(createStoryDto: CreateStoryDto, user: User): Promise<Story> {
    return this.storiesRepository.createStory(createStoryDto, user);
  }

  async deleteStoryById(id: string, user: User): Promise<void> {
    const isManager = user.roles.includes(Role.Manager);

    const story = await this.storiesRepository.findOneBy({ id });

    // manager is only allowed to delete story if the story has not been approved yet.
    if (story.isReviewed && isManager) {
      throw new UnauthorizedException();
    }

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
