import { Module, forwardRef } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth.module';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [forwardRef(() => AuthModule)],
})
export class AdminModule {}
