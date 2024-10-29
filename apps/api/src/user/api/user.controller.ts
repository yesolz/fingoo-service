import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { Public } from '../util/public.decorator';
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../commons/exception-filter/api-exception-response.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SignInUserQuery } from '../application/query/sign-in-user/sign-in-user.query';
import { SignUpUserCommand } from '../application/command/sign-up-user/sign-up-user.command';
import { JwtAuthGuard } from '../util/jwt-auth.guard';
import { Response } from 'express';
import { UpdateUserRequestDto } from './dto/request/update-user.request.dto';
import { SessionDto } from './dto/response/session.dto';
import { RefreshTokenRequestDto } from './dto/request/refresh-token.request.dto';
import { RefreshTokenQuery } from '../application/query/refresh-token/refresh-token.query';
import { GetUserQuery } from '../application/query/get-user/get-user.query';
import { GetUserResponseDto } from './dto/response/get-user.response.dto';
import { LoginUser } from '../util/login-user.decorator';
import { User } from '@supabase/supabase-js';
import { UpdateUserCommand } from '../application/command/update-user/update-user.command';
import { DeleteUserCommand } from '../application/command/delete-user/delete-user.command';
import { UpdateUserResponseDto } from './dto/response/update-user.response.dto';

@ApiTags('UserController')
@Controller({ path: '/api/user' })
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiCreatedResponse({ type: SessionDto })
  @ApiExceptionResponse(
    404,
    `[ERROR] 로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.`,
    '로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.',
  )
  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() response: Response) {
    const { email, password, username } = signUpDto;
    const command = new SignUpUserCommand(email, password, username);
    try {
      const session: SessionDto = await this.commandBus.execute(command);
      response.setHeader('Authorization', `Bearer ${session.access_token}`);
      response.status(HttpStatus.OK).send({ session });
    } catch (error) {
      response.status(HttpStatus.CONFLICT).send({ message: '회원가입 실패' });
    }
  }

  @ApiOkResponse({ type: SessionDto })
  @ApiExceptionResponse(
    404,
    `[ERROR] 로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.`,
    '로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.',
  )
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: '인증을 위한 Bearer token',
  })
  @Public()
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
    const { email, password } = signInDto;
    const query = new SignInUserQuery(email, password);
    try {
      const session: SessionDto = await this.queryBus.execute(query);
      response.setHeader('Authorization', `Bearer ${session.access_token}`);
      response.status(HttpStatus.OK).send({ session });
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).send({ message: '로그인 실패' });
    }
  }

  @ApiOkResponse({ type: SessionDto })
  @ApiExceptionResponse(401, `[ERROR] 유효한 Refresh Token이 아닙니다.`, '유효한 Refresh Token이 아닙니다.')
  @Public()
  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenRequestDto: RefreshTokenRequestDto, @Res() response: Response) {
    const { refreshToken } = refreshTokenRequestDto;
    const query = new RefreshTokenQuery(refreshToken);
    try {
      const session: SessionDto = await this.queryBus.execute(query);
      response.setHeader('Authorization', `Bearer ${session.access_token}`);
      response.status(HttpStatus.OK).send({ session });
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).send({ message: '새로운 토큰을 발급받지 못했습니다.' });
    }
  }

  @ApiOkResponse({
    description: '사용자 정보가 성공적으로 반환되었습니다.',
  })
  @ApiExceptionResponse(
    400,
    `[ERROR] 요청에 문제가 발생했습니다. 잘못된 요청 형식입니다.`,
    '잘못된 요청입니다. 요청 형식을 확인해주세요.',
  )
  @ApiExceptionResponse(
    401,
    `[ERROR] 인증에 실패했습니다. 유효하지 않은 토큰입니다.`,
    '인증에 실패했습니다. 유효한 Bearer token을 제공해주세요.',
  )
  @ApiExceptionResponse(
    404,
    `[ERROR] 로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.`,
    '로그인 중 오류가 발생했습니다. email과 password를 확인해주세요.',
  )
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: '인증을 위한 Bearer token',
  })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@LoginUser() user: User): Promise<GetUserResponseDto> {
    const query = new GetUserQuery(user.id);
    return this.queryBus.execute(query);
  }

  @ApiOkResponse({
    description: '사용자 정보가 성공적으로 업데이트되었습니다.',
  })
  @ApiExceptionResponse(
    400,
    `[ERROR] 요청에 문제가 발생했습니다. 잘못된 요청 형식입니다.`,
    '잘못된 요청입니다. 요청 형식을 확인해주세요.',
  )
  @ApiExceptionResponse(
    401,
    `[ERROR] 인증에 실패했습니다. 유효하지 않은 토큰입니다.`,
    '인증에 실패했습니다. 유효한 Bearer token을 제공해주세요.',
  )
  @ApiExceptionResponse(404, `[ERROR] 사용자를 찾을 수 없습니다.`, '업데이트할 사용자 정보를 찾을 수 없습니다.')
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @LoginUser() user: User,
    @Body() updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const command = new UpdateUserCommand(user.id, updateUserRequestDto.username);
    return this.commandBus.execute(command);
  }

  @ApiOkResponse({
    description: '사용자 정보가 성공적으로 삭제되었습니다.',
  })
  @ApiExceptionResponse(
    400,
    `[ERROR] 요청에 문제가 발생했습니다. 잘못된 요청 형식입니다.`,
    '잘못된 요청입니다. 요청 형식을 확인해주세요.',
  )
  @ApiExceptionResponse(
    401,
    `[ERROR] 인증에 실패했습니다. 유효하지 않은 토큰입니다.`,
    '인증에 실패했습니다. 유효한 Bearer token을 제공해주세요.',
  )
  @ApiExceptionResponse(404, `[ERROR] 사용자를 찾을 수 없습니다.`, '삭제할 사용자 정보를 찾을 수 없습니다.')
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@LoginUser() user: User, @Res() response: Response) {
    const command = new DeleteUserCommand(user.id);
    try {
      await this.commandBus.execute(command);
      response.status(HttpStatus.OK).send({ message: '사용자가 삭제되었습니다.' });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: '삭제하고자 하는 사용자가 없습니다.' });
    }
    return user;
  }
}
