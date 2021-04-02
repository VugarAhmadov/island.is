import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { Button } from '../Button/Button';

const Host = styled.View`
  position: relative;
  flex: 1;
  flex-flow: row;
  width: 100%;
  padding: 15px 15px;
  margin-bottom: 20px;

  border-radius: ${theme.border.radius.large};

  background-color: ${props => props.theme.color.white};
`;

const Left = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  margin-bottom: 8px;

  font-size: 12px;
  font-weight: bold;
  color: ${theme.color.dark400};
`;

const Description = styled.Text`
  margin-bottom: 16px;
  font-size: 16px;
  color: ${theme.color.dark400};
`;

const Right = styled.View`

`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  height: 15px;
  overflow: hidden;

  background-color: ${theme.color.roseTinted100};
  border-bottom-left-radius: ${theme.border.radius.large};
  border-bottom-right-radius: ${theme.border.radius.large};
`;

const Bar = styled.View<{ width?: number}>`
  flex: 1;
  width: ${(props: any) => props.width ?? 0}%;

  background-color: ${theme.color.roseTinted300};
`;

interface StatusCardProps {
  title: string;
  description: string;
  badge?: React.ReactNode;
  progress?: number;
}

export function StatusCard({ title, description, badge, progress }: StatusCardProps) {
  return (
    <Host style={{
      shadowColor: 'rgba(0, 97, 255, 1)',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.04,
      shadowRadius: 8.0,
    }}>
      <Left>
        <Title>
          {title}
        </Title>
        <Description>
          {description}
        </Description>
      </Left>
      <Right>
        {badge}
      </Right>
      <BottomBar>
        <Bar width={progress} />
      </BottomBar>
    </Host>
  )
}