import { Env, EEnvKey } from './global'
import { app } from './app'

app.listen(Env.get(EEnvKey.PORT), () => console.log('Server started.'))
