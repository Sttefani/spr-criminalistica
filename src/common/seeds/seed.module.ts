import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { AdminUserSeedService } from './admin-user-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminUserSeedService],
})
export class SeedModule {}