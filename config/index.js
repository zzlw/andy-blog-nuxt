const Config = {
  baseUrl: process.env.NODE_ENV === 'production' ? 'https://api.fxq.design' : 'http://localhost:3000',
  staticPath: 'https://cdn.fxq.design'
}
export default Config
