import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBClient } from "../utils/dynamoDBClient";
import { APIGatewayProxyEvent } from "aws-lambda";

const UserDataTableName = process.env.USERS_TABLE;
export const putFavoritePropertyHandler = async (event: APIGatewayProxyEvent) => {
  const database = createDynamoDBClient();

  const body = JSON.parse(event.body || "{}");
  const { favoriteProperty, email } = body;
  if (!email || !favoriteProperty) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "email and favoriteProperty are required" }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }

  const userParams = {
    TableName: UserDataTableName,
    Key: { email },
  };
  const user = await database.send(new GetCommand(userParams));
  if (!user.Item) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "user not found" }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }

  const isFavorite = user.Item.favoriteProperties.includes(favoriteProperty);

  const favoriteProperties = isFavorite
    ? user.Item.favoriteProperties.filter((property: string) => property !== favoriteProperty)
    : [...user.Item.favoriteProperties, favoriteProperty];

  const putFavoritePropertyParams = {
    TableName: UserDataTableName,
    Item: {
      ...user.Item,
      favoriteProperties,
    },
  };
  await database.send(new PutCommand(putFavoritePropertyParams));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: isFavorite ? "Property removed from favorites" : "Property added to favorites" }),
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
  };
};
