import React from 'react'
import styled from 'styled-components/native';
import { theme } from '@island.is/island-ui/theme';
import { ImageSourcePropType } from 'react-native';

const Host = styled.View<{ color: string }>`
  padding: 0 0 32px;
  margin-bottom: 30px;
  margin-left: 16px;
  width: 283px;
  min-height: 460px;

  background-color: ${(props) => props.color};
  border-radius: ${theme.border.radius.large};
`;

const Image = styled.Image`
  width: 100%;
  margin-bottom: -35px;
`;

const Number = styled.Text`
  font-family: 'IBMPlexSans-SemiBold';
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: ${theme.color.purple400};
`;

const TextWrap = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 32px;
  width: 32px;
  margin: 0 auto;
  border: 1px solid ${theme.color.purple300};;
  border-radius: 50px;
`;

const Description = styled.Text`
  font-family: 'IBMPlexSans';
  font-weight: 300;
  padding: 15px 27px 0;
  font-size: 16px;
  line-height: 24px;
  color: ${theme.color.dark400};

  text-align: center;
`;

interface CardProps {
  number: string;
  description?: string;
  backgroundColor?: string;
  imgSrc?: any;
  style?: any;
}

export function Card({ number = '1', description, imgSrc, backgroundColor = '#F8F5FA', style }: CardProps) {
  return (
    <Host color={backgroundColor} style={style}>
      <Image source={imgSrc} />
      <TextWrap>
        <Number>
          {number}
        </Number>
      </TextWrap>
      <Description>
        {description}
      </Description>
    </Host>
  )
}
