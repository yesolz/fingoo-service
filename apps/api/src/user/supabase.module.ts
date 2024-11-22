import { Module, Global } from '@nestjs/common';
import { SupabaseConnection } from './infrastructure/adapter/supabase/supabase.connection';

@Global()
@Module({
  providers: [SupabaseConnection],
  exports: [SupabaseConnection],
})
export class SupabaseModule {}
