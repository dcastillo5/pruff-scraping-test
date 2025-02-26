import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createDynamoDBClient } from "../utils/dynamoDBClient";

const JWT_KEY = process.env.JWT_KEY || "";
const tableName = process.env.USERS_TABLE;

const database = createDynamoDBClient();

export const signupHandler = async (event: APIGatewayProxyEvent) => {
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

    const existingUser = await database.send(new GetCommand(params));

    if (existingUser.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "User already exists" }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    }

    const newUser = {
      TableName: tableName,
      Item: {
        email,
        password: await bcrypt.hash(password, 8),
        favoriteProperties: [],
      },
    };

    await database.send(new PutCommand(newUser));
    const token = jwt.sign({ email }, JWT_KEY);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "success", body: { email, token } }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error in signupHandler", error);
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
