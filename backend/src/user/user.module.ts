import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [FirebaseModule],
})
export class UserModule {}
