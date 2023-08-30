import { ConflictException, Injectable } from '@nestjs/common';
import { UserFirestoreService } from 'src/firebase/user-firestore/user-firestore.service';
import { UserInfoResponseDTO, UserSignUpRequest } from './DTO/User.dto';
import { genSaltSync, hashSync } from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { sign } from 'jsonwebtoken';

const key = readFileSync(resolve(__dirname, '../assets/private_key.pem'), {
  encoding: 'utf-8',
}).toLocaleString();

@Injectable()
export class UserService {
  constructor(private userFirestoreService: UserFirestoreService) {}

  async signUp(userData: UserSignUpRequest): Promise<UserInfoResponseDTO> {
    // Checking if the user already exists
    const user = await this.userFirestoreService.getUserByEmail(userData.email);

    if (user) {
      throw new ConflictException('user already exists');
    }

    // Hashing password
    const salt = genSaltSync();
    const password = hashSync(userData.password, salt);

    // Creating the user and deleting the password
    const createdUser = await this.userFirestoreService.createUser(
      Object.assign({}, userData, { password, isAuthorized: false }),
    );
    delete createdUser.password;

    // Creating a jwt and returning that to the user instead of the user Object
    return new UserInfoResponseDTO(
      Object.assign(createdUser, {
        key:
          'Bearer ' +
          sign(createdUser, key, { algorithm: 'RS256', expiresIn: '4d' }),
      }),
    );
  }

  async signIn() {}
}
