import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseConnection {
  private readonly logger = new Logger(SupabaseConnection.name);
  private _connection: SupabaseClient;

  constructor() {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new BadRequestException('Supabase URL 또는 Key가 설정되지 않았습니다. 환경 변수를 확인하세요.');
      }
      this._connection = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: true, persistSession: false },
      });
      this.logger.log('Supabase 클라이언트가 성공적으로 생성되었습니다.');
    } catch (error) {
      this.logger.error('Supabase 클라이언트 생성 중 오류가 발생했습니다:', error.message);
      throw new BadRequestException('Supabase 클라이언트 생성에 실패했습니다. 오류 메시지: ' + error.message);
    }
  }

  get connection(): SupabaseClient {
    return this._connection;
  }
}
