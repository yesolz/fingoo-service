import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMetadataEntity } from './infrastructure/adapter/persistence/entity/user-metadata.entity';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { SignUpUserCommandHandler } from './application/command/sign-up-user/sign-up-user.command.handler';
import { SignInUserQueryHandler } from './application/query/sign-in-user/sign-in-user.query.handler';
import { SupabaseAdapter } from './infrastructure/adapter/supabase/supabase.adapter';
import { JwtModule } from '@nestjs/jwt';
import { SupabaseConnection } from './infrastructure/adapter/supabase/supabase.connection';
import { DeleteUserCommandHandler } from './application/command/delete-user/delete-user.command.handler';
import { UpdateUserCommandHandler } from './application/command/update-user/update-user.command.handler';
import { GetUserQueryHandler } from './application/query/get-user/get-user.query.handler';
import { RefreshTokenQueryHandler } from './application/query/refresh-token/refresh-token.query.handler';
import { UserPersistentAdapter } from './infrastructure/adapter/persistence/user.persistent.adapter';
import { JwtAuthGuard } from './util/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserMetadataEntity]), JwtModule.register({}), PassportModule, CqrsModule],
  controllers: [UserController],
  providers: [
    SignUpUserCommandHandler,
    DeleteUserCommandHandler,
    UpdateUserCommandHandler,
    GetUserQueryHandler,
    SignInUserQueryHandler,
    RefreshTokenQueryHandler,
    SupabaseConnection,
    JwtAuthGuard,
    SupabaseAdapter,
    { provide: 'CreateUserPort', useClass: UserPersistentAdapter },
    { provide: 'GetUserPort', useClass: UserPersistentAdapter },
    { provide: 'UpdateUserPort', useClass: UserPersistentAdapter },
    { provide: 'DeleteUserPort', useClass: UserPersistentAdapter },
    { provide: 'SignInPort', useClass: SupabaseAdapter },
    { provide: 'SignUpPort', useClass: SupabaseAdapter },
    { provide: 'AccountDeletionPort', useClass: SupabaseAdapter },
    { provide: 'RefreshTokenPort', useClass: SupabaseAdapter },
  ],
})
export class UserModule {}
