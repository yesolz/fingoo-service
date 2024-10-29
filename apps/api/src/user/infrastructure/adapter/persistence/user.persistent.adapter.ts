import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GetUserPort } from '../../../application/port/persistence/get-user.port';
import { UpdateUserPort } from '../../../application/port/persistence/update-user.port';
import { CreateUserPort } from '../../../application/port/persistence/create-user.port';
import { DeleteUserPort } from '../../../application/port/persistence/delete-user.port';
import { InjectRepository } from '@nestjs/typeorm';
import { UserMetadataEntity } from './entity/user-metadata.entity';
import { Repository } from 'typeorm';
import { UserMetadataDomain } from '../../../domain/user-metadata.domain';
import { UserMetadataMapper } from './mapper/user-metadata.mapper';

@Injectable()
export class UserPersistentAdapter implements GetUserPort, UpdateUserPort, CreateUserPort, DeleteUserPort {
  private readonly logger = new Logger(UserPersistentAdapter.name);
  constructor(
    @InjectRepository(UserMetadataEntity)
    private readonly userMetadataEntityRepository: Repository<UserMetadataEntity>,
  ) {}

  async createUser(email: string, userId: string, username: string): Promise<UserMetadataEntity> {
    try {
      const userMetadataEntity = new UserMetadataEntity();
      userMetadataEntity.email = email;
      userMetadataEntity.userId = userId;
      userMetadataEntity.username = username;
      return await this.userMetadataEntityRepository.save(userMetadataEntity);
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] 이미 존재하는 사용자 입니다.`,
        message: '이미 존재하는 사용자 입니다.',
        cause: error,
      });
    }
  }

  async getUser(userId: string): Promise<UserMetadataDomain> {
    try {
      const userMetadataEntity: UserMetadataEntity = await this.userMetadataEntityRepository.findOne({
        where: { userId: userId },
      });
      return UserMetadataMapper.mapEntityToDomain(userMetadataEntity);
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 사용자가 존재하지 않습니다.`,
        message: '사용자가 존재하지 않습니다.',
        cause: error,
      });
    }
  }

  async updateUser(userId: string, username: string): Promise<UserMetadataDomain> {
    try {
      const userMetadataEntity: UserMetadataEntity = await this.userMetadataEntityRepository.findOne({
        where: { userId: userId },
      });
      userMetadataEntity.username = username;
      await this.userMetadataEntityRepository.save(userMetadataEntity);
      return UserMetadataMapper.mapEntityToDomain(userMetadataEntity);
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 사용자가 존재하지 않습니다.`,
        message: '사용자가 존재하지 않습니다.',
        cause: error,
      });
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const userMetadataEntity: UserMetadataEntity = await this.userMetadataEntityRepository.findOne({
        where: { userId: userId },
      });
      await this.userMetadataEntityRepository.remove(userMetadataEntity);
      return true;
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] 사용자가 존재하지 않습니다.`,
        message: '사용자가 존재하지 않습니다.',
        cause: error,
      });
    }
  }
}
