import React, { useEffect } from 'react'
import { Home } from 'styled-cssgg'
import { useRouter } from 'next/router'
import Head from 'next/head'
import zoom from 'medium-zoom'

import pkg from 'package.json'
import Github from '../assets/github.svg'
import Twitter from '../assets/twitter.svg'
import { SideBar } from './SideBar'

const G = Github as any
const T = Twitter as any

type Props = {
  children?: React.ReactNode
}

const Layout = ({ children }: Props) => {
  const router = useRouter()
  useEffect(() => {
    zoom(Array.prototype.slice.call(document.images), { background: 'rgba(255, 255, 255, 0.6)' })
  }, [router.asPath])
  return (
    <div className="flex w-full bg-gray-100 h-full">
      <Head>
        <title>jiangweixian's cheatsheet</title>
      </Head>
      <SideBar className="flex-grow-0" />
      <div className="flex-grow h-full bg-gray-100 flex flex-col" style={{ flexBasis: 0 }}>
        <header
          className="flex-grow-0 w-full relative flex justify-between items-center px-12 box-border bg-gray-100 z-10"
          style={{ flexBasis: '5rem' }}
        >
          <h3 className="font-semibold label text-2xl text-gray-700 absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center pointer-events-none">
            {router.query.id} <span className="text-gray-500 ml-4 font-normal">{'cheatsheet'}</span>
          </h3>
          <Home
            onClick={() => {
              router.push({
                pathname: '/',
              })
            }}
            style={{ '--ggs': 0.95 } as any}
            className="w-10 h-10 text-gray-500 hover:text-gray-700 cursor-pointer"
          />
          <div className="flex items-center">
            <G
              width={20}
              onClick={() => {
                window.open(`https://github.com/${pkg.author.name}/${pkg.name}`)
              }}
              className="mr-8 fill-current text-gray-500 hover:text-gray-700 cursor-pointer"
            />
            <T
              width={20}
              onClick={() => {
                window.open(`https://twitter.com/${pkg.author.name}`)
              }}
              className="fill-current text-gray-500 hover:text-gray-700 cursor-pointer"
            />
          </div>
        </header>
        <div className="overflow-scroll flex-grow" style={{ flexBasis: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
