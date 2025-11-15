// import * as cdk from "aws-cdk-lib";
// import { Construct } from "constructs";
// import * as s3 from "aws-cdk-lib/aws-s3";

// export class ListingPhotosBucketConstruct extends Construct {
//   public readonly bucket: s3.Bucket;

//   constructor(scope: Construct, id: string) {
//     super(scope, id);

//     this.bucket = new s3.Bucket(this, "ListingPhotosBucket", {
//       bucketName: `listing-photos-${cdk.Stack.of(this).account}-${cdk.Stack.of(this).region}`,
//       removalPolicy: cdk.RemovalPolicy.RETAIN,
//       publicReadAccess: true,
//       blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS_ONLY,
//       cors: [
//         {
//           allowedOrigins: ["*"],
//           allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
//           allowedHeaders: ["*"],
//           exposedHeaders: ["ETag"],
//         },
//       ],
//     });
//   }
// }

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export class ListingPhotosBucketConstruct extends Construct {
  public readonly bucket: s3.IBucket; // Note: use IBucket when importing

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Adopt existing bucket
    this.bucket = s3.Bucket.fromBucketName(
      this,
      "ListingPhotosBucket",
      "listing-photos-552256739229-us-west-2" // the existing bucket name
    );
  }
}
