import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import axios from 'axios';

export const handler = async (event) => {

    try {
        const client = new DynamoDBClient();
        const documentClient = new DynamoDBDocumentClient(client); 

        if (!event || !event.Records || event.Records.length === 0) {
            console.error("No records found in the event.");
            return;
        }

        for (const record of event.Records) {
            const dynamoDBData = record.dynamodb.NewImage; // Accessing the NewImage attribute
            
            // Data validation
            if (!dynamoDBData || !dynamoDBData.time_stamp || !dynamoDBData.party_name) {
                console.error("Invalid data in DynamoDB record");
                return;
            }

            const sentiment = await findSentiment(dynamoDBData.impression.S);
            
            // Assign the time_stamp attribute directly as a number
            const params = {
                TableName: "sentiment_analysis",
                Item: {
                    name: dynamoDBData.party_name.S,
                    time_stamp: Number(dynamoDBData.time_stamp.N), // Convert the value to a number
                    analysis_result: sentiment
                }
            };

            const command = new PutCommand(params);

            try {
                const response = await documentClient.send(command);
                console.log("Successfully wrote to DynamoDB:", response);
            } catch (error) {
                console.error("Error writing to DynamoDB:", error.message);
            }
        }
    } catch (error) {
        console.error("Error processing event:", error.message);
    }
};

async function findSentiment(txt) {
    // URL of the web service
    let url = `http://text-processing.com/api/sentiment/`;

    try {
        const response = await axios.post(url, {
            text: txt},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });
        return response.data.label;
    } catch (error) {
        console.error("Error while fetching sentiment:", error.message);
        throw error;
    }
}
