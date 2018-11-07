const spauth = require('node-sp-auth')
const dotEnv = require('dotenv')
const axios = require('axios')
dotEnv.config() // Allows use of .env file for setting env variables, if preferred.

module.exports = async function () {
  console.log('SharePoint Authentication')
  console.log('-------------------------')

  // Grab URL from env variables
  const url = process.env.SHAREPOINT_URL
  console.log(`SharePoint URL: ${url}`)

  // Grab credentials from env variables
  const credentials = {
    username: process.env.SHAREPOINT_USERNAME,
    password: process.env.SHAREPOINT_PASSWORD
  }
  console.log(`Username: ${credentials.username}`)
  
  try {
    const { headers } = await getAuth(url, credentials)

    console.log(`Got cookie? ${headers.hasOwnProperty('Cookie')}`)
    console.log(`Auth type: ${headers.Cookie.split('=')[0]}`)
    
    headers['Accept'] = 'application/json;odata=verbose'

    // Call the web endpoint
    const { data } = await getWebEndpoint(`${url}/_api/web`, { headers, responseType: 'json' })

    const site = data.d
    
    console.log('')
    console.log('Site details')
    console.log('------------')
    console.log(`ID: ${site.Id}`)
    console.log(`Title: ${site.Title}`)
    console.log(`Description: ${site.Description}`)
    console.log(`Created: ${site.Created}`)
    console.log(`Modified: ${site.LastItemUserModifiedDate}`)
    console.log('')
  } catch (e) {
    console.error(e)
  }
}

const getAuth = (url, credentials) => {
  return new Promise((resolve, reject) => {
    spauth
    .getAuth(url, credentials)
    .then(response => resolve(response))
    .catch(err => reject(err))
  })
}

const getWebEndpoint = (url, config) => {
  return new Promise ((resolve, reject) => {
    axios
    .get(url, config)
    .then(response => resolve(response))
    .catch(err => reject(err))
  })
}