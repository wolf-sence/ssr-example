const Vue = require('vue')
const Koa = require('koa')
const KoaStatic = require('koa-static')
const { createBundleRenderer } = require('vue-server-renderer')

const path = require('path')
const fs = require('fs')

const app = new Koa()

const resolve = file => path.resolve(__dirname, file)

app.use(KoaStatic(resolve('../dist')))

const bundle = require('../dist/vue-ssr-server-bundle.json')
const clientMainfest = require('../dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(bundle, {
  runInNewContext: false,
  template: fs.readFileSync(resolve('../template/index.temp.html'), 'utf-8'),
  clientManifest: clientMainfest
})

function renderToString (context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

app.use(async (ctx, next) => {
  const vm = new Vue({
    data: {
      title: 'ssr example',
      url: ctx.url
    }
  })
  const html = await renderToString(vm)
  ctx.body = html
})

const port = 3000
app.listen(port, function () {
  console.log(`server start an localhost:${port}`)
})
