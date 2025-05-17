const express = require('express')
const app = express()
const port = 3000

function degreesToRadians (degrees) {
  return degrees * (Math.PI / 180)
}

function calculateDistanceMeters (lat1, lon1, lat2, lon2) {
  const R = 6371000 // metres
  const dLat = degreesToRadians(lat2 - lat1)
  const dLon = degreesToRadians(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Parse incoming JSON bodies
app.use(express.json())

// Validate payload for POST /users
function validateUser (req, res, next) {
  const user = req.body
  if (typeof user !== 'object' || user === null) {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  const { id, name, username, email, address, phone, website, company } = user

  if (typeof id !== 'number' ||
      typeof name !== 'string' ||
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof phone !== 'string' ||
      typeof website !== 'string' ||
      typeof address !== 'object' || address === null ||
      typeof company !== 'object' || company === null) {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  const { street, suite, city, zipcode, geo } = address
  if (typeof street !== 'string' ||
      typeof suite !== 'string' ||
      typeof city !== 'string' ||
      typeof zipcode !== 'string' ||
      typeof geo !== 'object' || geo === null) {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  const { lat, lng } = geo
  if (typeof lat !== 'string' || typeof lng !== 'string') {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  const { name: companyName, catchPhrase, bs } = company
  if (typeof companyName !== 'string' ||
      typeof catchPhrase !== 'string' ||
      typeof bs !== 'string') {
    return res.status(400).json({ error: 'Invalid user data' })
  }

  next()
}

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

    // If the upstream service returns 404, forward the status with no body
    if (response.status === 404) {
      return res.status(404).end()
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Create a new user
app.post('/users', validateUser, async (req, res) => {
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

// Calculate distance between provided coordinates and the user's location
app.post('/users/distance', async (req, res) => {
  const { userId, lat, lng } = req.body
  if (typeof userId !== 'number' || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Invalid data' })
  }

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`)

    if (response.status === 404) {
      return res.status(404).end()
    }

    const user = await response.json()
    const userLat = parseFloat(user.address?.geo?.lat)
    const userLng = parseFloat(user.address?.geo?.lng)

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(500).json({ error: 'Invalid user geolocation data' })
    }

    const distanceMeters = calculateDistanceMeters(userLat, userLng, lat, lng)
    res.json({ ...user, distanceMeters })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

module.exports = app
