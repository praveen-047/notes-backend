const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});