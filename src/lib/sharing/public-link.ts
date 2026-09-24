export const PUBLIC_VIEW_PATH = '/view/:slug'

export function publicDiagramPath(slug: string) {
  return `/view/${slug}`
}

export function publicDiagramUrl(slug: string) {
  return `${window.location.origin}${publicDiagramPath(slug)}`
}
