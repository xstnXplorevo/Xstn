import "dotenv/config";
import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

try {
  app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
  });
} catch (error) {
  console.error("Problem starting server", error);
  process.exit(1);
}
