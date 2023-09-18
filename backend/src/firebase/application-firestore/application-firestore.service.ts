import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';

/* Structure of doc stored in 'seller application'
 * doc_reference_id: uid
 * {
 *    isApproved: boolean    // checks if the application is approved
 *    reviewStatus: ApplicationStatus   // the applucation status
 *    reviewerID: string  // initially null and assigned to user id of the reviewer, if the application status is set to pending
 * }
 */

enum ApplicationStatus {
  NOT_REVIEWED = 'NOT_REVIEWED',
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
}

class SellerApplications {
  constructor(
    public uid: string, // Foreign key from user id also the primary key
    public isApproved: boolean, // approve an application initially set to false
    public reviewStatus: ApplicationStatus, // is the application viewed by an admin 0 - not reviewed, 1 - under review, 2 - reviewed,
    public dateOfApplication: Date, // the date on which the application was created
    public reviewerID?: string, // Foreign key from user id
  ) {}
}

@Injectable()
export class ApplicationFirestoreService {
  constructor(private firebaseService: FirebaseService) {}

  /**
   * private function which updates the application based on payload
   */
  private async updateApplication(
    uid: string,
    payload,
  ): Promise<FirebaseFirestore.WriteResult> {
    const doc = this.firebaseService.getSellerApplicationCollection().doc(uid);

    return doc.update(payload);
  }

  /**
   * gets the application by uid
   */
  async getApplicationByID(
    uid: string,
  ): Promise<SellerApplications | undefined> {
    const doc = await this.firebaseService
      .getSellerApplicationCollection()
      .doc(uid)
      .get();

    const isApproved = doc.data().isApproved;
    const reviewStatus = doc.data().reviewStatus;
    const reviewerID = doc.data().reviewerID;
    const DOA = doc.updateTime.toDate();

    if (doc.exists) {
      return new SellerApplications(
        uid,
        isApproved,
        reviewStatus,
        DOA,
        reviewerID,
      );
    }
  }

  /**
   * creates an application for the uid
   * Initial state of isApproved flag is false
   * and of reviewStatus
   */
  async createApplication(uid: string): Promise<SellerApplications> {
    const { writeTime } = await this.firebaseService
      .getSellerApplicationCollection()
      .doc(uid)
      .set({ isApproved: false, reviewStatus: ApplicationStatus.NOT_REVIEWED });

    return new SellerApplications(
      uid,
      false,
      ApplicationStatus.NOT_REVIEWED,
      writeTime.toDate(),
    );
  }

  /**
   * sets the values of isApproved and isReviewed flags to true
   */
  async acceptApplication(uid: string): Promise<SellerApplications> {
    const { writeTime } = await this.updateApplication(uid, {
      isApproved: true,
      reviewStatus: ApplicationStatus.REVIEWED,
    });

    return new SellerApplications(
      uid,
      true,
      ApplicationStatus.REVIEWED,
      writeTime.toDate(),
    );
  }

  /**
   * sets the values of isApproved and isReviewed flags to false and true respectively
   */
  async declineApplication(uid: string): Promise<SellerApplications> {
    const { writeTime } = await this.updateApplication(uid, {
      isApproved: false,
      reviewStatus: ApplicationStatus.REVIEWED,
    });

    return new SellerApplications(
      uid,
      true,
      ApplicationStatus.REVIEWED,
      writeTime.toDate(),
    );
  }

  /**
   * Changes the application status to pending
   */
  async retainApplication(
    uid: string,
    reviewerID: string,
  ): Promise<SellerApplications> {
    const { writeTime } = await this.updateApplication(uid, {
      reviewStatus: ApplicationStatus.PENDING,
      reviewerID,
    });

    return new SellerApplications(
      uid,
      true,
      ApplicationStatus.REVIEWED,
      writeTime.toDate(),
    );
  }
}
