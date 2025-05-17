const express = require('express')
const app = express()
const port = 3000

// Parse incoming JSON bodies
app.use(express.json())

// Base URL for the remote microservice
const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Home endpoint used for health checking
app.get('/', (req, res) => {
  res.json({
    status: 'Ok',
    message: 'Hello World!'
  })
})

// List all users
app.get('/users', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/users`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Retrieve a specific user
app.get('/users/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    })
    const data = await response.json()
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Delete a user
app.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE'
    })
    // jsonplaceholder returns an empty object on delete
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
