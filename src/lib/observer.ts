import { ExtendedElement } from '@/types'
import { getTweetFeedElement, isOnStatusPage } from '@/utils/twitter'
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
