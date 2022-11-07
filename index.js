const app = require("./src/appp");
const { port } = require("./src/configg");
const logger = require("./src/config/winstonn");
console.log(port);

app.listen(port, () => logger.info(`server up on port ${port}`));
