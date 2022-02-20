// import 'dotenv/config'
// eslint-disable-next-line node/no-unpublished-import
import 'tailwindcss/tailwind.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { poll } from '@/utils'
import { UserActionObserver } from '@/lib/observer'
import { areTweetsLoaded } from '@/utils/twitter'
import mutateDom from '@/lib/twitter'
;(function main() {
  window.onload = async () => {
    await poll(areTweetsLoaded, 1500)
    await mutateDom()
    new UserActionObserver()

    history.pushState = ((f) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function pushState(this: any, ...args) {
        const ret = f.apply(this, args)
        window.dispatchEvent(new Event('pushstate'))
        window.dispatchEvent(new Event('URLchange'))
        return ret
        // eslint-disable-next-line @typescript-eslint/unbound-method
      })(history.pushState)

    history.replaceState = ((f) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function replaceState(this: any, ...args) {
        const ret = f.apply(this, args)
        window.dispatchEvent(new Event('replacestate'))
        window.dispatchEvent(new Event('URLchange'))
        return ret
        // eslint-disable-next-line @typescript-eslint/unbound-method
      })(history.replaceState)

    window.addEventListener('popstate', () => {
      window.dispatchEvent(new Event('URLchange'))
    })

    window.addEventListener('URLchange', async () => {
      poll(areTweetsLoaded, 1500).then(async () => {
        await mutateDom()
      })
    })
  }
})()
