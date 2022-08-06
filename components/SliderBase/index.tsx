import { Col, InputNumber, Popover, Progress, Row, Slider, Steps, StepsProps } from 'antd';
import { SliderMarks } from 'antd/lib/slider';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import useToken from '../../hooks/useToken';

type Props = {};
export const maxLengthValue = 1000;
const isLessThanZero = (value: number) => {
  return value > 0 ? value : 0;
};
const SliderBase = (props: any) => {
  const [inputValue, setInputValue] = useState(200);
  const { name, setFieldValue, values, goldPrice } = props;

  console.log(values);
  const onChange = (value: number) => {
    console.log(name, value);
    if (value <= 0) {
      return;
    }
    if (isNaN(value)) {
      return;
    }
    setFieldValue(name, value);
    const test = new BigNumber(values['valueMain']).div(goldPrice).div(value).multipliedBy(100).toString();
    setFieldValue('valueSecond', test);
    setInputValue(value);
  };
  const firstwidth = ((isLessThanZero(inputValue) / maxLengthValue) * 100).toString();
  const secondeWidth = ((isLessThanZero(inputValue - 150) / maxLengthValue) * 100).toString();
  const width3 = ((isLessThanZero(inputValue - 200) / maxLengthValue) * 100).toString();

  return (
    <div className="sidebar-base">
      <Row>
        <Col span={16}>
          <div className="relative">
            <Slider
              min={0}
              max={1000}
              onChange={onChange}
              value={typeof inputValue === 'number' ? inputValue : 0}
              step={1}
              {...props}
            ></Slider>
            <div
              className="progress-custom w-full flex absolute"
              style={{ height: '15px', margin: '0px 6px', width: '272px', top: 0 }}
            >
              <div style={{ height: '100%', width: `${firstwidth}%`, maxWidth: '15%', backgroundColor: 'red' }}></div>
              <div
                style={{ height: '100%', width: `${secondeWidth}%`, backgroundColor: 'yellow', maxWidth: '5%' }}
              ></div>
              <div style={{ height: '100%', width: `${width3}%`, backgroundColor: 'blue', maxWidth: '80%' }}></div>
            </div>
          </div>
        </Col>
        <Col span={7}>
          <div className="flex items-center">
            {' '}
            <InputNumber
              name="ratio"
              min={0}
              max={1000}
              style={{ margin: '0 16px' }}
              step={1}
              value={inputValue}
              onChange={onChange}
            />
            (%)
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SliderBase;
