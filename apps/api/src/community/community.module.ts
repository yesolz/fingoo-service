import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostController } from './api/post.controller';
import { CreatePostCommandHandler } from './application/command/post/create-post/create-post.command.handler';
import { CommunityPersistentAdapter } from './infrastructure/adapter/persistence/community.persistent.adapter';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './infrastructure/adapter/persistence/entity/post.entity';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 20000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [PostController],
  providers: [
    CreatePostCommandHandler,
    {
      provide: 'CreatePostPort',
      useClass: CommunityPersistentAdapter,
    },
  ],
})
export class CommunityModule {}
