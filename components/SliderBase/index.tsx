import { Col, InputNumber, Popover, Progress, Row, Slider, Steps, StepsProps } from 'antd';
import { SliderMarks } from 'antd/lib/slider';
import React, { useState } from 'react';

type Props = {};

const { Step } = Steps;
const customDot: StepsProps['progressDot'] = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);
const SliderBase = (props: any) => {
  const [inputValue, setInputValue] = useState(0);
  const { name, setFieldValue, marks } = props;
  const progress = inputValue / 10;
  console.log(inputValue, progress);
  const onChange = (value: number) => {
    if (isNaN(value)) {
      return;
    }
    setFieldValue(name, value);
    setInputValue(value);
  };
  const firstwidth = () => {
    return (inputValue / 15) * 10;
  };
  const secondWidth = () => {
    return firstwidth() - (progress * 100) / 20;
  };
  console.log(firstwidth());
  return (
    <div className="sidebar-base">
      {/* <div className="base-tooltip"></div>
      <div className="custom-slider">
        <div className="progress">
          <div className="progress__red" style={{ width: '16%' }}></div>
          <div className="progress__yellow" style={{ width: '2%' }}></div>
          <div className="progress__blue" style={{ width: '82%' }}></div>
        </div>
      </div> */}
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
              className="progress w-full flex absolute"
              style={{ height: '8px', margin: '10px 6px 10px', backgroundColor: 'yellow', width: '272px' }}
            >
              <div style={{ height: '100%', width: firstwidth(), maxWidth: '15%', backgroundColor: 'red' }}></div>
              {/* <div style={{ height: '100%', width: '5%', backgroundColor: 'yellow', maxWidth: '20%' }}></div>
              <div style={{ height: '100%', width: '80%', backgroundColor: 'blue' }}></div> */}
            </div>
          </div>
        </Col>
        <Col span={4}>
          <InputNumber
            name="ratio"
            min={0}
            max={1}
            style={{ margin: '0 16px' }}
            step={1}
            value={inputValue}
            onChange={onChange}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SliderBase;
