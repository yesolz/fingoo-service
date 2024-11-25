import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseConnection {
  private readonly logger = new Logger(SupabaseConnection.name);
  private _connection: SupabaseClient;

  constructor() {
    this.logger.log('SupabaseConnection 인스턴스 생성');

    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        const missingVars = [];
        if (!supabaseUrl) missingVars.push('SUPABASE_URL');
        if (!supabaseKey) missingVars.push('SUPABASE_KEY');
        this.logger.error(`환경 변수가 누락되었습니다: ${missingVars.join(', ')}`);
        throw new BadRequestException(`환경 변수가 누락되었습니다: ${missingVars.join(', ')}`);
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
    if (!this._connection) {
      this.logger.error('Supabase 클라이언트가 초기화되지 않았습니다.');
      throw new BadRequestException('Supabase 클라이언트가 초기화되지 않았습니다.');
    }
    return this._connection;
  }
}
