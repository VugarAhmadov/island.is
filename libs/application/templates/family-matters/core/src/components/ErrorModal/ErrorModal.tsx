import React, { FC } from 'react'
import {
  Box,
  ModalBase,
  Text,
  Stack,
  GridRow,
  ArrowLink,
} from '@island.is/island-ui/core'
import * as styles from './ErrorModal.treat'

interface LinkProp {
  href: string
  text: string
}

interface Props {
  title: string
  link: LinkProp
  ariaLabel?: string
}

const ErrorModal: FC<Props> = ({ title, ariaLabel, children, link }) => {
  return (
    <ModalBase
      baseId="noChildrenFoundModal"
      initialVisibility={true}
      className={styles.dialog}
      modalLabel={ariaLabel || title}
      hideOnClickOutside={false}
      hideOnEsc={false}
    >
      <Box
        background="white"
        paddingX={[3, 3, 3, 15]}
        paddingY={[7, 7, 7, 12]}
        paddingBottom={7}
        borderRadius="large"
      >
        <Stack space={[5, 5, 5, 7]}>
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {title}
            </Text>
            {children}
          </Stack>
          <GridRow align="flexEnd">
            <ArrowLink href={link.href}>{link.text}</ArrowLink>
          </GridRow>
        </Stack>
      </Box>
    </ModalBase>
  )
}

export default ErrorModal
