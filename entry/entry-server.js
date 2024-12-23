import { createApp } from '../src/main'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject(new Error({ code: 404 }))
      }
      resolve(app)
    }, reject)
  })
}
