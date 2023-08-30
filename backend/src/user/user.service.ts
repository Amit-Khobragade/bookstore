import { ConflictException, Injectable } from '@nestjs/common';
import { UserFirestoreService } from 'src/firebase/user-firestore/user-firestore.service';
import { UserSignUpRequest } from './DTO/User.dto';

@Injectable()
export class UserService {
  constructor(private userFirestoreService: UserFirestoreService) {}
  async signUp(userData: UserSignUpRequest) {
    const user = await this.userFirestoreService.getUserByEmail(userData.email);

    if (user) {
      throw new ConflictException('user already exists');
    }
    return this.userFirestoreService.createUser(Object.assign({}, userData));
  }
}
