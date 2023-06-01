import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Story } from './story.entity';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';

@Injectable()
export class StoriesRepository extends Repository<Story> {
  private logger = new Logger('TasksRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Story, dataSource.createEntityManager());
  }

  async getStories(filterDto: GetStoriesFilterDto): Promise<Story[]> {
    const { active, punishment, search, tile } = filterDto;

    const query = this.createQueryBuilder('task');

    if (active) {
      query.andWhere('task.active = :active', { active });
    }

    try {
      const stories = query.getMany();
      return stories;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createStory(createStoryDto: CreateStoryDto): Promise<Story> {
    const { active, description, punishment, title, tile } = createStoryDto;

    const story = this.create({
      title,
      description,
      punishment,
      tile,
      active,
    });

    try {
      this.save(story);
      return story;
    } catch (error) {
      this.logger.error(
        `Failed to create story for user. Filters: ${JSON.stringify(
          createStoryDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
