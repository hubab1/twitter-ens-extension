import { ExtendedElement } from '@/types'
import { poll } from '@/utils'
import {
  areTweetsLoaded,
  getTweetFeedElement,
  isOnStatusPage,
} from '@/utils/twitter'
import mutateDom from './twitter'

export class UserActionObserver {
  mutationObserver: MutationObserver
  targetElement: ExtendedElement
  childMutationCount: number
  observerOptions: MutationObserverInit
  currentURL: string
  previousURL: string

  constructor() {
    this.currentURL = document.URL
    this.previousURL = ''
    this.childMutationCount = 0
    this.observerOptions = {
      childList: true,
      attributes: true,
      // Omit (or set to false) to observe only changes to the parent node
      subtree: true,
    }
    this.mutationObserver = new MutationObserver(
      (mutationList: MutationRecord[], observer: MutationObserver) => {
        mutationList.forEach(async (mutation) => {
          if (mutation.type == 'childList') {
            /* One or more children have been added to and/or removed
                from the tree.
                (See mutation.addedNodes and mutation.removedNodes.) */
            this.childMutationCount += 1
            if (this.childMutationCount % 5 === 0) {
              observer.disconnect()
              observer.takeRecords()
              await mutateDom()
              setTimeout(
                () =>
                  observer.observe(this.targetElement, this.observerOptions),
                500,
              )
            }
          }
        })
      },
    )
    this.targetElement = getTweetFeedElement()
    !isOnStatusPage() && // TODO fix mutationObserver on status page
      this.mutationObserver.observe(this.targetElement, this.observerOptions)
    this.observeURLchanges()

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

  reset() {
    this.mutationObserver.takeRecords()
    this.mutationObserver.disconnect()

    this.targetElement = getTweetFeedElement()
    !isOnStatusPage() && // TODO fix mutationObserver on status page
      this.mutationObserver.observe(this.targetElement, this.observerOptions)

    if (document.URL !== this.currentURL) {
      this.previousURL = this.currentURL
      this.currentURL = document.URL
    }
  }

  observeURLchanges = () => {
    if (document.URL !== this.currentURL) {
      this.reset()
    }
    setTimeout(this.observeURLchanges, 500)
  }
}
