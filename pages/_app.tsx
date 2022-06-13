import type { AppProps } from 'next/app'
import React, { useEffect } from 'react'
import Progress from 'nprogress'
import ReactGA from 'react-ga4'
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
      ReactGA.initialize(process.env.G_ANALYTICS_ID)
      ReactGA.send('pageview')
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
