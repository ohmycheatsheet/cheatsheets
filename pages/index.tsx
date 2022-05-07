import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { animated, useTrail } from '@react-spring/web'
import { QueryStatus } from 'react-query'
import { Issue } from '@omcs/request/types'
import { Text } from 'mayumi/text'
import { styled } from 'mayumi/theme'
import { useRouter } from 'next/router'

import Layout from '~/components/Layout'
import { api } from '~/utils/middlewares'
import { Meta } from '~/components/Meta'
import { Sheet } from '~/components/Sheet'
import Spinner from '../assets/spinner.svg'

const AnimatedWrapper = styled(animated.div, {
  mb: '$4',
  w: '$full',
})

const Recent = ({
  issues = [],
  status,
  highlight,
}: {
  issues?: Issue[]
  status?: QueryStatus
  highlight?: string
}) => {
  const router = useRouter()
  const transitions = useTrail<{ opacity: number }>(issues.length, {
    opacity: status === 'loading' ? 0 : 1,
    from: { opacity: 0 },
  })
  if (status === 'loading') {
    return (
      <Icon css={{ m: 'auto', pt: '$10' }}>
        <Spinner width={14} />
      </Icon>
    )
  }
  return (
    <div className="omcs-recent-list">
      {issues?.length !== 0 ? (
        <>
          {transitions.slice(0, 2).map((props, index) => {
            return (
              <AnimatedWrapper key={index} style={props}>
                <Sheet
                  onClickTitle={(v) => router.push('/sheet/id/[id]', `/sheet/id/${v.id}`)}
                  highlight={highlight}
                  v={issues?.[index]}
                />
              </AnimatedWrapper>
            )
          })}
        </>
      ) : null}
    </div>
  )
}

const EventContainer = styled('div', {
  w: '$full',
  h: '$full',
  '.omcs-recent-title': {
    position: 'sticky',
    top: '$0',
    glass: '8px',
    zIndex: '$20',
    py: '$4',
    px: '$6',
    borderBottom: '1px solid $quaternaryLabelColor',
  },
  '.omcs-recent-list': {
    p: '$6',
  },
})

const IndexPage: NextPage<{ recent: Issue[]; someday: Issue[] }> = (props) => {
  const keyword = useRouter().query.q as string
  return (
    <Layout>
      <Meta />
      <EventContainer>
        <div className="omcs-recent-title">
          <Text h2={true}>Recent</Text>
        </div>
        <Recent highlight={keyword} issues={props.recent} />
      </EventContainer>
    </Layout>
  )
}

export async function getServerSideProps(ctx: Parameters<GetServerSideProps>[0]) {
  const recent = await api.search({ content: ctx.query.q as string })
  const someday = await api.someday()
  return { props: { recent: recent.hits, someday: someday.hits || [] } }
}

export default IndexPage
