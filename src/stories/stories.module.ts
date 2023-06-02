import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { StoriesRepository } from './stories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './story.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Story])],
  controllers: [StoriesController],
  providers: [StoriesService, StoriesRepository],
})
export class StoriesModule {}
