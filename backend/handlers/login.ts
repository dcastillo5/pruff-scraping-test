import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createDynamoDBClient } from "../utils/dynamoDBClient";

const JWT_KEY = process.env.JWT_KEY || "";
const tableName = process.env.USERS_TABLE;

const database = createDynamoDBClient();

export const loginHandler = async (event: APIGatewayProxyEvent) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "email and password are required" }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    }

    const params = {
      TableName: tableName,
      Key: { email: email },
    };

    const user = await database.send(new GetCommand(params));

    if (!user.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "User does not exist" }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.Item.password);

    if (!isPasswordCorrect) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid password" }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    }

    const token = jwt.sign({ email }, JWT_KEY);

    const userData = {
      email: user.Item.email,
      favoriteProperties: user.Item.favoriteProperties,
      token,
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "success", body: userData }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error in loginHandler", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  }
};
