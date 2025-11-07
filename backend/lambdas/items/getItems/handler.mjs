import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => { // <-- add event
    try {
        const data = await ddbDocClient.send(new ScanCommand({
            TableName: process.env.TABLE_NAME
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ items: data.Items || [] }),
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
