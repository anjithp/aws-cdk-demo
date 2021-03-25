import * as cdk from "@aws-cdk/core";
import { SampleService } from "../lib/sample-service";

export class CdkdemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    new SampleService(this, "SampleService");
  }
}
