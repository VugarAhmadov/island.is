import { theme } from '@island.is/island-ui/theme'
import { boolean, number, text, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react-native'
import React from 'react'
import { ImageSourcePropType, View } from 'react-native'
import { LicenseType } from '../../../../app/src/types/license-type'
import agencyLogo from '../../assets/card/agency-logo.png'
import illustrationSrc from '../../assets/illustrations/digital-services-m3.png'
import logo from '../../assets/card/logo-64w.png'
import { Badge } from '../Badge/Badge'
import { LicenceCard } from './LicenceCard'
import { NotificationCard } from './NotificationCard'
import { StatusCard } from './StatusCard'
import { WelcomeCard } from './WelcomeCard'

const CenterView = ({ children }: any) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    }}
  >
    {children}
  </View>
)

storiesOf('Cards', module)
  .addDecorator((getStory) => <CenterView>{getStory()}</CenterView>)
  .addDecorator(withKnobs)
  .add('Welcome Card', () => {
    const description = text(
      'Description',
      'Í þessari fyrstu útgáfu af appinu geturðu nálgast rafræn skjöl og skírteini, fengið tilkynningar og séð stöðu umsókna.',
    )
    return (
      <WelcomeCard
        description={description}
        imgSrc={illustrationSrc as ImageSourcePropType}
        backgroundColor={{
          dark: '#1C1D53',
          light: theme.color.purple100,
        }}
      />
    )
  })
  .add('Licence Card', () => {
    const title = text('Licence Card Title', 'Ökuskýrteini')
    return (
      <LicenceCard
        title={title}
        status="Í gildi"
        date="16:24 - 14.03.2022"
        agencyLogo={agencyLogo as ImageSourcePropType}
        type={LicenseType.DRIVERS_LICENSE}
      />
    )
  })
  .add('Notification Card', () => {
    const title = text('Notification Card Title', 'Ökuskýrteini')
    const message = text(
      'Notification Card Message',
      'Skýrteini frá Lögreglusjóra nú aðgengilegt í appinu',
    )
    return (
      <NotificationCard
        id="story-demo"
        icon={logo as ImageSourcePropType}
        date={new Date()}
        title={title}
        message={message}
        unread={boolean('Is Unread', true)}
        onPress={() => console.log('test')}
      />
    )
  })
  .add('Notification Card With Actions', () => {
    const title = text('Notification Card Title', 'Ökuskýrteini')
    const message = text(
      'Notification Card Message',
      'Skýrteini frá Lögreglusjóra nú aðgengilegt í appinu',
    )
    return (
      <NotificationCard
        id="story-demo"
        icon={logo as ImageSourcePropType}
        date={new Date()}
        title={title}
        message={message}
        unread={boolean('Is Unread', true)}
        onPress={() => console.log('test')}
        actions={[{ text: 'Action', onPress: () => console.log('Action press') }]}
      />
    )
  })
  .add('Status Card', () => {
    const title = text('Status Card Title', 'Fæðingarorlof 1/3')
    const description = text('Status Card Description', 'Skipting orlofstíma')
    const badgeTitle = text('Badge Status Card Title', 'Vantar gögn')
    const options = {
      range: true,
      min: 0,
      max: 100,
      step: 20,
    }
    const progress = number('Status Card Progess', 66, options)
    return (
      <StatusCard
        title={title}
        date={new Date()}
        description={description}
        badge={<Badge title={badgeTitle} />}
        progress={progress}
        actions={[{ text: 'Opna umsókn', onPress() {} }]}
      />
    )
  })