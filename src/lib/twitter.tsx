import ReactDOM from 'react-dom'

import { ExtendedElement } from '@/types'
import UserDetails from '@/components/UserDetails'
import { TweetBody } from '@/components/TweetBody'
import { findAddressOrDomain, getEnsDomains } from '@/utils/eth'
import ethereumClient from '@/lib/eth'
import {
  isOnProfilePage,
  isOnStatusPage,
  PROFILE_PAGE_BIO_SELECTOR,
  PROFILE_PAGE_USER_NAME_SELECTOR,
  QUOTE_TWEET_BODY_FROM_CONTAINER_SELECTOR,
  QUOTE_TWEET_CONTAINER_SELECTOR,
  QUOTE_TWEET_HEADER_FROM_CONTAINER_SELECTOR,
  QUOTE_TWEET_TWITTER_HANDLE_FROM_HEADER_SELECTOR,
  TWEET_BODY_SELECTOR,
  TWEET_CONTAINER_SELECTOR,
  TWEET_HEADER_SELECTOR_FROM_TWEET_CONTAINER,
  TWITTER_HANDLE_SELECTOR_FROM_TWEET_HEADER,
} from '@/utils/twitter'

export async function mutateDom(): Promise<void> {
  if (isOnProfilePage()) {
    await mutateProfileTwitterHandle()
    await mutateProfileBio()
  }

  if (isOnStatusPage()) {
    // TODO search and replace main tweet content on status page
  }

  await mutateTweet()
  await mutateQuoteTweet()
}

// Search and replace ENS domains for twitter handle on profile page
async function mutateProfileTwitterHandle() {
  const twitterUserElem = document.querySelector(
    PROFILE_PAGE_USER_NAME_SELECTOR,
  )
  const twitterHandle = twitterUserElem?.textContent ?? ''
  const ensDomain = getEnsDomains(twitterHandle)
  const balance = await ethereumClient.getBalance(ensDomain)
  if (balance) {
    const span = document.createElement('span')
    twitterUserElem!.before(span)
    ReactDOM.render(
      <UserDetails text={twitterHandle} balance={balance} />,
      span,
    )
    twitterUserElem!.remove()
  }
}

// Search and replace ENS domains within twitter bio
async function mutateProfileBio() {
  const twitterBioElements = document.querySelectorAll(
    PROFILE_PAGE_BIO_SELECTOR,
  )
  twitterBioElements.forEach(async (element: Element) => {
    if (element?.textContent) {
      const ensDomain = getEnsDomains(element.textContent)
      if (ensDomain) {
        const balance = await ethereumClient.getBalance(ensDomain)
        if (balance) {
          const span = document.createElement('span')
          element.before(span)
          ReactDOM.render(
            <UserDetails text={element.textContent} balance={balance} />,
            span,
          )
          element.remove()
        }
      }
    }
  })
}

async function mutateTweet() {
  const tweetContainerElements = document.querySelectorAll(
    TWEET_CONTAINER_SELECTOR,
  )
  tweetContainerElements.forEach(
    async (element: ExtendedElement): Promise<string | void> => {
      if (element.treated) return
      const tweetHeaderElement = element.querySelector(
        TWEET_HEADER_SELECTOR_FROM_TWEET_CONTAINER,
      )
      const twitterHandleElem = tweetHeaderElement?.querySelector(
        TWITTER_HANDLE_SELECTOR_FROM_TWEET_HEADER,
      )
      const twitterHandle = twitterHandleElem?.textContent ?? ''
      const ensDomain = getEnsDomains(twitterHandle)
      const balance = await ethereumClient.getBalance(ensDomain)

      if (balance) {
        const span = document.createElement('span')
        twitterHandleElem!.before(span)
        ReactDOM.render(
          <UserDetails text={twitterHandle} balance={balance} />,
          span,
        )
        twitterHandleElem!.remove()
        element.treated = true
      }

      const tweetBodyElement = element.querySelector(TWEET_BODY_SELECTOR)
      if (tweetBodyElement) {
        const [matches, results] = findAddressOrDomain(
          tweetBodyElement?.textContent!,
        )
        const balances: Record<string, string> = {}

        for await (const [key, value] of Object.entries(results)) {
          if (value) {
            const balance = await ethereumClient.getBalance(key)
            if (balance) {
              balances[key] = balance
            }
          }
        }

        if (Object.keys(balances).length !== 0) {
          const span = document.createElement('span')
          tweetBodyElement.before(span)
          ReactDOM.render(
            <TweetBody balances={balances} tweetContent={matches} />,
            span,
          )
          tweetBodyElement.remove()
          element.treated = true
        }
      }
    },
  )
}

async function mutateQuoteTweet() {
  document
    .querySelectorAll(QUOTE_TWEET_CONTAINER_SELECTOR)
    .forEach(async (element: ExtendedElement) => {
      if (element.treated) return
      const tweetHeaderElement = element.querySelector(
        QUOTE_TWEET_HEADER_FROM_CONTAINER_SELECTOR,
      )
      const twitterHandleElem = tweetHeaderElement?.querySelector(
        QUOTE_TWEET_TWITTER_HANDLE_FROM_HEADER_SELECTOR,
      )
      const twitterHandle = twitterHandleElem?.textContent ?? ''
      const ensDomain = getEnsDomains(twitterHandle)
      const balance = await ethereumClient.getBalance(ensDomain)
      if (balance) {
        const span = document.createElement('span')
        twitterHandleElem!.before(span)
        ReactDOM.render(
          <UserDetails text={twitterHandle} balance={balance} />,
          span,
        )
        twitterHandleElem!.remove()
        element.treated = true
      }

      const quoteTweetBodyElement = element.querySelector(
        QUOTE_TWEET_BODY_FROM_CONTAINER_SELECTOR,
      )
      const [matches, results] = findAddressOrDomain(
        quoteTweetBodyElement?.textContent ?? '',
      )
      const balances: Record<string, string> = {}
      Object.entries(results).forEach(async ([key, value]) => {
        if (value) {
          const balance = await ethereumClient.getBalance(key)
          balances[key] = balance
        }
      })

      if (balances && Object.keys(balances).length !== 0) {
        const span = document.createElement('span')
        quoteTweetBodyElement!.before(span)
        ReactDOM.render(
          <TweetBody balances={balances} tweetContent={matches} />,
          span,
        )
        quoteTweetBodyElement!.remove()
        element.treated = true
      }
    })
}

export default mutateDom
