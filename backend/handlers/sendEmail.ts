import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { createDynamoDBClient } from "../utils/dynamoDBClient";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { buildEmailContent } from "../utils/sender";

const API_KEY = process.env.API_MAILER_SEND_KEY || "";
const UserDataTableName = process.env.USERS_TABLE;
const searchHistoryTableName = process.env.SEARCH_HISTORY_TABLE;
const adminEmail = process.env.ADMIN_EMAIL;

const database = createDynamoDBClient();

export const sendEmailHandler = async () => {
  try {
    const userParams = {
      TableName: UserDataTableName,
      Key: { email: adminEmail },
    };

    const userTo = await database.send(new GetCommand(userParams));

    if (!userTo.Item) {
      console.log("Admin user does not exist");
      return { message: "Admin user does not exist" };
    }

    const sentFrom = new Sender("dcastillo5@trial-x2p0347nm13lzdrn.mlsender.net", "Daniela  Castillo");
    const recipients = [new Recipient(userTo.Item.email)];

    const today = new Date().toISOString().split("T")[0];
    const searchHistoryParams = {
      TableName: searchHistoryTableName,
      Key: { "email#date": `${userTo.Item.email}#${today}` },
    };

    const searchHistory = await database.send(new GetCommand(searchHistoryParams));

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Busqueda de propiedades")
      .setHtml(buildEmailContent(searchHistory.Item?.searchHistory));

    const mailerSend = new MailerSend({
      apiKey: API_KEY,
    });

    await mailerSend.email.send(emailParams);
    console.log(`Send email to admin ${adminEmail} - ${today}`);
    return { message: `Send email to admin ${adminEmail} - ${today}` };
  } catch (error) {
    console.log(`Error in sendEmailHandler: ${error}`);
    return { message: `Error in sendEmailHandler: ${error}` };
  }
};
