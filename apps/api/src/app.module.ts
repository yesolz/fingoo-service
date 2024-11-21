import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunityModule } from './community/community.module';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './config/typeorm.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@nestjs-modules/ioredis';
import { NumericalGuidanceModule } from './numerical-guidance/numerical-guidance.module';
import { RedisConfigService } from './config/redis.config.service';
import { UserModule } from './user/user.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './user/util/jwt-auth.guard';
import { SupabaseModule } from './user/infrastructure/adapter/supabase/supabase.module';
import { SupabaseConnection } from './user/infrastructure/adapter/supabase/supabase.connection';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
    }),
    CommunityModule,
    NumericalGuidanceModule,
    UserModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (supabaseConnection: SupabaseConnection) => {
        return new JwtAuthGuard(supabaseConnection);
      },
      inject: [SupabaseConnection],
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
