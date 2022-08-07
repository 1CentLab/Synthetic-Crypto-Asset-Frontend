import { Button, Col, Row } from 'antd';
import { useRouter } from 'next/router';
import Querier from '../components/Wallet/Querier';

export default function Index() {
  const router = useRouter();
  return (
    <div className="px-20 flex mt-20" style={{ height: '80vh' }}>
      <Row>
        <Col
          span={12}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '200px' }}
        >
          <div>
            <h1 className="text-7xl mb-10">
              Making{' '}
              <span style={{ color: '#22c55e' }} className="opacity-75">
                “Assets”
              </span>{' '}
              accessible
            </h1>

            <h3 className="text-xl leading-7">
              Owning and processing traditional assets including precious metals, stocks, and real estate has been in
              the hand of the big players long enough. We are here to tokenize them and make Synthetic Crypto Asset
              available to anyone and everyone.
            </h3>
          </div>
          <button
            className="button-submit w-2/4 mt-10 bg-green-500/75 rounded-md h-16 text-2xl text-white shadow-lg"
            onClick={() => {
              router.push('/swap');
            }}
          >
            Buy Now
          </button>{' '}
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <img src="/static/favicon.png"></img>
        </Col>
      </Row>
    </div>
  );
}
