export const TWEET_HEADER_SELECTOR =
  'div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu > div:nth-child(1) > div > div > div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2'
export const TWEET_BODY_SELECTOR =
  'div.css-901oao.r-1fmj7o5.r-37j5jr.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0'
export const TWEET_BODY_SELECTOR_2 =
  'div.css-1dbjc4n.r-18u37iz > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu > div:nth-child(2) > div:nth-child(1) > div'
export const TWEET_FEED_SELECTOR =
  'div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > span'
export const MAIN_PAGE_TWEET_FEED_SELECTOR =
  '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-1jgb5lz.r-13qz1uu > div > section'
export const PROFILE_PAGE_TWEET_FEED_SELECTOR =
  '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > section > div'
export const PROFILE_PAGE_USER_NAME_SELECTOR =
  '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div.css-1dbjc4n.r-1ifxtd0.r-ymttw5.r-ttdzmv > div.css-1dbjc4n.r-6gpygo.r-14gqq1x > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-dnmrzs > div > span:nth-child(1) > span'
export const PROFILE_PAGE_BIO_SELECTOR =
  '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div.css-1dbjc4n.r-1ifxtd0.r-ymttw5.r-ttdzmv > div:nth-child(3) > div > div > span'
export const TWEET_CONTAINER_SELECTOR =
  'div.css-1dbjc4n.r-18u37iz > div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu'
export const TWEET_HEADER_SELECTOR_FROM_TWEET_CONTAINER =
  'div:nth-child(1) > div > div > div.css-1dbjc4n.r-1d09ksm.r-18u37iz.r-1wbh5a2'
export const TWITTER_HANDLE_SELECTOR_FROM_TWEET_HEADER =
  'span.css-901oao.css-16my406.css-bfa6kz.r-poiln3.r-bcqeeo.r-qvutc0 > span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0'
export const QUOTE_TWEET_CONTAINER_SELECTOR =
  'div.css-1dbjc4n.r-1kqtdi0.r-1867qdf.r-rs99b7.r-1loqt21.r-adacv.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg'
export const QUOTE_TWEET_BODY_FROM_CONTAINER_SELECTOR =
  'div > div.css-1dbjc4n.r-6gpygo.r-1fz3rvf > div'
export const QUOTE_TWEET_TWITTER_HANDLE_FROM_HEADER_SELECTOR =
  'div > div.css-1dbjc4n.r-1wbh5a2.r-1udh08x > div > div > div > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-dnmrzs > div.css-901oao.r-1awozwy.r-1fmj7o5.r-6koalj.r-37j5jr.r-a023e6.r-b88u0q.r-rjixqe.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0 > span > span'
export const QUOTE_TWEET_HEADER_FROM_CONTAINER_SELECTOR =
  'div.css-1dbjc4n.r-1kqtdi0.r-1867qdf.r-rs99b7.r-1loqt21.r-adacv.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg > div > div.css-1dbjc4n.r-eqz5dr.r-1fz3rvf.r-1s2bzr4 > div'

export const TWITTER_STATUS_PAGE_REGEX = /twitter\.com\/\w+\/status\/\d+\b/

export function getTweetFeedElement() {
  const targetElementSelector = isOnProfilePage()
    ? PROFILE_PAGE_TWEET_FEED_SELECTOR
    : MAIN_PAGE_TWEET_FEED_SELECTOR
  return document.querySelector(targetElementSelector)!
}

export const getTwitterUserName = (headerElement: Element) =>
  headerElement.querySelector(
    'div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > span',
  )?.textContent ?? ''

export const getTweetId = (tweetHeaderElement: Element) => {
  const tweetLinkElement = tweetHeaderElement.querySelectorAll('a')
  const tweetIdRegex = /\d+$/
  const tweetLink =
    tweetLinkElement?.[1]?.attributes?.getNamedItem('href')?.value ?? ''
  return tweetIdRegex.exec(tweetLink)?.[0] ?? 'not found'
}

export const isOnProfilePage = () =>
  !/twitter\.com\/home\b/.test(document.URL) &&
  /twitter\.com\/\w+$/.test(document.URL)

export const isOnStatusPage = (URL: string = document.URL) =>
  TWITTER_STATUS_PAGE_REGEX.test(URL)

export const areTweetsLoaded = () =>
  Promise.resolve(Boolean(document.querySelector(TWEET_HEADER_SELECTOR)))

export const isTweetFeedLoaded = async () => {
  const TWEET_FEED_SELECTOR = isOnProfilePage()
    ? PROFILE_PAGE_TWEET_FEED_SELECTOR
    : MAIN_PAGE_TWEET_FEED_SELECTOR
  return Promise.resolve(Boolean(document.querySelector(TWEET_FEED_SELECTOR)))
}
