import React, { useState, useCallback, useRef } from 'react'
import { algolia } from '@omcs/request/algolia'
import { Input } from 'mayumi/input'
import { Dropdown } from 'mayumi/dropdown'
import { Text } from 'mayumi/text'
import { styled } from 'mayumi/theme'
import { Search, Spinner } from 'styled-cssgg'
import debounce from 'lodash.debounce'
import type { Hit } from 'react-instantsearch-core'
import type { SearchClient } from 'algoliasearch'

import {
  SEARCH_CHEATSHEET_INDEX_NAME,
  SEARCH_LABELS_INDEX_NAME,
  dictionary,
} from '~/utils/constants'
import { useRouter } from 'next/router'

const searchClient: SearchClient = algolia.getSearchClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APPID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!,
)

type Queries = Parameters<SearchClient['multipleQueries']>[0]

const unShipProps: any = {
  enterKeyHint: 'search',
}

const Item = styled(Dropdown.Item, {
  flexDirection: 'column',
  alignItems: 'flex-start',
})

type HitsProps = {
  value: {
    hits: Hit[]
    index: typeof SEARCH_CHEATSHEET_INDEX_NAME | typeof SEARCH_LABELS_INDEX_NAME
  }[]
  loading: boolean
}

const Menu = styled(Dropdown.Menu, {
  '&&': {
    maxHeight: '$96',
    overflowY: 'auto',
  },
})

const StyledDropdown = styled(Dropdown, {
  '.mayumi-tooltip-content': {
    justifyContent: 'flex-start'
  }
})

const Hits = (props: HitsProps) => {
  const router = useRouter()
  if (props.loading) {
    return (
      <Dropdown.Menu>
        <Item>
          <Spinner />
        </Item>
      </Dropdown.Menu>
    )
  }
  if (props.value.length === 0) {
    return (
      <Dropdown.Menu>
        <Item>No Results</Item>
      </Dropdown.Menu>
    )
  }
  const handleClick = (
    index: typeof SEARCH_CHEATSHEET_INDEX_NAME | typeof SEARCH_LABELS_INDEX_NAME,
    id: string,
  ) => {
    if (index === 'cheatsheets_issues') {
      router.push('/sheet/id/[id]', `/sheet/id/${id}`)
    }
    if (index === 'cheatsheets_labels') {
      router.push('/sheet/label/[id]', `/sheet/label/${id}`)
    }
  }
  return (
    <Menu>
      {props.value
        .filter((item) => item.hits.length !== 0)
        .map((result) => {
          return (
            <Dropdown.SubMenu key={result.index} title={dictionary[result.index]}>
              {result.hits.map((item) => {
                return (
                  <Item
                    onClick={() => handleClick(result.index, item.objectID)}
                    key={item.objectID}
                  >
                    <Text h3={true}>
                      {result.index === SEARCH_CHEATSHEET_INDEX_NAME ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item._highlightResult.title?.value || '',
                          }}
                        />
                      ) : (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item._highlightResult.name?.value || '',
                          }}
                        />
                      )}
                    </Text>
                    <Text p={true} type="tertiary">
                      {result.index === SEARCH_CHEATSHEET_INDEX_NAME ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item._highlightResult.body?.value || '',
                          }}
                        />
                      ) : (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item._highlightResult.description?.value || '',
                          }}
                        />
                      )}
                    </Text>
                  </Item>
                )
              })}
            </Dropdown.SubMenu>
          )
        })}
    </Menu>
  )
}

export const CheatSheetSearchBox = () => {
  const [input, setInput] = useState('')
  const [value, setValue] = useState<HitsProps['value']>([])
  const [loading, setLoading] = useState(false)
  const searchApi = useRef(
    debounce(async (query = '') => {
      const queries: Queries = [
        {
          indexName: SEARCH_CHEATSHEET_INDEX_NAME,
          query,
          params: {
            hitsPerPage: 3,
            highlightPreTag: '<mark class="search-highlight">',
            highlightPostTag: '</mark>',
            facetFilters: ['state:OPEN'],
          },
        },
        {
          indexName: SEARCH_LABELS_INDEX_NAME,
          query,
          params: {
            hitsPerPage: 3,
            highlightPreTag: '<mark class="search-highlight">',
            highlightPostTag: '</mark>',
          },
        },
      ]
      await searchClient.multipleQueries(queries).then(({ results }: { results: any }) => {
        setValue(results as HitsProps['value'])
      })
      setLoading(false)
    }, 500),
  )
  const handleChange = useCallback(async (e) => {
    setInput(e.currentTarget.value)
    setLoading(true)
    await searchApi.current(e.currentTarget.value)
  }, [])

  return (
    <StyledDropdown
      trigger={['click', 'focus']}
      glassmorphism={true}
      content={<Hits loading={loading} value={value} />}
    >
      <Input
        prefix={<Search />}
        {...unShipProps}
        type="input"
        size="lg"
        value={input}
        onChange={handleChange}
      />
    </StyledDropdown>
  )
}
