import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Story } from './story.entity';
import { GetStoriesFilterDto } from './dto/get-stories-filter.dto';
import { CreateStoryDto } from './dto/create-story.dto';
import { getPagination, getPagingData } from './pagination';
import { GetStories } from './story.types';
import { User } from 'src/auth/user.entity';
import { Role } from 'src/auth/role.enum';
import { GetStoriesFilterManagerDto } from './dto/get-stories-filter-admin.dto';

@Injectable()
export class StoriesRepository extends Repository<Story> {
  private logger = new Logger('StoriesRepository', { timestamp: true });
  constructor(private dataSource: DataSource) {
    super(Story, dataSource.createEntityManager());
  }

  async getStories(filterDto: GetStoriesFilterDto): Promise<GetStories> {
    const {
      search,
      date1,
      date2,
      withAlwaysActiveStories,
      limit: _limit,
      page,
    } = filterDto;

    const query = this.createQueryBuilder('story');

    query.where('story.isReviewed = :isReviewed', { isReviewed: true });

    if (search) {
      query.andWhere(
        '(LOWER(story.title) LIKE LOWER(:search) OR LOWER(story.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (date1 || date2) {
      if (!date1) {
        throw new BadRequestException('At least date1 needs to be given.');
      }

      if (withAlwaysActiveStories) {
        query.andWhere(
          new Brackets((qb) => {
            qb.where('story.year_of_story BETWEEN :date1 AND :date2', {
              date1,
              date2:
                date2 ??
                Number(
                  (new Date().getFullYear() - 1).toString() +
                    new Date().getFullYear().toString(),
                ),
            }).orWhere('story.year_of_story = 0');
          }),
        );
      } else {
        query.andWhere('story.year_of_story BETWEEN :date1 AND :date2', {
          date1,
          date2:
            date2 ??
            Number(
              (new Date().getFullYear() - 1).toString() +
                new Date().getFullYear().toString(),
            ),
        });
      }
    }

    if (!date1 && !date2 && !withAlwaysActiveStories) {
      query.andWhere('story.year_of_story != 0');
    }

    const { limit, offset } = getPagination(page, _limit);
    query.offset(offset);
    query.limit(limit);

    query.orderBy('story.created_at', 'DESC');

    try {
      const stories = await query.getManyAndCount();
      const response = getPagingData(stories, page, limit);
      return response as unknown as GetStories;
    } catch (error) {
      this.logger.error(
        `Failed to get stories. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async getStoriesManager(
    filterDto: GetStoriesFilterManagerDto,
  ): Promise<Story[]> {
    const { isReviewed } = filterDto;

    try {
      if (!isReviewed) {
        const stories = await this.findBy({ isReviewed: false });
        return stories;
      } else {
        return [] as Story[];
      }
    } catch (error) {
      this.logger.error(
        `Failed to get stories. Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createStory(
    createStoryDto: CreateStoryDto,
    user: User,
  ): Promise<Story> {
    const { roles } = user;
    const shouldNotGetReview = roles.some(
      (role) => role === Role.Manager || role === Role.Admin,
    );

    const { description, title, year_of_story } = createStoryDto;

    const story = this.create({
      title: title.trim(),
      description: description.trim(),
      year_of_story,
      isReviewed: shouldNotGetReview,
      created_at: new Date().toISOString(),
    });

    try {
      await this.save(story);
      return story;
    } catch (error) {
      this.logger.error(
        `Failed to create story. Filters: ${JSON.stringify(createStoryDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
