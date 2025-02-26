import { APIGatewayProxyEvent } from "aws-lambda";
import { scrapePropertiesFromWebsite } from "../utils/scraper";
import { verifyToken } from "../utils/auth";

const URL: string = "https://lacasadejuana.cl/propiedades/";

export type property = {
  place: string;
  href: string;
  img: string;
  title: string;
  priceUF: string;
  priceCL: string;
  sold: boolean;
  details: string;
};

const buildURL = (neighborhood: string, transactionType: string, propertyType: string) => {
  let url = URL;
  if (transactionType) {
    url += `modality/${transactionType}/`;
  }
  if (propertyType) {
    url += `type/${propertyType}/`;
  }
  if (neighborhood) {
    url += `place/${neighborhood}/`;
  }
  return url;
};

export const getPropertiesHandler = async (event: APIGatewayProxyEvent) => {
  
  try {
/*     const token = event.headers?.Authorization;
    if (!token || !verifyToken(token)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Unauthorized" }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      };
    } */

    const take: number = parseInt(event.queryStringParameters?.take ?? "10");
    const skip: number = parseInt(event.queryStringParameters?.skip ?? "0");

    const neighborhood: string = event.queryStringParameters?.neighborhood ?? "";
    const transactionType: string = event.queryStringParameters?.transactionType ?? "";
    const propertyType: string = event.queryStringParameters?.propertyType ?? "";

    const website = buildURL(neighborhood, transactionType, propertyType);

    const { properties, hasMoreProperties } = await scrapePropertiesFromWebsite(website, take, skip);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "success", body: { properties, hasMoreProperties } }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*", //DO NOT USE THIS VALUE IN PRODUCTION - https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (error) {
    console.error("Error in getPropertiesHandler", error);
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
