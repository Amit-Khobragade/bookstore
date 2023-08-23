import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { UserFirestoreService } from './user-firestore/user-firestore.service';
import { OrderFirestoreService } from './order-firestore/order-firestore.service';
import { BookFirestoreService } from './book-firestore/book-firestore.service';
import { RatingsFirestoreService } from './ratings-firestore/ratings-firestore.service';
import { AuthorFirestoreService } from './author-firestore/author-firestore.service';

@Module({
  providers: [FirebaseService, UserFirestoreService, OrderFirestoreService, BookFirestoreService, RatingsFirestoreService, AuthorFirestoreService],
  exports: [UserFirestoreService],
})
export class FirebaseModule {}
