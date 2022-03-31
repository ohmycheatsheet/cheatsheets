/**
 * @fileoverview display issue detail
 */
import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { api } from '~/utils/middlewares'
import { Issue } from '@omcs/request/types'
import { styled } from 'mayumi/theme'

import Layout from '~/components/Layout'
import { Meta } from '~/components/Meta'
import { Sheet } from '~/components/Sheet'

const Container = styled('div', {
  p: '$12',
  flexBox: 'center',
  flexDirection: 'column',
  maxHeight: '$full',
  overflowY: 'auto',
  w: '$full',
  m: 'auto',
  '.shared-sheet': {
    w: '$1-2',
    shadow: '$2xl',
    display: 'block',
    flex: 1,
    h: '$full',
    overflowY: 'auto',
  },
})

const CheatSheetById: NextPage<{ issue: Issue }> = (props) => {
  return (
    <Layout>
      <Meta title={props.issue?.title} description={props.issue?.body} />
      <Container>
        <Sheet isShared={true} className="shared-sheet" v={props.issue} />
      </Container>
    </Layout>
  )
}

export async function getServerSideProps(ctx: Parameters<GetServerSideProps>[0]) {
  const issue = await api.getIssue(ctx?.params?.id as string)
  return { props: { issue } }
}

export default CheatSheetById
