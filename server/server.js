require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Keep startup log simple and visible.
  console.log(`Server started on port ${PORT}`);
});
