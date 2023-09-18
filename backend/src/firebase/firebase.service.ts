import { Injectable } from '@nestjs/common';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const authJSON = JSON.parse(
  readFileSync(resolve(__dirname, '../assets/firebase-admin.json'), {
    encoding: 'utf-8',
  }),
);

initializeApp({ credential: cert(authJSON) });

const db = getFirestore();

@Injectable()
export class FirebaseService {
  public getUserCollection() {
    return db.collection('user');
  }

  public getOrderCollection() {
    return db.collection('order');
  }

  public getProductCollection() {
    return db.collection('product');
  }

  public getRatingCollection() {
    return db.collection('rating');
  }

  public getAuthorCollection() {
    return db.collection('author');
  }

  public getSellerApplicationCollection() {
    return db.collection('seller-application');
  }
}
