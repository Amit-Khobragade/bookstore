import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';
import { UserSignUpRequest } from './DTO/User.dto';
import { UserService } from './user.service';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUser(@Headers() headers) {
    console.debug(headers);
    return {};
  }

  @Post('sign-in')
  login(@Body() body) {
    console.debug(body);
    return {};
  }

  @Post('sign-up')
  async signup(@Body() body: UserSignUpRequest) {
    return await this.userService.signUp(body);
  }

  @Put()
  updateUser(@Body() body) {
    console.debug(body);
    return {};
  }

  @Put('forgot-password')
  forgetPassword(@Body() body) {
    console.debug(body);
    return {};
  }

  @Put('update-password')
  updatePassword(@Body() body) {
    console.debug(body);
    return {};
  }
}
