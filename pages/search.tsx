/**
 * @fileoverview display search results
 */

import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { Text } from 'mayumi/text'
import { styled } from 'mayumi/theme'

import Layout from '~/components/Layout'
import { SEARCH_LABELS_INDEX_NAME, SEARCH_CHEATSHEET_INDEX_NAME } from '~/utils/constants'
import { api } from '~/utils/middlewares'
import { LabelSearchResults, CheatSheetSearchResults } from '~/components/SearchResults'

const Container = styled('div', {
  px: '$12',
  py: '$6',
  overflowY: 'auto',
  '.mayumi-text': {
    mt: '$0',
  },
  '.cheatsheet-search-item': {
    mb: '$4',
    w: '$full',
    float: 'left',
  },
  '.label-search-results': {
    display: 'flex',
    flexWrap: 'wrap',
  },
  '.label': {
    p: '$2',
    cursor: 'pointer',
  },
})

const SearchPage: NextPage<{ hits: any }> = (props) => {
  const keyword = useRouter().query.q as string
  return (
    <Layout>
      <Container>
        <Text h1={true}>Search Results</Text>
        <CheatSheetSearchResults
          highlight={keyword}
          issues={props.hits[SEARCH_CHEATSHEET_INDEX_NAME]}
        />
        <LabelSearchResults issues={props.hits[SEARCH_LABELS_INDEX_NAME]} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(ctx: Parameters<GetServerSideProps>[0]) {
  const search = await api.multipleSearch({
    query: ctx.query.q as string,
    limit: 10,
    mode: 'default',
  })
  return { props: { hits: search } }
}

export default SearchPage
