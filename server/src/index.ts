/* istanbul ignore file */
import { Env, EEnvKey } from './global'
import { app } from './app'
import { RouteLoader } from './app-loader/route-loader'

async function start() {
  await RouteLoader.load(app)
  app.listen(Env.get(EEnvKey.PORT), () => console.log('Server started.'))
}

start()
