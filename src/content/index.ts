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
  }
})()
