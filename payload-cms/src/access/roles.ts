import type { Access } from 'payload'

export const hasRole = (req: Parameters<Access>[0]['req'], roles: string[]): boolean => {
  const role = req.user && 'role' in req.user ? req.user.role : undefined
  return typeof role === 'string' && roles.includes(role)
}

export const isAdmin: Access = ({ req }) => hasRole(req, ['admin'])
export const isStaff: Access = ({ req }) => hasRole(req, ['admin', 'editor', 'viewer'])
export const canEditDrafts: Access = ({ req, data }) => {
  if (hasRole(req, ['admin'])) return true
  if (!hasRole(req, ['editor'])) return false
  if (data && typeof data === 'object' && '_status' in data && data._status === 'published') return false
  return { _status: { equals: 'draft' } }
}
export const publishedOrStaff: Access = ({ req }) =>
  hasRole(req, ['admin', 'editor', 'viewer']) || { _status: { equals: 'published' } }

