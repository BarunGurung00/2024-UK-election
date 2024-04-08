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
async function fetchNewsApi(name: string): Promise<any> {
    let arrayData = await axios
        .get(
            `https://content.guardianapis.com/search?page=1&q=${name}%20Party%20UK&api-key=5bce4960-e63d-435c-9a1c-5ba2b40a1be1&page-size=10&country=uk`
        )
        .then((data) => {
            return data.data.response.results;
        });
     

   const region: string ="us-east-1";

   const client = new DynamoDBClient({ region });
   const documentClient = DynamoDBDocumentClient.from(client);
   
   
       for (const data of arrayData) {

           let d =  data.webPublicationDate;

           const command = new PutCommand({
               TableName: "sentiment_demo",
               Item: {
                   "partyName": "Conservative",
                   "time_stamp": (new Date(d).valueOf()),
                   "text": data.webTitle
               }
           });
   
           try {
               const response = await documentClient.send(command);
               console.log(response);
           } catch (err:any) {
               console.error("ERROR uploading data Info: " + err.message);
           }
       }
   }

   fetchNewsApi("Conservative");



// async function partyNews(): Promise<void> {
//     for (const party of partyNames) {
//         try{
//             let response = await fetchNewsApi(party);
//             console.log(response);
//         } catch(err: any){
//             console.log("Error fetching news: " + err.message);
//         }
//     }    
// }


// Call the putSentiment function to execute the operation
// putSentiment();
// let d = '2016-01-01T00:00:00.000Z';
// console.log(new Date(d).valueOf());

// findSentiment("Alright").then(data=> {
//   console.log(data);
// });
