//Import API Gateway
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";
import { deleteConnectionId } from './index.mjs';

export async function sendSentimentToClient(connId, data, domain, stage){

    //Create API Gateway management class.
    const callbackUrl = `https://${domain}/${stage}`;
    const apiGwClient = new ApiGatewayManagementApiClient({ endpoint: callbackUrl });
    
     try{
            console.log("Sending message '" + data + "' to: " + connId);

            //Create post to connection command
            const postToConnectionCommand = new PostToConnectionCommand({
                ConnectionId: connId,
                Data: JSON.stringify(data)
            });

            //Wait for API Gateway to execute and log result
            await apiGwClient.send(postToConnectionCommand);
            console.log("Message '" + data + "' sent to: " + connId);
        }
        catch(err){
            console.log("Failed to send message to: " + connId);

            //Delete connection ID from database
            if(err.statusCode == 410) {
                try {
                    await deleteConnectionId(connId);
                }
                catch (err) {
                    console.log("ERROR deleting connectionId: " + JSON.stringify(err));
                    throw err;
                }
            }
            else{
                console.log("UNKNOWN ERROR: " + JSON.stringify(err));
                throw err;
            }
        }
}

