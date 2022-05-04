import React from 'react'
import useSWRInfinite from 'swr/infinite'
import Link from 'next/link'
import { Spinner, Hashtag } from 'styled-cssgg'
import { Label } from '@omcs/request/types'
import InfiniteScroll from 'react-infinite-scroller'
import { Menu } from 'mayumi/menu'
import { Layout } from 'mayumi/layout'
import { styled } from 'mayumi/theme'

import { api } from '~/request/client'
import { PAGE_SIZE } from '~/utils/constants'

const Aside = styled(Layout.Aside, {
  '.mayumi-menu-inner': {
    w: '$full',
    overflow: 'auto',
    height: 'calc(100vh - 64px)',
  },
  '.label-item': {
    display: 'flex',
    alignItems: 'center',
    w: '$full',
    gap: '$4',
    color: 'inherit',
    fontWeight: '$medium',
    '--ggs': 0.75,
  },
  i: {
    color: '$secondaryLabelColor',
  },
  '.spinner': {
    w: '$full',
    flexBox: 'center',
  },
})

const InfScroller = styled(InfiniteScroll, {
  h: '$full',
  w: '$full',
})

const getKey = (pageIndex: number, previousPageData: { hits: Label[] } | null) => {
  if (previousPageData && !previousPageData.hits.length) return null // reached the end
  return ['labels', pageIndex]
}

export const SideBar = ({ open = true, ...props }: { open?: boolean; className?: string }) => {
  const { data, setSize, isValidating } = useSWRInfinite(
    getKey,
    async (_: string, index: number) => {
      return api.github.labels((index || 0) * PAGE_SIZE)
    },
    {},
  )
  const isEmpty = data?.[0]?.hits?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.hits?.length < PAGE_SIZE)
  const hasMore = !!data && !isReachingEnd && !isValidating
  const hits = data?.reduce((acc, cur) => {
    return acc.concat(cur.hits)
  }, [] as Label[])
  return (
    <Aside open={open} className={props.className}>
      <Menu ghost={true} size="lg">
        <InfScroller
          hasMore={hasMore}
          pageStart={0}
          useWindow={false}
          loadMore={(page) => setSize(page)}
          loader={
            <div className="spinner">
              <Spinner />
            </div>
          }
        >
          {hits?.map((v) => {
            return (
              <Menu.Item key={v.objectID}>
                <Link href="/sheet/label/[id]" as={`/sheet/label/${v.objectID}`} passHref={true}>
                  <span className="label-item">{v.name}</span>
                </Link>
              </Menu.Item>
            )
          }) || <></>}
        </InfScroller>
      </Menu>
    </Aside>
  )
}
