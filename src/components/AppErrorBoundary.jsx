import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children
    return <main className="fatal-error"><h1>The imperial record could not be opened.</h1><p>{this.state.error.message}</p><button onClick={() => window.location.reload()}>Reload campaign</button></main>
  }
}
