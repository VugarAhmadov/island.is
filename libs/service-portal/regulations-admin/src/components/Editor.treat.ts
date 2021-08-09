import type { EditorClasses } from '@hugsmidjan/regulations-editor/Editor'
import { style, globalStyle, Style } from 'treat'
import { spacing, theme } from '@island.is/island-ui/theme'
import {
  diffStyling,
  regulationContentStyling,
} from '@island.is/regulations/styling'
const { color, typography, border } = theme

// ---------------------------------------------------------------------------

const highlightAnimation = (): Style => ({
  '@keyframes': {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
  },
  animationDelay: '100ms',
  animationDuration: '200ms',
  animationTimingFunction: 'ease-in-out',
  animationDirection: 'alternate',
  animationIterationCount: 4,
})

// ---------------------------------------------------------------------------

const addLegened = (
  $legend?: string | { value: string },
  $tiny?: boolean,
  $warning?: boolean,
): Style => {
  let color = '#555'
  let backgroundColor = '#dde9cc'

  if ($warning) {
    color = '#700'
    backgroundColor = '#ddcccc'
  }

  const fontSize = $tiny ? '0.5rem' : '0.67rem'

  const content = !$legend
    ? undefined
    : typeof $legend === 'string'
    ? `"${$legend}"`
    : $legend.value

  return {
    position: 'absolute',
    top: '-0.17rem',
    right: '-0.33em', // <-- intentional `em`

    padding: '0 0.33em', // <-- intentional `em`

    pointerEvents: 'none',

    fontSize,
    lineHeight: 1.1,
    fontWeight: 'normal',

    color,
    backgroundColor,
    content,
  }
}

const addWarning = ($legend: Parameters<typeof addLegened>[0]) =>
  addLegened($legend, false, true)

// ===========================================================================

export const classes: EditorClasses = {
  wrapper: style({
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
  }),

  editingpane: style({
    display: 'flex',
    flexFlow: 'column',
    width: '100%',
  }),

  editorBooting: style({
    height: '10em',
  }),

  toolbar: style({
    position: 'sticky',
    top: 0,
    zIndex: 998,

    margin: 0,
    boxShadow: '0 5px 10px -5px rgba(0,0,0, 0.25)',
  }),

  editor: style({
    position: 'relative',
    width: '100%',
  }),

  comparisonpane: style({
    // display: 'flex',
    display: 'none',
    flexFlow: 'column',
    position: 'relative',
    zIndex: 999,
    pointerEvents: 'none',
    width: '100%',
    marginLeft: '-100%',
  }),

  comparisonpaneContainer: style({
    // …
  }),

  headline: style({
    pointerEvents: 'auto',
    marginLeft: 'auto',
    position: 'sticky',
    top: 0,
    zIndex: 10,

    padding: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],

    border: '1px solid',
    borderColor: theme.border.color.standard,

    fontWeight: typography.semiBold,
    lineHeight: '1.4rem',

    backgroundColor: color.white,
    boxShadow: '0 5px 10px 5px rgba(0,0,0, 0.25)',
  }),

  diffmodes: style({
    float: 'right',
  }),

  modeButton: style({
    display: 'inline-block',
    marginLeft: spacing[1],
    fontSize: '.8rem',
    fontWeight: typography.regular,
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  result: style({
    pointerEvents: 'auto',
    marginLeft: 'auto',
    transition: 'opacity 500ms ease-in-out',

    selectors: {
      '&[data-updating]': {
        opacity: 0.33,
      },
    },
  }),

  result_diff: style({
    // …
  }),
  result_base: style({
    // …
  }),
  result_dirty: style({
    // …
  }),

  // ---------------------------------------------------------------------------

  warnings: style({
    marginTop: spacing[1],
    marginBottom: spacing[2],
    paddingTop: spacing[1],
    paddingBottom: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],

    border: '1px solid',
    borderColor: color.yellow400,

    backgroundColor: color.yellow100,
  }),

  warnings__legend: style({
    fontWeight: typography.semiBold,
  }),

  warnings__list: style({
    marginLeft: spacing[2],
    listStyle: 'square',
  }),

  warnings__item: style({
    // …
  }),

  warnings__item_high: style({
    selectors: {
      '&::marker': {
        fontSize: '1.1em',
        color: 'red',
      },
    },
  }),
  warnings__item_medium: style({
    // …
  }),
  warnings__item_low: style({
    // …
  }),

  warnings__viewToggler: style({
    marginLeft: spacing[1],
    fontSize: '0.67em',
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  warnings__instancelist: style({
    padding: spacing[1],
    paddingLeft: spacing[2],
    paddingRight: spacing[2],
    fontSize: '0.8rem',
    listStyle: 'none',
  }),

  warnings__instance: style({
    display: 'inline-block',
  }),

  warnings__instance__button: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    color: color.blue400,

    ':hover': {
      textDecoration: 'underline',
    },
  }),

  warnings__instancelist__morecount: style({
    paddingLeft: spacing[1],
    paddingRight: spacing[1],
    opacity: 0.67,
  }),
}

