import "dotenv/config";

import app from "./app";

app.listen(process.env.PORT, () => {
  console.log(`Server running on path http://localhost:${process.env.PORT}`);
});
