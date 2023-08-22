import { Body, Controller, Get, Headers, Post, Put } from '@nestjs/common';

@Controller({ path: 'user', version: '1' })
export class UserController {
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
  signup(@Body() body) {
    console.debug(body);
    return {};
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
