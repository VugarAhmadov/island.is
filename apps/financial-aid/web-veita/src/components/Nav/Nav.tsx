import React, { useContext } from 'react'
import { Logo, Text, Box, Divider, Icon } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  LogoHfj,
  Button,
} from '@island.is/financial-aid-web/veita/src/components'

import * as styles from './Nav.treat'
import cn from 'classnames'
import { ApplicationFiltersContext } from '@island.is/financial-aid-web/veita/src/components/ApplicationFiltersProvider/ApplicationFiltersProvider'

import { useLogOut } from '@island.is/financial-aid-web/veita/src/utils/useLogOut'
import { ApplicationState } from '@island.is/financial-aid/shared'

import { navigationItems } from '@island.is/financial-aid-web/veita/src/utils/navigation'

import { NavigationElement } from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'

const Nav = () => {
  const router = useRouter()

  const logOut = useLogOut()

  const { applicationFilters } = useContext(ApplicationFiltersContext)
  const { admin } = useContext(AdminContext)

  return (
    <nav className={styles.container}>
      <header>
        <div className={`${styles.logoContainer} logoContainer`}>
          <Logo />
        </div>
        <div className={styles.logoHfjContainer}>
          <Box className={`logoHfj`}>
            <LogoHfj />
          </Box>

          <Box paddingLeft={2} className={'headLine'}>
            <Text as="h1" lineHeight="sm">
              <strong>Sveita</strong> • Umsóknir um fjárhagsaðstoð
            </Text>
          </Box>
        </div>
      </header>

      <div>
        {navigationItems.map((item: NavigationElement, index: number) => {
          return (
            <Link href={item.link} key={'NavigationLinks-' + index}>
              <a
                aria-label={item.label}
                className={cn({
                  [`${styles.link}`]: true,
                  [`${styles.activeLink}`]: router.pathname === item.link,
                  [`${styles.linkHoverEffect}`]: router.pathname !== item.link,
                })}
              >
                <Box display="flex" justifyContent="spaceBetween">
                  <Text fontWeight="semiBold">{item.label}</Text>
                  <Text fontWeight="semiBold" color="dark300">
                    {item.applicationState
                      .map((state: ApplicationState) => {
                        if (applicationFilters) {
                          return applicationFilters[state]
                        }
                      })
                      .reduce((a?: number, b?: number) => {
                        if (a && b) {
                          return a + b
                        }
                        return 0
                      })}
                  </Text>
                </Box>
              </a>
            </Link>
          )
        })}
      </div>

      <Box display="block" marginBottom={2} marginTop={4}>
        <Box marginBottom={3}>
          <button
            className={` ${styles.logOutButton} logOutButtonHover`}
            onClick={() => logOut()}
          >
            <Icon
              icon="logOut"
              type="outline"
              color="blue400"
              className={styles.logOutButtonIcon}
            />
            <Text> Útskráning</Text>
          </button>
        </Box>
        <Divider weight="purple200" />
        {admin && (
          <>
            <Box display="flex" alignItems="center" paddingTop={3}>
              <Icon
                icon="person"
                color="purple400"
                size="small"
                className={styles.personIcon}
              />
              <Text variant="small">{admin?.name}</Text>
            </Box>
          </>
        )}
      </Box>
    </nav>
  )
}

export default Nav
