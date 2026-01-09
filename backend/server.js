require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/tests", require("./routes/test.routes"));
app.use("/api/results", require("./routes/result.routes"));
app.use("/api/questions", require("./routes/question.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/certificates", require("./routes/certificate.routes"));
app.use("/api/news", require("./routes/news.routes"));


app.listen(5000, () => console.log("Server running on port 5000"));
