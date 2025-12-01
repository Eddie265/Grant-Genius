const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "GrantGenius API is running" })
})

// Note: Most API routes are handled by Next.js API routes
// This Express server can be used for additional backend services if needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})



