import React, { FC } from 'react'
import { LoadingDots } from '@island.is/island-ui/core'
import * as styles from './DropdownExport.treat'

interface Props {
  title: string
  loading?: boolean
}

const DisabledDropdownItem: FC<Props> = ({ title, loading }) => {
  return (
    <div className={styles.disabledItem}>
      <span>{title}</span>
      {loading && (
        <span className={styles.loadingDots}>
          <LoadingDots />
        </span>
      )}
    </div>
  )
}

export default DisabledDropdownItem
