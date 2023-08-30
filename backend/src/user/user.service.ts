import { ConflictException, Injectable } from '@nestjs/common';
import { UserFirestoreService } from 'src/firebase/user-firestore/user-firestore.service';
import { UserSignUpRequest } from './DTO/User.dto';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private userFirestoreService: UserFirestoreService) {}
  async signUp(userData: UserSignUpRequest) {
    const user = await this.userFirestoreService.getUserByEmail(userData.email);

    if (user) {
      throw new ConflictException('user already exists');
    }

    const salt = genSaltSync();
    const password = hashSync(userData.password, salt);
    return this.userFirestoreService.createUser(
      Object.assign({}, userData, { password }),
    );
  }
}
