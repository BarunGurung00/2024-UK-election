//Import library and scan command
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, DeleteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

//Create client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

//Returns all of the connection IDs
export async function getConnectionIds() {
    const scanCommand = new ScanCommand({
        TableName: "WebSocketClients"
    });
    
    const response  = await docClient.send(scanCommand);
    return response.Items;
};


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
};

export async function getData(){
    
    const data = await electionData();
    
    //Creating the data structure
    const electionDatas = {actual: {
        LAB: { times: [], value:[]},
        CON: { times: [], value:[]},
        SNP: { times: [], value:[]}   
        }
    }
        
        
    // For labour party
    electionDatas.actual.LAB.times = data
        .filter(item => item.partyName === "LAB")
        .map(item => item.year);
    
    electionDatas.actual.LAB.value = data
        .filter(item => item.partyName === "LAB")
        .map(item => item.totalVotes);
    
    // For conservative party
    electionDatas.actual.CON.times = data
        .filter(item => item.partyName === "CON")
        .map(item => item.year);
    
    electionDatas.actual.CON.value = data
        .filter(item => item.partyName === "CON")
        .map(item => item.totalVotes);
    
    // For SNP party
    electionDatas.actual.SNP.times = data
        .filter(item => item.partyName === "PC/SNP")
        .map(item => item.year);
    
    electionDatas.actual.SNP.value = data
        .filter(item => item.partyName === "PC/SNP")
        .map(item => item.totalVotes);
    
    
    console.log(JSON.stringify(electionDatas));
    return electionDatas;
}


async function electionData(){
    
    //Create command to scan entire table
    const command = new ScanCommand({
        TableName: "Election",
    
    });
    
    try {
        const response = await docClient.send(command);
        console.log(response.Items);
        return response.Items;
    } catch (err) {
        console.error("ERROR scanning table: " + JSON.stringify(err));
    }
}