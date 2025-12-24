import React from 'react'

type State = { hasError: boolean }

export default class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}){ super(props); this.state = { hasError: false } }
  static getDerivedStateFromError(){ return { hasError: true } }
  componentDidCatch(error: any, info: any){ console.error('ErrorBoundary caught', error, info) }
  render(){
    if(this.state.hasError) return <div className="p-6">Something went wrong.</div>
    return this.props.children
  }
}
