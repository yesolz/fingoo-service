import { PostController } from '../../../api/post.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostRequestDto } from '../../../api/dto/request/create-post.request.dto';
import { mockSession1, mockUser1 } from '../../../../user/test/data/mock-user.user1';
import { SupabaseConnection } from '../../../../user/infrastructure/adapter/supabase/supabase.connection';
import { mockSession2 } from '../../../../user/test/data/mock-user.user2';

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
                getUser: jest.fn((token: string) => {
                  if (token === mockSession1.access_token) {
                    return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
                  } else if (token === mockSession2.access_token) {
                    return Promise.resolve({ data: { user: null, session: null }, error: 'Invalid token' });
                  } else {
                    return Promise.resolve({ data: { user: null, session: null }, error: 'No token provided' });
                  }
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
