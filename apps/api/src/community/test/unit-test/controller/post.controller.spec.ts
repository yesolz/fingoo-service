import { PostController } from '../../../api/post.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostRequestDto } from '../../../api/dto/request/create-post.request.dto';
import { mockUser1 } from '../../../../user/test/data/mock-user.user1';
import { SupabaseConnection } from '../../../../user/infrastructure/adapter/supabase/supabase.connection';

describe('PostController', () => {
  let postController: PostController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: SupabaseConnection,
          useValue: {
            connection: {
              auth: {
                getUser: jest.fn().mockResolvedValue({
                  data: { user: { id: 'mock-user-id', email: 'mockuser@example.com' } },
                  error: null,
                }),
              },
            },
          },
        },
      ],
    }).compile();

    postController = module.get<PostController>(PostController);
  });

  it('create', async () => {
    const createPostRequestDto: CreatePostRequestDto = {
      content: 'test content',
    };

    await expect(postController.createPost(createPostRequestDto, mockUser1)).resolves.not.toThrow();
  });
});
