import { Module } from '@nestjs/common';
import { StoriesModule } from './stories/stories.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidationSchema } from './config-schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './auth/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
      }),
    }),
    StoriesModule,
    AuthModule,
    AdminModule,
  ],
})
export class AppModule {}
