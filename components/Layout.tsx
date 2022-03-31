import React, { useEffect, useState } from 'react'
import { Home, PushChevronLeft, PushChevronRight, MathPlus } from 'styled-cssgg'
import { useRouter } from 'next/router'
import Head from 'next/head'
import zoom from 'medium-zoom'
import copy from 'copy-to-clipboard'
import { Layout as MayumiLayout } from 'mayumi/layout'
import { Avatar } from 'mayumi/avatar'
import { Separator } from 'mayumi/separator'
import { Notification } from 'mayumi/notification'
import { useTransition, animated } from '@react-spring/web'
import { styled } from 'mayumi/theme'
import { Icon } from 'mayumi/icons'

import config from '~/.omcsrc'
import Github from '../assets/github.svg'
import Twitter from '../assets/twitter.svg'
import { SideBar } from './SideBar'
import { useCreateIssue } from '~/hooks/use-create-issue'

const AnimatedPushChevronLeft = styled(animated(PushChevronLeft), {
  left: '0',
})

const AnimatedPushChevronRight = styled(animated(PushChevronRight), {
  right: '$0',
})

const NavBottom = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '$8',
  opacity: 0.75,
})

const Copyright = styled('footer', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '$4',
  p: '$4',
  pt: '$0',
  pr: '$8',
  pb: '$0',
})

const Container = styled(MayumiLayout, {
  display: 'flex',
  '.inner': {
    flexBasis: '$0',
    flexGrow: '1',
  },
  '.chevron': {
    position: 'relative',
    right: '$0',
    bottom: '$0',
    w: '$full',
    h: '$6',
    flexBox: 'center',
    opacity: 0.75,
    color: '$white',
    cursor: 'pointer',
    '&:hover': {
      opacity: 1,
    },
  },
  '.mayumi-layout-main': {
    backgroundBlendMode: 'multiply, multiply',
    backgroundColor: '#202125',
    backgroundImage:
      'linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%), radial-gradient(at top center, rgba(255, 255, 255, 0.4) 0%, rgba(0, 0, 0, 0.4) 120%) #989898',
  },
  '.omcs-layout-content': {
    overflowY: 'auto',
  }
})

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
  const { handleCreateIssue } = useCreateIssue()
  useEffect(() => {
    const handleCopyCode = (e: MouseEvent) => {
      const target = e.target as any
      const type = (target.nodeName as string).toLowerCase()
      if (type === 'pre' || type === 'code') {
        const code = target.textContent
        copy(code)
        Notification.info({
          title: 'Copied success!',
          description: 'Share your code',
        })
      }
    }
    document.body.addEventListener('click', handleCopyCode)
    return () => document.body.removeEventListener('click', handleCopyCode)
  }, [])
  const [open, setOpen] = useState(true)
  const collapsedTransitions = useTransition(open, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })
  return (
    <Container size="screen">
      <Head>
        <title>{`${config.owner}'s cheatsheet`}</title>
      </Head>
      <MayumiLayout.Navigate
        bottom={
          <NavBottom>
            <MathPlus onClick={handleCreateIssue} />
            <div className="chevron" onClick={() => setOpen((prev) => !prev)}>
              {collapsedTransitions((props, item) => {
                return item ? (
                  <AnimatedPushChevronLeft style={props as any} />
                ) : (
                  <AnimatedPushChevronRight style={props as any} />
                )
              })}
            </div>
          </NavBottom>
        }
        top={
          <>
            <Avatar src={`https://github.com/${config.owner}.png?size=40`} />
            <Home
              onClick={() => {
                router.push({
                  pathname: '/',
                })
              }}
            />
          </>
        }
      />
      <SideBar open={open} />
      <MayumiLayout.Main>
        <div className="omcs-layout-content">
          {children}
        </div>
        {/* for share cheatsheet image */}
        <Separator
          css={{
            width: 'auto',
            mx: '-$4',
          }}
          type="horizontal"
        />
        <Copyright>
          <Icon
            css={{
              cursor: 'pointer',
              fill: '$textColor',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <G
              width={14}
              onClick={() => {
                window.open(`https://github.com/${config.owner}/cheatsheets`)
              }}
              className="copyright-item"
            />
          </Icon>
          <Icon
            css={{
              cursor: 'pointer',
              fill: '$textColor',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <T
              width={14}
              onClick={() => {
                window.open(`https://twitter.com/${config.owner}`)
              }}
              className="copyright-item"
            />
          </Icon>
        </Copyright>
      </MayumiLayout.Main>
      <Notification />
    </Container>
  )
}

export default Layout
