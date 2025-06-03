import {  UserEntity } from '../user/index.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { LogoutUserDto } from '../user/dto/logout-user.dto.js';

export interface AuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
  logout(dto: LogoutUserDto): Promise<string>;
}