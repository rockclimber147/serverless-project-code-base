import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// Create DynamoDB client
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        if (!body.id || !body.name) {
            return { statusCode: 400, body: 'Missing id or name' };
        }

        await ddbDocClient.send(new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: body
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item added', item: body }),
        };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
