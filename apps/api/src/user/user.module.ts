import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMetadataEntity } from './infrastructure/adapter/supabase/entity/user-metadata.entity';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { SignUpUserCommandHandler } from './application/command/sign-up-user/sign-up-user.command.handler';
import { SignInUserQueryHandler } from './application/query/sign-in-user/sign-in-user.query.handler';
import { SupabaseAdapter } from './infrastructure/adapter/supabase/supabase.adapter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserMetadataEntity]), JwtModule.register({}), PassportModule, CqrsModule],
  controllers: [UserController],
  providers: [
    SignUpUserCommandHandler,
    SignInUserQueryHandler,
    SupabaseAdapter,
    { provide: 'SignInPort', useClass: SupabaseAdapter },
    { provide: 'SignUpPort', useClass: SupabaseAdapter },
  ],
})
export class UserModule {}
