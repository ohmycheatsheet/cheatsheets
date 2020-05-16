import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import Link from 'next/link'
import useSWR from 'swr'
import { Spinner } from 'styled-cssgg'
import { animated, useTrail } from 'react-spring'
import { useRematch } from '@use-rematch/core'

import { api } from '~/api/client'
import { Github } from '~/interface/github'
import Layout from '~/components/Layout'
import { Meta } from '~/components/Meta'
import pkg from 'package.json'
import { Sheet } from '~/components/Sheet'
import { useRouter } from 'next/router'
import { Divider } from '~/components/Divider'

const unShipProps: any = {
  enterkeyhint: 'search',
}

const Content = ({
  issues = [],
  labels,
  status,
  highlight,
}: {
  issues?: Github.Issue[]
  labels?: Github.Label[]
  status?: 'loading' | 'loaded' | 'init'
  highlight?: string
}) => {
  const transitions = useTrail<{ opacity: number }>(issues.length, {
    opacity: status === 'loading' ? 0 : 1,
    from: { opacity: 0 },
  })
  if (status === 'init') {
    ;<ul className="list-disc grid lg:grid-cols-3 lg:w-2/4 grid-cols-2 w-8/12 list-inside">
      {labels
        ?.filter(v => !v.default)
        .map(v => {
          return (
            <li className="text-blue-800 cursor-pointer hover:text-blue-500" key={v.name}>
              <Link href="/sheet/[id]" as={`/sheet/${v.name}`}>
                {v.name}
              </Link>
            </li>
          )
        })}
    </ul>
  }
  if (status === 'loading') {
    return <Spinner />
  }
  return (
    <div className="lg:w-2/4 w-8/12">
      <ul className="list-disc grid lg:grid-cols-3 grid-cols-2 list-inside">
        {labels
          ?.filter(v => !v.default)
          .map(v => {
            return (
              <li className="text-blue-800 cursor-pointer hover:text-blue-500" key={v.name}>
                <Link href="/sheet/[id]" as={`/sheet/${v.name}`}>
                  {v.name}
                </Link>
              </li>
            )
          })}
      </ul>
      <Divider />
      {issues && issues.length !== 0 ? (
        <>
          {transitions.map((props, index) => {
            return (
              <animated.div key={issues[index].id} style={props}>
                <Sheet highlight={highlight} className={'mb-4'} v={issues[index]} />
              </animated.div>
            )
          })}
        </>
      ) : null}
    </div>
  )
}

const IndexPage: NextPage<{ data: Github.Label[] }> = props => {
  const { data } = useSWR(`${pkg.author.name}-${pkg.name}-labels`, api.github.labels, {
    initialData: props.data,
  })
  const searchTerms = useRouter().query.q as string
  const { state, dispatch } = useRematch({
    name: 'homepage',
    state: {
      issues: undefined,
      keyword: searchTerms,
      status: 'init',
    } as {
      issues?: Github.Issue[]
      keyword: string
      status: 'loading' | 'loaded' | 'init'
    },
    reducers: {
      setIssues(state, issues?: Github.Issue[]) {
        return {
          ...state,
          issues,
          status: !issues ? 'init' : state.status,
        }
      },
      setKeyword(state, keyword: string) {
        return {
          ...state,
          keyword,
        }
      },
      setStatus(state, status: 'loading' | 'loaded' | 'init') {
        return {
          ...state,
          status,
        }
      },
    },
    effects: {
      async searchIssues(payload: string) {
        if (!payload) {
          return
        }
        this.setStatus('loading')
        const issues = await api.github.search(payload)
        this.setIssues(issues.items)
        this.setStatus('loaded')
      },
    },
  })
  useEffect(() => {
    dispatch.searchIssues(searchTerms)
  }, [searchTerms])
  const labels = useMemo(() => {
    return state.keyword ? data?.filter(v => v.name.includes(state.keyword)) : data
  }, [state.keyword, data])
  return (
    <Layout>
      <Meta />
      <div className="contianer flex flex-col items-center w-full min-h-full bg-gray-100">
        <h1 className="label lg:text-5xl text-xl text-gray-700 mt-40 lg:mt-56 lg:mb-10 mb-0">
          {pkg.author.name}'s <span className="text-gray-500">cheatsheets</span>
        </h1>
        <input
          placeholder="请输入关键词"
          value={state.keyword}
          {...unShipProps}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const target: any = e.target
              dispatch.setKeyword(target.value)
              if (!target.value) {
                dispatch.setIssues(undefined)
                return
              }
              dispatch.searchIssues(target.value)
            }
          }}
          className="shadow appearance-none border focus:outline-none focus:shadow-outline md:w-2/4 lg:w-2/4 w-11/12 h-12 text-gray-500 rounded m-8 p-2"
        />
        <Content
          highlight={state.keyword}
          issues={state.issues}
          labels={labels}
          status={state.status}
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps(_ctx: Parameters<GetServerSideProps>[0]) {
  const data = await api.github.labels()
  return { props: { data } }
}

export default IndexPage
