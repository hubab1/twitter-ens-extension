import UserDetails from './UserDetails'

interface TweetBodyProps {
  tweetContent: string[]
  balances: Record<string, string>
}

export function TweetBody({ balances, tweetContent }: TweetBodyProps) {
  return (
    <span>
      {tweetContent.map((string) => {
        if (balances.hasOwnProperty(string)) {
          return <UserDetails balance={balances[string]} text={string} />
        } else {
          return string
        }
      })}
    </span>
  )
}
