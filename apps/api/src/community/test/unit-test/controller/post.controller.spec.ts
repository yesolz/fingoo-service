import { PostController } from '../../../api/post.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostRequestDto } from '../../../api/dto/request/create-post.request.dto';
import { mockUser1 } from '../../../../user/test/data/mock-user.user1';
import { UpdatePostRequestDto } from '../../../api/dto/request/update-post.request.dto';
import { Response } from 'express';
import { GetPostsRequestDto } from '../../../api/dto/request/get-posts.request.dto';

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

  it('update', async () => {
    const updatePostRequestDto: UpdatePostRequestDto = {
      content: 'test content',
    };
    await expect(postController.updatePost('123', updatePostRequestDto, mockUser1)).resolves.not.toThrow();
  });

  it('delete', async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    await expect(postController.deletePost('123', mockUser1, response)).resolves.not.toThrow();
  });

  it('get posts by cursor', async () => {
    const getPostsRequestDto: GetPostsRequestDto = {
      cursorId: 10,
    };
    await expect(postController.getPosts(getPostsRequestDto)).resolves.not.toThrow();
  });
});
