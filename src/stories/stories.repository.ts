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

    const query = this.createQueryBuilder('story');

    if (active) {
      query.andWhere('story.active = :active', { active });
    }

    if (search) {
      query.andWhere(
        '(LOWER(story.title) LIKE LOWER(:search) OR LOWER(story.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (punishment) {
      query.andWhere('story.punishment = :punishment', { punishment });
    }

    if (tile) {
      query.andWhere('story.tile = :tile', { tile });
    }

    try {
      const stories = await query.getMany();
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

    console.log('active: ', active, typeof active);

    const story = this.create({
      title,
      description,
      punishment,
      tile,
      active: Boolean(active),
    });

    console.log(story);
    console.log(story.active);

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
