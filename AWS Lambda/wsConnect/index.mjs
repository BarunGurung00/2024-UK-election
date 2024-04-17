// Import necessary modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Create a new DynamoDB client instance
const ddbClient = new DynamoDBClient();

// Handler function for WebSocket connection
export const handler = async (event) => {
    try {
        // Get connection ID from event
        const connId = event.requestContext.connectionId;
        console.log("Client connected with ID: " + connId);

        const domain = event.requestContext.domainName;
        const stage = event.requestContext.stage;

        // Store connection ID in DynamoDB
         await storeConnectionId(connId);

        // Return success response
        return {
            statusCode: 200,
            body: "Client connected with ID: " + connId
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: "Server Error: " + JSON.stringify(error)
        };
    }
};

// Function to store connection ID in DynamoDB
async function storeConnectionId(connId) {
    try {
        // Parameters for storing connection ID in DynamoDB
        const params = {
            TableName: "WebSocketClients",
            Item: {
                ConnectionId: connId
            }
        };
        // Store connection ID in DynamoDB
        await ddbClient.send(new PutCommand(params));
        console.log("Connection ID stored.");
    } catch (error) {
        console.error("Error storing connection ID:", error);
        throw error;
    }
}


