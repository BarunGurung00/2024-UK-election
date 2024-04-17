//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { sendSentimentToClient } from './webSocket.mjs';

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    
    try {
        const connId = event.requestContext.connectionId;
        console.log("Request from: " + connId);
        
        // Get Message from event
        const data = await getData();
        console.log(data);
    
        
        console.log("Message: " + data);

        //Extract domain and stage from event
        const domain = "36121otpv1.execute-api.us-east-1.amazonaws.com";
        const stage = "production";
        console.log("Domain: " + domain + " stage: " + stage);

        //Get promises to send messages to connected clients
        let sendMsgPromises = await sendSentimentToClient(connId, data, domain, stage);

        //Execute promises
        await Promise.all(sendMsgPromises);
        
        
    }
    catch(err){
        return { statusCode: 500, body: "Error: " + err.message };
    }

    //Success
    return { statusCode: 200, body: "Data sent successfully." };
};

export async function getData(){
  //Create command to scan entire table
    const command = new ScanCommand({
        TableName: "sentiment_analysis",
    });
    
    try {
        //array of object from the data base
        const response = await docClient.send(command);
        console.log(response.Items);
        
         let data = {
                SNP: {
                    pos:0 , neg:0 , neutral:0
                },
                Conservative: {
                    pos:0 , neg:0 , neutral:0
                },
                Labour:{
                    pos:0 , neg:0 , neutral:0
                }
         };
         
         response.Items.forEach(item => {
            const party = item.name;
            const result = item.analysis_result;
    
            // increasing the corresponding counter in the `arr` object as per the data
            if (party === 'SNP' || party === 'Conservative' || party === 'Labour') {
                data[party][result] = data[party][result] + 1;
            }
         });
         
         return data;
        
    } catch (err) {
        console.error("ERROR scanning table: " + JSON.stringify(err));
    }
}

//Deletes the specified connection ID
export async function deleteConnectionId(connectionId){
    console.log("Deleting connection Id: " + connectionId);

    const deleteCommand = new DeleteCommand ({
        TableName: "WebSocketClients",
        Key: {
            ConnectionId: connectionId
        }
    });
    return docClient.send(deleteCommand);
}