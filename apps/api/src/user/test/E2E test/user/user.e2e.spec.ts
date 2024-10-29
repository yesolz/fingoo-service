import { UserMetadataEntity } from '../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { mockSessionIntegration, mockUserIntegration } from '../../data/mock-user.integration';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../../../community/infrastructure/adapter/persistence/entity/post.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from '../../../api/user.controller';
import { DataSource } from 'typeorm';
import { BadRequestException, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../../commons/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { mockSession2, mockUser2 } from '../../data/mock-user.user2';
import { Test } from '@nestjs/testing';
import { SignUpUserCommandHandler } from '../../../application/command/sign-up-user/sign-up-user.command.handler';
import { DeleteUserCommandHandler } from '../../../application/command/delete-user/delete-user.command.handler';
import { UpdateUserCommandHandler } from '../../../application/command/update-user/update-user.command.handler';
import { GetUserQueryHandler } from '../../../application/query/get-user/get-user.query.handler';
import { SupabaseAdapter } from '../../../infrastructure/adapter/supabase/supabase.adapter';
import { SupabaseConnection } from '../../../infrastructure/adapter/supabase/supabase.connection';
import { UserPersistentAdapter } from '../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { mockSession1, mockUser1 } from '../../data/mock-user.user1';

const USERNAME = 'testName';
const PASSWORD = 'password';

const mockSupabaseClient = {
  auth: {
    signUp: jest.fn(({ email }) => {
      if (mockUserIntegration.email === email) {
        return Promise.resolve({ data: { user: null, session: null }, error: 'User already exists.' });
      } else if (mockUser2.email === email) {
        return Promise.resolve({ data: { user: mockUser2, session: mockSession2 }, error: null });
      } else if (mockUser1.email === email) {
        return Promise.resolve({ data: { user: mockUser1, session: mockSession1 }, error: null });
      }
    }),
    admin: {
      deleteUser: jest.fn().mockImplementation((userId) => {
        if (userId === mockUserIntegration.id) {
          return true;
        }
        throw new BadRequestException();
      }),
    },
    getUser: jest.fn((token: string) => {
      if (token === mockSessionIntegration.access_token) {
        return Promise.resolve({
          data: { user: mockUserIntegration, session: mockSessionIntegration },
          error: null,
        });
      } else if (token === mockSession2.access_token || token === mockSession1.access_token) {
        return Promise.resolve({ data: { user: null, session: null }, error: 'Invalid token' });
      } else {
        return Promise.resolve({ data: { user: null, session: null }, error: 'No token provided' });
      }
    }),
  },
};

jest.mock('../../../infrastructure/adapter/supabase/supabase.connection', () => {
  return {
    SupabaseConnection: jest.fn().mockImplementation(() => {
      return {
        connection: mockSupabaseClient,
      };
    }),
  };
});

describe('User E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let environment;

  const seeding = async () => {
    const userMetadataEntityRepository = dataSource.getRepository(UserMetadataEntity);
    await userMetadataEntityRepository.delete({});

    const userMetadataEntity = new UserMetadataEntity();
    userMetadataEntity.email = mockUserIntegration.email;
    userMetadataEntity.userId = mockUserIntegration.id;
    userMetadataEntity.username = USERNAME;

    await userMetadataEntityRepository.insert(userMetadataEntity);
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        CqrsModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 10000,
            maxRedirects: 5,
          }),
        }),
        TypeOrmModule.forFeature([UserMetadataEntity, PostEntity]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            type: 'postgres',
            retryAttempts: 20,
            retryDelay: 5000,
            host: environment.getHost(),
            port: environment.getPort(),
            username: environment.getUsername(),
            password: environment.getPassword(),
            database: environment.getDatabase(),
            entities: [UserMetadataEntity, PostEntity],
            synchronize: true,
          }),
        }),
      ],
      controllers: [UserController],
      providers: [
        SupabaseConnection,
        { provide: 'SignUpPort', useClass: SupabaseAdapter },
        { provide: 'CreateUserPort', useClass: UserPersistentAdapter },
        { provide: 'GetUserPort', useClass: UserPersistentAdapter },
        { provide: 'UpdateUserPort', useClass: UserPersistentAdapter },
        { provide: 'AccountDeletionPort', useClass: SupabaseAdapter },
        { provide: 'DeleteUserPort', useClass: UserPersistentAdapter },
        SignUpUserCommandHandler,
        GetUserQueryHandler,
        UpdateUserCommandHandler,
        DeleteUserCommandHandler,
      ],
    }).compile();
    dataSource = module.get<DataSource>(DataSource);
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await environment.stop();
    await app.close();
  });

  beforeEach(async () => {
    await seeding();
  });

  describe('GetUser', () => {
    it('/user get, 존재하는 사용자 정보로 조회 시도', async () => {
      return request(app.getHttpServer())
        .get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSessionIntegration.access_token)
        .expect(HttpStatus.OK);
    });

    it('/user get, 존재하지 않는 사용자 정보로 조회 시도', async () => {
      return request(app.getHttpServer())
        .get('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSession2.access_token)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('UpdateUser', () => {
    it('/user update, 존재하는 사용자 정보로 수정 시도', async () => {
      return request(app.getHttpServer())
        .patch('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSessionIntegration.access_token)
        .send({ username: USERNAME })
        .expect(HttpStatus.OK);
    });

    it('/user update, 존재하지 않는 사용자 정보로 수정 시도', async () => {
      return request(app.getHttpServer())
        .patch('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSession2.access_token)
        .send({ username: USERNAME })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('CreateUser', () => {
    it('/user signup, 존재하지 않는 사용자 정보로 생성 시도', async () => {
      return request(app.getHttpServer())
        .post('/api/user/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: mockUser2.email,
          password: PASSWORD,
          username: USERNAME,
        })
        .expect(HttpStatus.OK);
    });

    it('/user signup, 존재하지 않는 사용자 정보로 동시 생성 시도', async () => {
      const [response1, response2] = await Promise.all([
        request(app.getHttpServer()).post('/api/user/signup').set('Content-Type', 'application/json').send({
          email: mockUser2.email,
          password: PASSWORD,
          username: USERNAME,
        }),
        request(app.getHttpServer()).post('/api/user/signup').set('Content-Type', 'application/json').send({
          email: mockUser1.email,
          password: PASSWORD,
          username: USERNAME,
        }),
      ]);
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response1.body.session).toHaveProperty('access_token');
      expect(response2.body.session).toHaveProperty('access_token');

      expect(response1.body.session).not.toBe(response2.body.session);
    });

    it('/user signup, 존재하는 사용자 정보로 생성 시도', async () => {
      return request(app.getHttpServer())
        .post('/api/user/signup')
        .set('Content-Type', 'application/json')
        .send({
          email: mockUserIntegration.email,
          password: PASSWORD,
          username: USERNAME,
        })
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('DeleteUser', () => {
    it('/user, 존재하는 사용자 정보로 삭제 시도', async () => {
      return request(app.getHttpServer())
        .delete('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSessionIntegration.access_token)
        .expect(HttpStatus.OK);
    });

    it('/user, 존재하지 않는 사용자 정보로 삭제 시도', async () => {
      return request(app.getHttpServer())
        .delete('/api/user')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + mockSession2.access_token)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
