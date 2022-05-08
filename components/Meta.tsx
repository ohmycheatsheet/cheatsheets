/**
 * dynamic meta info
 */

import React from 'react'
import Head from 'next/head'

export type MetaProps = {
  title?: string
  description?: string
}

export const Meta = ({
  title = `${process.env.VERCEL_GIT_REPO_OWNER}'s Cheatsheets`,
  description = 'less to more',
}: MetaProps) => {
  return (
    <Head>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={`@${process.env.VERCEL_GIT_REPO_OWNER}`} />
      <meta name="twitter:creator" content={`@${process.env.VERCEL_GIT_REPO_OWNER}`} />
      <meta name="twitter:url" content={`https://${process.env.VERCEL_URL}`} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://i.loli.net/2020/04/24/skJDnlE4rUPKhFg.png" />
      <meta property="og:url" content={`https://${process.env.VERCEL_URL}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="https://i.loli.net/2020/04/24/skJDnlE4rUPKhFg.png" />
      <meta property="og:description" content={description} />
      <meta
        property="og:site_name"
        content={`${process.env.VERCEL_GIT_REPO_OWNER}'s Cheatsheets`}
      />
    </Head>
  )
}
