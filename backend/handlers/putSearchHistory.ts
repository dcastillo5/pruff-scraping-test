import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBClient } from "../utils/dynamoDBClient";
import { APIGatewayProxyEvent } from "aws-lambda";

const searchHistoryTableName = process.env.SEARCH_HISTORY_TABLE;
const UserDataTableName = process.env.USERS_TABLE;
export const putSearchHistoryHandler = async (event: APIGatewayProxyEvent) => {
  const database = createDynamoDBClient();

  const body = JSON.parse(event.body || "{}");
  const { email, propertyType, neighborhood, transactionType } = body;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "email is required" }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }
  if (!propertyType && !neighborhood && !transactionType) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "empty search" }),
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

  const today = new Date().toISOString().split("T")[0];

  const searchHistoryParams = {
    TableName: searchHistoryTableName,
    Key: { "email#date": `${email}#${today}` },
  };
  const userSearchHistory = await database.send(new GetCommand(searchHistoryParams));

  if (userSearchHistory.Item) {
    const newSearchHistory = {
      TableName: searchHistoryTableName,
      Item: {
        "email#date": `${email}#${today}`,
        searchHistory: [
          ...userSearchHistory.Item.searchHistory,
          {
            propertyType: propertyType ?? "",
            neighboorhood: neighborhood ?? "",
            transactionType: transactionType ?? "",
          },
        ],
      },
    };
    await database.send(new PutCommand(newSearchHistory));
  } else {
    const newSearchHistory = {
      TableName: searchHistoryTableName,
      Item: {
        "email#date": `${email}#${today}`,
        searchHistory: [
          {
            propertyType: propertyType ?? "",
            neighboorhood: neighborhood ?? "",
            transactionType: transactionType ?? "",
          },
        ],
      },
    };
    await database.send(new PutCommand(newSearchHistory));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "success" }),
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
  };
};
