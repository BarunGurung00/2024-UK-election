//Axios will handle HTTP requests to web service
import axios from "axios";

//The ID of the student whose data you want to plot
let studentID = "M00831005";

//URL where student data is available
let url = "https://y2gtfx0jg3.execute-api.us-east-1.amazonaws.com/prod/";

//Authentication details for Plotly
//ADD YOUR OWN AUTHENTICATION DETAILS
const PLOTLY_USERNAME = "barungurung00";
const PLOTLY_KEY = "spoWitIq89UZ7vchfsuL";

//Initialize Plotly with user details.
import Plotly from "plotly";
let plotly = Plotly(PLOTLY_USERNAME, PLOTLY_KEY);

async function handler(event) {
  try {
    //Get synthetic data
    let yValues = (await axios.get(url + studentID)).data.target;
    const first400Points = await axios.get(url + studentID);

    //Add basic X values for plot
    let xValues = [];
    for (let i = 0; i < yValues.length; ++i) {
      xValues.push(i);
    }

    //Call function to plot data
    let plotResult = await plotData(studentID, xValues, yValues);
    console.log(
      "Plot for student '" + studentID + "' available at: " + plotResult.url
    );

    return {
      statusCode: 200,
      body: "Ok",
    };
  } catch (err) {
    console.log("ERROR: " + JSON.stringify(err));
    return {
      statusCode: 500,
      body: "Error plotting data for student ID: " + studentID,
    };
  }
}

let xVal = []; // This array will hold x values for the data retrieved from sagemaker

for (let i = 501; i <= 550; i++) {
  xVal.push(i);
}

//Plots the specified data
async function plotData(studentID, xValues, yValues) {
  //Data structure
  let studentData = {
    x: xValues,
    y: yValues,
    type: "scatter",
    mode: "line",
    name: "Unique Student Data",
    marker: {
      color: "red",
      size: 12,
    },
  };

  let quantiles1Data = {
    x: xVal,
    y: [
      586.9921875, 605.0505371094, 607.4156494141, 621.8214111328,
      629.383605957, 657.5159301758, 642.7171020508, 651.1624145508,
      636.2315673828, 648.9555053711, 659.2814941406, 651.9343261719,
      603.9457397461, 680.0372314453, 654.4815063477, 609.3742675781,
      619.7244262695, 623.6058349609, 631.1349487305, 668.9906616211,
      642.3112182617, 652.0218505859, 648.5101318359, 654.2622070312,
      625.2391357422, 627.4919433594, 633.3811645508, 659.5479736328,
      649.0950927734, 689.1431274414, 682.2025756836, 689.3660888672,
      662.4328613281, 702.7009887695, 693.8082275391, 690.1860961914,
      686.4149169922, 686.3964233398, 665.9038696289, 672.8687744141,
      650.1149291992, 629.161315918, 616.5621337891, 615.1408691406,
      635.5704345703, 655.8397827148, 648.8003540039, 658.9022827148,
      693.1343383789, 649.9201049805,
    ],
    type: "scatter",
    mode: "line",
    name: "Prediction 0.1 Quantile",
    marker: {
      color: "#006400",
      size: 12,
    },
  };

  let quantiles9Data = {
    x: xVal,
    y: [
      644.3940429688, 656.3952026367, 667.8441162109, 689.868347168,
      659.3046264648, 671.4272460938, 685.129699707, 696.5552978516,
      682.6131591797, 749.2383422852, 715.4442138672, 704.4155273438,
      719.1770629883, 709.2028808594, 722.9348144531, 688.8966674805,
      662.1790771484, 655.4390258789, 661.737487793, 690.2493286133,
      752.0928344727, 668.5958862305, 695.1466064453, 688.9291381836,
      717.7549438477, 708.5914916992, 726.8779296875, 723.1862182617,
      726.3564453125, 751.2147216797, 757.7718505859, 785.6333007812,
      724.6397094727, 725.8162841797, 728.826171875, 729.9617919922,
      746.8110351562, 765.5717773438, 726.1347045898, 706.9829101562,
      717.7357177734, 660.2147827148, 651.8838500977, 672.9229125977,
      719.7046508789, 693.1916503906, 688.8052368164, 698.9602661133,
      701.7220458984, 694.4017944336,
    ],
    type: "scatter",
    mode: "line",
    name: "Prediction 0.9 Quantile",
    marker: {
      color: "#90EE90",
      size: 12,
    },
  };

  let meanData = {
    x: xVal,
    y: [
      636.0961914062, 628.9898071289, 638.3582763672, 633.1806030273,
      644.0559082031, 643.291809082, 663.7390136719, 673.520324707,
      672.3284912109, 679.3530883789, 670.0657958984, 700.3668823242,
      709.4694213867, 693.2072143555, 678.0810546875, 673.2873535156,
      673.5760498047, 652.7637939453, 638.3823242188, 674.3607177734,
      661.3336181641, 676.9404907227, 665.5256347656, 670.1287841797,
      652.1526489258, 686.4478759766, 677.6543579102, 671.8839111328,
      677.3944091797, 683.7984619141, 676.4261474609, 699.5952148438,
      702.2355957031, 712.8278808594, 713.5302124023, 714.145690918,
      717.9279174805, 707.1254882812, 696.3895263672, 695.7114257812,
      688.3198242188, 660.1480712891, 650.5213012695, 649.481628418,
      664.4214477539, 686.4252929688, 665.9149169922, 688.233215332,
      705.9979248047, 712.2368164062,
    ],
    type: "scatter",
    mode: "line",
    name: "Mean",
    marker: {
      color: "#B2AC88",
      size: 12,
    },
  };

  //Pridiction data
  // Create a new object and add it in the array along side data

  //Mean data
  //Quantile data
  let data = [studentData, quantiles1Data, quantiles9Data, meanData];

  //Layout of graph
  let layout = {
    title: "Machine Learning Result of M00831005",
    font: {
      size: 10,
    },
    xaxis: {
      title: "Time (hours)",
    },
    yaxis: {
      title: "Value",
    },
  };
  let graphOptions = {
    layout: layout,
    filename: "date-axes",
    fileopt: "overwrite",
  };

  //Wrap Plotly callback in a promise
  return new Promise((resolve, reject) => {
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) reject(err);
      else {
        resolve(msg);
      }
    });
  });
}

handler();
