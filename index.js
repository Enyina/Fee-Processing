const app = require("./src/app");
const { port } = require("./src/config");
// const logger = require(".config/winston");
console.log(port);

app.listen(port, () => console.log(`server up on port ${port}`));
