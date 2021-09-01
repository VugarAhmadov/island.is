import * as RSBStyles from './RegulationsSidebarBox.treat'
import * as s from './RegulationInfoBox.treat'

import React, { useState } from 'react'
import { Button, Hidden, Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

export type RegulationInfoBoxProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationInfoBox = (props: RegulationInfoBoxProps) => {
  const { regulation, texts } = props
  const { ministry, lawChapters } = regulation

  const { linkToRegulationSearch } = useRegulationLinkResolver()
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()

  const [showCopyCheckmark, setShowCopyCheckmark] = useState<
    NodeJS.Timeout | false
  >(false)

  const showCopyCheck = () => {
    setShowCopyCheckmark((showCopyCheckmark) => {
      if (showCopyCheckmark) {
        clearTimeout(showCopyCheckmark)
        setShowCopyCheckmark(false)
        return setTimeout(showCopyCheck, 100)
      }

      return setTimeout(() => {
        setShowCopyCheckmark(false)
      }, 2000)
    })
  }

  return (
    <RegulationsSidebarBox title={txt('infoboxTitle')} colorScheme="dark">
      {ministry && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxMinistry')}:</strong>
          <ul>
            <li>
              <RegulationsSidebarLink
                href={linkToRegulationSearch({ rn: ministry.slug })}
              >
                <span className={RSBStyles.smallText}>{ministry.name}</span>
              </RegulationsSidebarLink>
            </li>
          </ul>
        </Text>
      )}

      {/*
      {lawChapters.length > 0 && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxLawChapters')}:</strong>
          <ul>
            {lawChapters.map((chapter, i) => (
              <li key={i}>
                <RegulationsSidebarLink
                  href={linkToRegulationSearch({ ch: chapter.slug })}
                >
                  <span className={RSBStyles.smallText}>{chapter.name}</span>
                </RegulationsSidebarLink>
              </li>
            ))}
          </ul>
        </Text>
      )}
      */}

      {regulation.effectiveDate && (
        <Text marginBottom={2}>
          <strong>{txt('infoboxEffectiveDate')}:</strong>
          <br />
          <span className={RSBStyles.smallText}>
            {formatDate(regulation.effectiveDate)}
          </span>
        </Text>
      )}

      {regulation.repealedDate ? (
        <Text marginBottom={3}>
          <strong>{txt('infoboxRepealed')}:</strong>
          <br />
          <span className={RSBStyles.smallText}>
            {formatDate(regulation.repealedDate)}
          </span>
        </Text>
      ) : (
        regulation.lastAmendDate && (
          <Text marginBottom={3}>
            <strong>{txt('infoboxLastAmended')}:</strong>
            <br />
            <span className={RSBStyles.smallText}>
              {formatDate(regulation.lastAmendDate)}
            </span>
          </Text>
        )
      )}

      <Hidden print={true}>
        {/*
          TODO: Add "download as PDF/Doc" link
        */}

        <Text marginBottom={1}>
          <Button
            icon="print"
            iconType="outline"
            size="small"
            type="button"
            variant="text"
            onClick={() => {
              window.print()
            }}
          >
            {txt('printThisVersion')}
          </Button>
        </Text>

        <Text marginBottom={2}>
          <Button
            size="small"
            type="button"
            variant="text"
            onClick={() => {
              showCopyCheck()
              navigator.clipboard.writeText(document.location.href)
            }}
          >
            {txt('copyPermaLink')}
          </Button>{' '}
          {showCopyCheckmark && (
            <span className={s.copiedIndicator} aria-hidden="true">
              ✔
            </span>
          )}
        </Text>
      </Hidden>
    </RegulationsSidebarBox>
  )
}
