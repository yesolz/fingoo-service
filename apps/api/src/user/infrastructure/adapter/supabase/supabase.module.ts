import { Module, Global } from '@nestjs/common';
import { SupabaseConnection } from './supabase.connection';

@Global()
@Module({
  providers: [SupabaseConnection],
  exports: [SupabaseConnection],
})
export class SupabaseModule {}
