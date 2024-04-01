import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient,PutCommand } from "@aws-sdk/lib-dynamodb";
import axios from "axios";

// Calls text-processing web service and logs sentiment.
async function findSentiment(text: string): Promise<string> {
    //URL of web service
    let url = `http://text-processing.com/api/sentiment/`;

    //Sent GET to endpoint with Axios
    let response = await axios.post(
        url,
        { text: text },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return response.data.label;
}

const partyNames: string[] = ["Labour","Conservative","SNP"];

// Calls guardian Api and retrieves array of articles : 10 at a time
async function fetchNewsApi(name: string): Promise<void> {
    let arrayData = await axios
        .get(
            `https://content.guardianapis.com/search?page=1&q=${name}%20Party%20UK&api-key=5bce4960-e63d-435c-9a1c-5ba2b40a1be1&page-size=2&country=uk`
        )
        .then((data) => {
            return data.data.response.results;
        });

    console.log(arrayData);
}

async function allPartyNews(): Promise<void> {
    for (const party of partyNames) {
        try{
            let response = await fetchNewsApi(party);
            console.log(response);
        } catch(err: any){
            console.log("Error fetching news: " + err.message);
        }
    }
}

const region: string  = "us-east-1";

const client = new DynamoDBClient({ region });
const documentClient = DynamoDBDocumentClient.from(client);


async function putSentiment(): Promise<void>{
  // Define the parameters for putting the item into the DynamoDB table
  const params = {
    TableName: "sentiments",
    Item: {
      party_name: "Labour",
      time_stamp: 1234,
      impression: "Labour calls for ceasefire"
    }
  };

  // Create a new PutItemCommand with the specified parameters
  const command = new PutCommand(params);

  try {

     // Send the PutItemCommand to DynamoDB using the documentClient
     const response = await documentClient.send(command);

     // Logging the response from DynamoDB
     console.log(response);
  } catch (err: any) {
    console.log("Error putting the data: " + err.message);
  }
}

// Call the putSentiment function to execute the operation
// putSentiment();
// let d = '2016-01-01T00:00:00.000Z';
// console.log(new Date(d).valueOf());

findSentiment("Alright").then(data=> {
//   console.log(data);
});
