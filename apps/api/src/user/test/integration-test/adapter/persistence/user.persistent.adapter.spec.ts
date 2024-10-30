import { DataSource } from 'typeorm';
import { UserPersistentAdapter } from '../../../../infrastructure/adapter/persistence/user.persistent.adapter';
import { UserMetadataEntity } from '../../../../infrastructure/adapter/persistence/entity/user-metadata.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockUserIntegration } from '../../../data/mock-user.integration';
import { BadRequestException } from '@nestjs/common';
import { mockUser2 } from '../../../data/mock-user.user2';
import { UserMetadataDomain } from '../../../../domain/user-metadata.domain';
import { Test } from '@nestjs/testing';

const USERNAME = 'testName';

describe('UserPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let userPersistentAdapter: UserPersistentAdapter;
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
        ConfigModule.forRoot(),
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 10000,
            maxRedirects: 5,
          }),
        }),
        TypeOrmModule.forFeature([UserMetadataEntity]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
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
            entities: [UserMetadataEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [UserPersistentAdapter],
    }).compile();
    userPersistentAdapter = await module.resolve<UserPersistentAdapter>(UserPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
  }, 80000);

  afterAll(async () => {
    await environment.stop();
    dataSource.destroy();
  });

  beforeEach(async () => {
    await seeding();
  });

  describe('CreateUser', () => {
    it('새로운 사용자 정보로 회원가입 시도', async () => {
      const userMetadataEntity: UserMetadataEntity = await userPersistentAdapter.createUser(
        mockUser2.email,
        mockUser2.id,
        USERNAME,
      );
      expect(userMetadataEntity.userId).toEqual(mockUser2.id);
      expect(userMetadataEntity.email).toEqual(mockUser2.email);
      expect(userMetadataEntity.username).toEqual(USERNAME);
    });
    it('존재하는 사용자 정보로 회원가입 시도', async () => {
      await expect(async () => {
        await userPersistentAdapter.createUser(mockUserIntegration.email, mockUserIntegration.id, USERNAME);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('GetUser', () => {
    it('존재하는 사용자 정보로 조회 시도', async () => {
      const userMetadataDomain: UserMetadataDomain = await userPersistentAdapter.getUser(mockUserIntegration.id);
      expect(userMetadataDomain.userId).toEqual(mockUserIntegration.id);
      expect(userMetadataDomain.email).toEqual(mockUserIntegration.email);
      expect(userMetadataDomain.username).toEqual(USERNAME);
    });
    it('존재하지 않는 사용자 정보로 조회 시도', async () => {
      await expect(async () => {
        await userPersistentAdapter.getUser(mockUser2.id);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('UpdateUser', () => {
    it('존재하는 사용자 정보로 수정 시도', async () => {
      const userMetadataDomain: UserMetadataDomain = await userPersistentAdapter.updateUser(
        mockUserIntegration.id,
        USERNAME,
      );
      expect(userMetadataDomain.userId).toEqual(mockUserIntegration.id);
      expect(userMetadataDomain.email).toEqual(mockUserIntegration.email);
      expect(userMetadataDomain.username).toEqual(USERNAME);
    });
    it('존재하지 않는 사용자 정보로 수정 시도', async () => {
      await expect(async () => {
        await userPersistentAdapter.updateUser(mockUser2.id, USERNAME);
      }).rejects.toThrow(BadRequestException);
    });
  });

  describe('DeleteUser', () => {
    it('존재하는 사용자 정보로 삭제 시도', async () => {
      const result = await userPersistentAdapter.deleteUser(mockUserIntegration.id);
      expect(result).toBe(true);
    });
    it('존재하지 않는 사용자 정보로 삭제 시도', async () => {
      await expect(async () => {
        await userPersistentAdapter.deleteUser(mockUser2.id);
      }).rejects.toThrow(BadRequestException);
    });
  });
});
