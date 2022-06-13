import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import Progress from 'nprogress'
import { initialize, pageview } from 'react-ga'
import Router from 'next/router'
import { cheatSheetGlobalStyles } from '~/style/global'
import { ThemeProvider } from 'mayumi/theme'

import '~/style/nprogress.css'
import '~/style/github.css'
import '~/style/one-dark.css'
import '~/style/icons.css'

Router.events.on('routeChangeStart', () => Progress.start())
Router.events.on('routeChangeComplete', () => Progress.done())
Router.events.on('routeChangeError', () => Progress.done())

const CustomApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (process.env.G_ANALYTICS_ID && process.env.NODE_ENV === 'production') {
      // Checks for GA ID and only turns on GA in production
      initialize(process.env.G_ANALYTICS_ID)
      pageview(window.location.pathname + window.location.search)
    }
  })
  cheatSheetGlobalStyles()
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default CustomApp
