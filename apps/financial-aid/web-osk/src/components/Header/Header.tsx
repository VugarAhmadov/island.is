import React, { useContext } from 'react'
import {
  Logo,
  Text,
  Box,
  Button,
  GridContainer,
  DropdownMenu,
} from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import * as styles from './Header.treat'

import { UserContext } from '@island.is/financial-aid-web/osk/src/components/UserProvider/UserProvider'
import { useLogOut } from '@island.is/financial-aid-web/osk/src/utils/useLogOut'

const Header = () => {
  const { isAuthenticated, user } = useContext(UserContext)

  const logOut = useLogOut()

  return (
    <GridContainer>
      <header className={`${styles.header}`}>
        <Box display="flex" height="full" alignItems="center">
          <Link href="/" data-testid="link-to-home">
            <Box
              display="flex"
              alignItems="center"
              cursor="pointer"
              marginRight={[0, 0, 4]}
            >
              <div className={styles.islandIsApplicationLogoWrapper}>
                <Logo width={146} />
              </div>

              <div className={styles.islandIsApplicationLogoIconWrapper}>
                <Logo width={40} iconOnly />
              </div>
            </Box>
          </Link>

          <Box
            display="flex"
            height="full"
            flexDirection="column"
            justifyContent="center"
            className={styles.headerTextWrapper}
            paddingLeft={[2, 2, 4]}
          >
            <Text fontWeight="semiBold" variant="small">
              Hafnarfjörður
            </Text>

            <span className={styles.desktopText}>
              <Text>Umsókn um fjárhagsaðstoð</Text>
            </span>

            <span className={styles.mobileText}>
              <Text>Fjárhagsaðstoð</Text>
            </span>
          </Box>
        </Box>

        <Box className={styles.dropdownMenuWrapper}>
          {isAuthenticated && (
            <DropdownMenu
              icon="chevronDown"
              items={[
                {
                  href: 'https://island.is/innskraning',
                  title: 'Mínar síður',
                },
                {
                  onClick: () => {
                    logOut()
                  },
                  title: 'Útskráning',
                },
              ]}
              title={user?.name}
            />
          )}
        </Box>
      </header>
    </GridContainer>
  )
}

export default Header
