const Config = {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.shirmy.me' : 'http://localhost:3000',
  staticPath: 'resource.shirmy.me'
}

export default Config
