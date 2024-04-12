fetch("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv")
   .then(res => {
    return res.text();})
    .then(data => {
        console.table(data);
        });

