import Querier from "../components/Wallet/Querier"

export default function Index() {
  return (
    <div style={{padding:"20px"}}>
      <h3> Balance</h3>
      <Querier/>
    </div>
  );
}