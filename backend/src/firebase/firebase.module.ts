import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { UserFirestoreService } from './user-firestore/user-firestore.service';
import { OrderFirestoreService } from './order-firestore/order-firestore.service';
import { RatingsFirestoreService } from './ratings-firestore/ratings-firestore.service';
import { AuthorFirestoreService } from './author-firestore/author-firestore.service';
import { ApplicationFirestoreService } from './application-firestore/application-firestore.service';
import { ProductFirestoreService } from './product-firestore/product-firestore.service';

@Module({
  providers: [
    FirebaseService,
    UserFirestoreService,
    OrderFirestoreService,
    RatingsFirestoreService,
    AuthorFirestoreService,
    ApplicationFirestoreService,
    ProductFirestoreService,
  ],
  exports: [
    UserFirestoreService,
    OrderFirestoreService,
    RatingsFirestoreService,
    AuthorFirestoreService,
  ],
})
export class FirebaseModule {}
