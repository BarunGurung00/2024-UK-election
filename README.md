# UK Election Prediction

General Election history visualization tool, which is a single page web application hosted entirely on cloud.
Built using Amazon Web Services such as SageMaker, Lambda, DynamoDB in addition to TypeScript & plotly.js

Hosted on AWS S3 bucket and is available: https://cst3130-00831005.s3.amazonaws.com/main.html

Project front-end screen shots

![landingPage](https://github.com/BarunGurung00/2024-UK-election/assets/119054109/675795b5-1f00-4454-84e8-d9854729fda1)
![pred](https://github.com/BarunGurung00/2024-UK-election/assets/119054109/ea98ac1f-3780-4fd2-bc98-58e231223587)
![pieChart](https://github.com/BarunGurung00/2024-UK-election/assets/119054109/3cb6a2cd-8b51-4a52-b9b0-490a73108db3)

- TypeScript compilation - tsc file.ts (Automatically converts to JavaScript)
  File gets compiled to a javascript file then can be runned with node file.js or directly from the IDE

- Using watch: --watch to avoid compiling typeScript everytime you make changes
  tsc file.ts --watch (This will automatically update the js file with changes)
