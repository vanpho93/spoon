/* istanbul ignore file */
import { Env, EEnvKey, runMigrations } from './global'
import { app } from './app'
import { RouteLoader } from './app-loader/route-loader'
import { scan } from './scanner'

async function start() {
  await runMigrations()
  await RouteLoader.load(app)
  app.listen(Env.get(EEnvKey.PORT), () => console.log('Server started.'))
  scan()
}

start()
