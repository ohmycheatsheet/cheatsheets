/**
 * @fileoverview display issues list by label
 */
import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { api } from '~/utils/middlewares'
import { Issue, Label } from '@omcs/request/types'
import { Text } from 'mayumi/text'
import { Separator } from 'mayumi/separator'
import { styled } from 'mayumi/theme'
import { api as client } from '~/request/client'
import InfiniteScroll from 'react-infinite-scroller'
import useSWRInfinite from 'swr/infinite'
import compact from 'lodash.compact'

import Layout from '~/components/Layout'
import { Meta } from '~/components/Meta'
import { Sheet } from '~/components/Sheet'
import { PAGE_SIZE } from '~/utils/constants'

const Container = styled('div', {
  px: '$12',
  pt: '$6',
  pb: '$1',
  'h1.mayumi-text': {
    m: '$0',
  },
  'p.mayumi-text': {
    mt: '$3',
    mb: '$0',
    text: '$base',
  },
  '&.issues-list': {
    flex: 1,
    overflowX: 'auto',
  },
})

const getKey = (
  pageIndex: number,
  previousPageData: { hits: Issue[] } | null,
  namespace: string,
) => {
  if (previousPageData && !previousPageData.hits.length) return null // reached the end
  return ['issues', namespace, pageIndex]
}

const CheetsheetByLabel: NextPage<{ data: Issue[]; label: Label }> = (props) => {
  const router = useRouter()
  const { data, setSize, isValidating } = useSWRInfinite(
    (...args: [any, any]) => getKey(...args, props.label.id),
    async (_: string, _namespace: string, index: number) => {
      return client.github.sheets({ offset: (index || 0) * PAGE_SIZE, labelID: props.label.id })
    },
    { fallbackData: [{ hits: props.data }] },
  )
  const isEmpty = data?.[0]?.hits?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.hits?.length < PAGE_SIZE)
  const hasMore = !!data && !isReachingEnd && !isValidating
  const cheatsheets = compact(data?.reduce((acc, cur) => acc.concat(cur.hits), [] as Issue[]))
  return (
    <Layout>
      <Meta title={props.label?.name} description={props.label?.description} />
      <Container>
        <Text h1={true}>{props.label.name}</Text>
        <Text p={true} type="secondary">
          {props.label.description}
        </Text>
      </Container>
      <Separator
        css={{
          width: 'auto',
          mx: '-$4',
        }}
        type="horizontal"
      />
      <Container className="issues-list">
        <InfiniteScroll
          hasMore={hasMore}
          pageStart={0}
          useWindow={false}
          loadMore={(page) => setSize(page)}
          className="index"
        >
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
            <Masonry gutter="16px">
              {cheatsheets?.map((v) => {
                return (
                  <Sheet
                    onClickTitle={() => router.push('/sheet/id/[id]', `/sheet/id/${v.id}`)}
                    key={v.id}
                    className="w-1/2"
                    v={v}
                  />
                )
              })}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(ctx: Parameters<GetServerSideProps>[0]) {
  const issuesByLabel = await api.listIssues({ labelID: ctx?.params?.id as string })
  const label = await api.getLabel(ctx?.params?.id as string)
  return { props: { data: issuesByLabel.hits, label } }
}

export default CheetsheetByLabel