// ---------------------------------------------------------------------------

globalStyle(`${classes.toolbar}.tox .tox-menu`, {
  width: 'max-content',
})

globalStyle(`${classes.warnings__item_high}::marker`, {
  fontSize: '1.1em',
  color: 'red',
})

// ---------------------------------------------------------------------------
;[classes.editor, classes.result].forEach((wrapper) => {
  const global = regulationContentStyling(wrapper)

  global('table', {
    border: `0 !important`, // Override TinyMCE
  })

  global('th, td', {
    minWidth: '1.5em !important',
    border: `1px solid ${color.dark300} !important`, // Override TinyMCE
  })
  global(
    `
    tr:not(:first-child) > th,
    tr:not(:first-child) > td
    `,
    {
      borderTop: '0 !imporant', // Override TinyMCE
    },
  )
  global(
    `
    tr > th:not(:first-child),
    tr > td:not(:first-child)
    `,
    {
      borderLeft: '0', // Override TinyMCE
    },
  )

  global(
    `
    .layout > * > * > th,
    .layout > * > * > td,
    `,
    {
      border: `2px dashed ${border.color.standard} !important`, // Override TinyMCE
    },
  )

  global('blockquote', {
    marginLeft: '1rem',
    padding: '1rem 1em',
    borderLeft: '0.25em solid rgba(0,0,0, 0.2)',
    backgroundColor: 'rgba(0,0,0, 0.02)',
  })

  global('img', {
    display: 'inline',
    margin: '0.5rem 0.5em',
    maxWidth: 'calc(100% - 0.5em)',
    height: 'auto',
    outline: '0.25em dotted rgba(black, 0.5)',
    outlineOffset: '0.25em',
  })
  global('img:not([alt])', {
    padding: '0.25em',
    border: '0.25em dotted red',
  })

  global('h1, h2, h3, h4, h5, h6', {
    position: 'relative',
    margin: '0 -0.25em',
    marginBottom: '0.75rem',
    padding: '0.75rem 0.5em',
    backgroundColor: 'rgba(0,0,0, 0.1)',
  })
  global(
    `
    h1::before,
    h2::before,
    h3::before,
    h4::before,
    h5::before,
    h6::before
    `,
    addLegened(),
  )
  global('h1::before', { content: '"H1"' })
  global('h2::before', { content: '"H2"' })
  global('h3::before', { content: '"H3"' })
  global('h4::before', { content: '"H4"' })
  global('h5::before', { content: '"H5"' })
  global('h6::before', { content: '"H6"' })

  global('h1', {
    color: 'red',
  })
  global('h2', {
    marginTop: '2.25rem',
  })
  global('h3', {
    marginTop: '2.25rem',
  })

  global('.section__title, .chapter__title, .article__title', {
    marginTop: '3rem',
    marginBottom: '.333rem',
    fontSize: '1.2em',
    fontWeight: typography.headingsFontWeight,
    fontStyle: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgba(102,0,255, 0.06)',
  })
  global('.article__title', {
    marginTop: '0',
    marginBottom: '.75rem',
    fontSize: '1.1em',
    backgroundColor: 'rgba(0,102,255, 0.06)',
  })
  global('.section__title', {
    fontSize: '1.25em',
    backgroundColor: 'rgba(153,0,255, 0.06)',
  })
  global('.section__title::before', {
    content: '"Hluti"',
  })
  global('.chapter__title::before', {
    content: '"Kafli"',
  })
  global('.article__title::before', {
    content: '"Grein"',
  })
  global('.article__title--provisional::before', {
    content: '"Grein (bráðabirgða)"',
  })

  global(
    `
    .chapter__title--appendix,
    .appendix__title,
    section.appendix > *:first-child
    `,
    {
      position: 'relative',
      color: 'red',
      boxShadow: '0 1px 0 0 red',
    },
  )
  global(
    `
    .chapter__title--appendix::after,
    .appendix__title::after,
    section.appendix > *:first-child::after
    `,
    addWarning('Viðauka kafli (færa í viðauka)'),
  )

  global(
    `
    .section__title em,
    .section__title i,
    .chapter__title em,
    .chapter__title i,
    .article__title em,
    .article__title i
    `,
    {
      display: 'block',
      margin: '0 1em',
      fontStyle: 'normal',
      fontWeight: 'normal',
      lineHeight: '2.25rem',
      // border: '1px dotted rgba(0,0,0, 0.3)',
      // borderWidth: '0 3px',
      backgroundColor: 'rgba(0,0,0, 0.04)',
      boxShadow: '0 0 3px 0px white',
    },
  )

  global(
    `
    p.doc__title,
    .Dags,
    .FHUndirskr,
    .Undirritun
    `,
    {
      position: 'relative',
      paddingTop: `0.333rem`,
      boxShadow: `inset -1.5em 0 1em -1em rgba(0,0,0, 0.1)`,
    },
  )
  global(
    `
    p.doc__title::before,
    .Dags::before,
    .FHUndirskr::before,
    .Undirritun::before
    `,
    addLegened({ value: 'attr(class)' }),
  )

  global('.indented', {
    position: 'relative',
    marginLeft: '2em',
  })
  global('.indented::before', addLegened('Inndregin málsgrein'))

  global(
    `
    .footnote,
    .footnote-reference,
    .footnote__marker,
    `,
    { position: 'relative' },
  )
  global('.footnote::before', addLegened('Footnote'))
  global('.footnote-reference::before', addLegened('FR', true))
  global('.footnote__marker::before', addLegened('FM', true))

  global('pre', {
    position: 'relative',
    paddingTop: '.333rem',
    marginBottom: typography.baseLineHeight + 'rem',

    backgroundImage: [
      'linear-gradient(180deg, rgba(0,0,0, 0.05) 1px, transparent 1px)',
      'linear-gradient(90deg, rgba(0,0,0, 0.05) 1px, transparent 1px)',
    ].join(', '),
    backgroundPosition: '-1px -1px',
    backgroundSize: '1em 1em',
    boxShadow: '0 0 3px 0 rgba(0,0,0, 0.2)',
  })
  global('pre::before', addLegened('PRE(ascii art)'))

  global('[data-autogenerated]', {
    position: 'relative',
    backgroundColor: 'rgba(204,153,0, 0.05)',
  })
  global('[data-autogenerated]::before', addLegened('Auto-generated'))

  global(
    `ul[data-autogenerated]::before,
    ol[data-autogenerated]::before`,
    {
      content: '"Auto-generated list"',
    },
  )
  global('[style*="margin-left"]', {
    position: 'relative',
    paddingTop: '.333rem',
    boxShadow: [
      '-2em 0 0 rgba(204,153,0, 0.1)',
      'inset 1em 0 0 rgba(204,153,0, 0.1)',
    ].join(', '),
  })
  global('[style*="margin-left"]::after', addWarning('Spássía'))

  global('span[data-cfemail]', {
    display: 'inline-block',
    padding: '0 0.25em',
    textIndent: 0,
    verticalAlign: 'top',
    backgroundColor: 'red',
    color: 'white',
  })
  global('span[data-legacy-indenter]', {
    display: 'inline-block',
    position: 'relative',
    margin: '0 1px',
    lineHeight: '0.8em',
    textIndent: '0',
    textShadow: '0 0 2px white',
    verticalAlign: 'baseline',
    backgroundColor: 'rgba(204,153,0, 0.1)',
    color: 'rgba(255,0,0, 0.5)',
  })
  global(
    `span[data-legacy-indenter]::before,
    span[data-legacy-indenter]::after`,
    {
      content: '""',
      position: 'absolute',
      top: '-0.3em',
      bottom: '-0.3em',
      margin: '0 -2px',
      width: '0.33em',
      border: '1px solid rgba(0,0,0, 0.25)',
    },
  )
  global('span[data-legacy-indenter]::before', {
    left: 0,
    borderRight: 0,
  })
  global('span[data-legacy-indenter]::after', {
    right: 0,
    borderLeft: 0,
  })
})

// {
//   const editorGlobal = makeGlobal(classes.editor)
// }

globalStyle(`${classes.editor} [data-highighted]`, highlightAnimation())

diffStyling(classes.result)
