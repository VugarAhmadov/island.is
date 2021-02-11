import Markdown from 'markdown-to-jsx'
import { Bullet, BulletList, Text, TextProps } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './MarkdownText.treat'

interface MarkdownTextProps {
  children: string
  color?: TextProps['color']
  variant?: TextProps['variant']
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({
  children,
  color = null,
  variant = 'default',
}) => {
  return (
    <div className={styles.markdownText}>
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            p: {
              component: Text,
              props: {
                fontWeight: 'light',
                color,
                variant,
                lineHeight: 'lg',
              },
            },
            span: {
              component: Text,
              props: {
                fontWeight: 'light',
                color,
                variant,
                lineHeight: 'lg',
              },
            },
            h1: {
              component: Text,
              props: {
                fontWeight: 'semiBold',
                color,
                variant,
                lineHeight: 'lg',
                paddingBottom: '0',
              },
            },
            ul: {
              component: BulletList,
              props: {
                space: 1,
              },
            },
            li: {
              component: Bullet,
            },
          },
        }}
      >
        {children.replace(/\n\n/g, '\n\n<br>\n\n')}
      </Markdown>
    </div>
  )
}
