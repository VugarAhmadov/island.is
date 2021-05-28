import React from 'react'
import { FormattedDate } from 'react-intl'
import { Image, ImageSourcePropType, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import timeOutlineIcon from '../../assets/card/time-outline.png'
import { font } from '../../utils/font'

const Host = styled.View`
  width: 100%;
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.standard};
  border-color: ${({ theme }) =>
    theme.isDark ? theme.shade.shade300 : theme.color.blue200};
  margin-bottom: ${({ theme }) => theme.spacing[2]}px;
`

const ActionsContainer = styled.View`
  border-top-width: ${({ theme }) => theme.border.width.standard};
  border-top-color: ${(props) =>
    props.theme.isDark
      ? props.theme.shade.shade300
      : props.theme.color.blue200};
  flex-direction: row;
`

const ActionButton = styled.TouchableOpacity<{ border: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]}px;
  border-left-width: ${({ theme }) => theme.border.width.standard};
  border-left-color: ${(props) =>
    props.border ? props.theme.color.blue200 : props.theme.color.transparent};
`

const ActionText = styled.Text`
  ${font({
    fontWeight: '600',
    color: ({ theme }) => theme.color.blue400,
  })}
  text-align: center;
`

const Title = styled.Text`
  margin-bottom: ${({ theme }) => theme.spacing[1]}px;

  ${font({
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 17,
    color: ({ theme }) => theme.shade.foreground,
  })}
`

const Description = styled.Text`
  ${font({
    fontWeight: '300',
    lineHeight: 24,
    color: ({ theme }) => theme.shade.foreground,
  })}
`

const Content = styled.View`
  padding: ${({ theme }) => theme.spacing[2]}px;
  padding-top: 0px;
`

const Date = styled.View`
  flex-direction: row;
  align-items: center;
`

const DateText = styled.Text`
  ${font({
    fontWeight: '300',
    fontSize: 13,
    lineHeight: 17,
    color: ({ theme }) => theme.shade.foreground,
  })}
`

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]}px;
`

const Bar = styled.View`
  height: 12px;
  padding: 2px;
  overflow: hidden;
  background-color: ${({ theme }) =>
    theme.isDark ? theme.color.roseTinted600 : theme.color.roseTinted200};
  border-radius: 6px;

  margin-top: ${({ theme }) => theme.spacing[2]}px;
`

const Progress = styled.View<{ width?: number }>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;
  border-radius: 6px;

  background-color: ${(props) => props.theme.color.roseTinted400};
`

interface StatusCardProps {
  title: string
  description?: string
  date: Date
  badge?: React.ReactNode
  progress?: number
  actions: Array<{ text: string; onPress(): void }>
  style?: ViewStyle
}

export function StatusCard({
  title,
  description,
  date,
  badge,
  progress,
  actions = [],
  style,
}: StatusCardProps) {
  return (
    <Host style={style as any}>
      <Row>
        <Date>
          <Image
            source={timeOutlineIcon as ImageSourcePropType}
            style={{ width: 16, height: 16, marginRight: 4 }}
          />
          <DateText>
            <FormattedDate value={date} />
          </DateText>
        </Date>
        {badge}
      </Row>
      <Content>
        <Title>{title}</Title>
        {!!description && <Description>{description}</Description>}
        <Bar>
          <Progress width={progress} />
        </Bar>
      </Content>
      {actions.length ? (
        <ActionsContainer>
          {actions.map(({ text, onPress }, i) => (
            <ActionButton onPress={onPress} key={i} border={i !== 0}>
              <ActionText>{text}</ActionText>
            </ActionButton>
          ))}
        </ActionsContainer>
      ) : null}
    </Host>
  )
}