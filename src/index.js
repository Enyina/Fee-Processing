const app = require("./app");
const { port } = require("./config");
// const logger = require(".config/winston");
console.log(port);

app.listen(port, () => console.log(`server up on port ${port}`));
