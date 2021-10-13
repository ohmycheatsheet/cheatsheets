import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useRouter } from 'next/router'
import { Image, Link, Spinner } from 'styled-cssgg'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { doHighlight } from '@lotips/core'
import { Box, Divider, Typography, Dot, Notification } from 'granen'
import styled from 'styled-components'
import { Issue } from '@omcs/request/types'

import { share } from '~/utils/share'
import { createMarkdownRenderer } from '~/utils/md'
import { Icon } from '~/components/Icon'

let Html2Canvas: typeof import('html2canvas')['default']
import('html2canvas').then(module => (Html2Canvas = module.default as any))

dayjs.extend(relativeTime)
const MarkdownIt = createMarkdownRenderer()

type SheetProps = {
  v?: Issue
  highlight?: string
  className?: string
  style?: React.CSSProperties
  onClickTitle?: (v: Issue) => void
  onShare?: (notify?: boolean) => void
}

const Container = styled(Box)`
  @apply shadow w-full rounded-lg overflow-hidden text-sm;

  && {
    background-color: var(--active-bg-color);
  }
`

const Title = styled.div`
  @apply p-4 pb-0;

  .label {
    @apply pr-2 cursor-pointer inline-flex items-center text-sm text-gray-700 gap-2;
  }
`

const SubTitle = styled(Typography.SubTitle)`
  && {
    @apply m-0 mb-1 cursor-pointer;
  }

  [data-role='dot'] {
    @apply ml-2 w-2 h-2;
  }
`

const Info = styled.div`
  @apply box-border flex italic justify-between items-center text-sm text-gray-500 p-4 w-full;

  [data-role='info-operations'] {
    @apply flex justify-between items-center text-sm;
  }

  time {
    @apply mx-2;
  }

  .operations {
    @apply flex gap-4 items-center;
  }
`

const Operation = styled(Icon)`
  @apply cursor-pointer p-4 -m-4 cursor-pointer;

  &.loading {
    @apply cursor-not-allowed;
  }
`

const EMPTY = {} as Issue

export const Sheet = ({ v = EMPTY, highlight = '', ...props }: SheetProps) => {
  const router = useRouter()
  const label = v.labels?.[0]?.name
  const idcard = v.id
  const [copyLoading, setCopyLoading] = useState(false)
  const handleCopyImage = useCallback(() => {
    const sheet = document.querySelector(`[id="${idcard}"]`)?.cloneNode(true)
    const container = document.querySelector('#SHEET-CONTAINER')
    if (!sheet || !container) {
      return
    }
    setCopyLoading(true)
    container.appendChild(sheet)
    Html2Canvas(container as HTMLElement).then((canvas: HTMLCanvasElement) => {
      canvas.toBlob(blob => {
        if (!blob) {
          return
        }
        const item = new ClipboardItem({ 'image/png': blob })
        ;(navigator.clipboard as any).write([item])
        container.removeChild(sheet)
        setCopyLoading(false)
        // TODO: should we include image in description?
        Notification.info({
          title: 'Copied success!',
          description: 'Share your cheatsheet with image',
        })
      })
    })
  }, [idcard])
  return (
    <Container
      borderless={true}
      className={props.className}
      style={props.style}
      key={v.title}
      id={idcard}
    >
      <Title>
        <SubTitle h2={true}>
          <a href={v.html_url} target="_blank" rel="noreferrer">
            <span
              dangerouslySetInnerHTML={{
                __html: doHighlight(`<span>${v.title || ''}</span>`, highlight),
              }}
              onClick={() => props.onClickTitle?.(v)}
            />
            {v.state === 'open' ? <Dot type="success" /> : <Dot type="danger" />}
          </a>
        </SubTitle>
        {v.labels.map(label => {
          return (
            <div
              key={label.id}
              className="label"
              style={{ color: `#${label.color}` }}
              onClick={() => router.push(`/sheet/label/${label.id}`)}
            >
              # {label.name}
            </div>
          )
        })}
        <Divider type="horizontal" />
      </Title>
      <div
        key={v.title}
        className="theme-default"
        dangerouslySetInnerHTML={{
          __html: doHighlight(MarkdownIt.render(v.body || ''), highlight),
        }}
      />
      <Info>
        <div className="operations">
          <Operation
            onClick={() => {
              share(idcard, label, v.title, v.body).then(needNotify => {
                if (needNotify) {
                  Notification.info({
                    title: 'Copied success!',
                    description: 'Share your cheatsheet with link',
                  })
                }
              })
            }}
          >
            <Link style={{ '--ggs': 0.7 } as any} />
          </Operation>
          <Operation
            className={cx({
              loading: copyLoading,
              last: true,
            })}
            onClick={() => {
              handleCopyImage()
            }}
          >
            {copyLoading ? (
              <Spinner style={{ '--ggs': 0.7 } as any} />
            ) : (
              <Image style={{ '--ggs': 0.7 } as any} />
            )}
          </Operation>
        </div>
        <div>
          <time>{dayjs(v.updatedAt).from(dayjs())}</time>
          <time>{dayjs(v.createdAt).format('YYYY-MM-DD')}</time>
        </div>
      </Info>
    </Container>
  )
}
