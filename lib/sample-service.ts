import * as core from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as ddb from "@aws-cdk/aws-dynamodb";
import { AttributeType } from "@aws-cdk/aws-dynamodb";

export class SampleService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const ddbTable = new ddb.Table(this, "UserTable", {
      tableName: "users",
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    const createUserLambda = new lambda.Function(this, "CreateUserHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "create-user.handler",
      environment: {
        TABLE_NAME: ddbTable.tableName,
      },
    });

    const getUserLambda = new lambda.Function(this, "GetUserHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "get-user.handler",
      environment: {
        TABLE_NAME: ddbTable.tableName,
      },
    });

    //give permission to lambda functions
    ddbTable.grantWriteData(createUserLambda);
    ddbTable.grantReadData(getUserLambda);

    const api = new apigateway.RestApi(this, "user-api", {
      restApiName: "User Service",
    });
    const resourceRoot = "users";
    const getResourceRoot = "{id}";
    api.root.addResource(resourceRoot);
    const getUserResource = api.root
      .getResource(resourceRoot)
      ?.addResource(getResourceRoot);

    const createUserIntegration = new apigateway.LambdaIntegration(
      createUserLambda
    );
    const getUserIntegration = new apigateway.LambdaIntegration(getUserLambda);

    api.root
      .getResource(resourceRoot)
      ?.addMethod("POST", createUserIntegration);
    getUserResource?.addMethod("GET", getUserIntegration);
  }
}
