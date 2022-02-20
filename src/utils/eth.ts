export const ETH_ADDRESS_OR_ENS_DOMAIN_REGEX =
  /\b(0x[a-fA-F0-9]{40})|(\w+.eth)\b/

export function getEnsDomains(string: string) {
  const ensDomainRegex = /\w+\.eth\b/
  const domains: string[] = []
  ensDomainRegex.exec(string)?.forEach((domain) => domains.push(domain))
  return domains[0]
}

export function findAddressOrDomain(
  string: string,
): [string[], Record<string, boolean>] {
  const matches: Record<string, boolean> = {}
  const splitString = string
    .split(ETH_ADDRESS_OR_ENS_DOMAIN_REGEX)
    .filter((match) => !['', undefined].includes(match))
  for (const string of splitString) {
    matches[string] = ETH_ADDRESS_OR_ENS_DOMAIN_REGEX.test(string)
  }
  return [splitString, matches]
}
