import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const DB_ENDPOINT_OVERRIDE = process.env.DB_ENDPOINT_OVERRIDE;

export const createDynamoDBClient = () => {
  let client: DynamoDBClient;
  if (DB_ENDPOINT_OVERRIDE) {
    client = new DynamoDBClient({ endpoint: DB_ENDPOINT_OVERRIDE });
  } else {
    client = new DynamoDBClient();
  }
  return DynamoDBDocumentClient.from(client);
};
