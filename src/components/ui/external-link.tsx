import type { ComponentProps } from 'react'

export function ExternalLink(props: Readonly<ComponentProps<'a'>>) {
  return <a target="_blank" rel="noreferrer" {...props} />
}
