import React from 'react'
import { useAppSelector } from '../app/hooks'

export default function withRole(requiredRole: string){
  return function<P>(WrappedComponent: React.ComponentType<P>){
    const ComponentWithRole: React.FC<P> = (props) => {
      const user = useAppSelector(s => s.auth.user)
      const role = (user && ((user as any).role || ((user as any).name === 'Admin' ? 'admin' : 'user'))) || 'user'
      if(role !== requiredRole) return null
      return <WrappedComponent {...props} />
    }
    return ComponentWithRole
  }
}
