import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const buttonWrapper = style({
  zIndex: 1,
  position: 'relative',
})

export const disabledItem = style({
  position: 'relative',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  width: 'full',
  fontSize: 14,
  lineHeight: 1.5,
  fontWeight: 600,
  color: theme.color.blue300,
  boxShadow: `0 1px 0 0 ${theme.color.blue100}`,
})

export const loadingDots = style({
  position: 'absolute',
  bottom: '2px',
})
