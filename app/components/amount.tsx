export default function Amount(amount: number) {
  if (amount >= 0) {
    return (
      <span className="text-green-500">{amount.toFixed(2)}€</span>
    );
  } else {
    return <span className="text-red-500">{amount.toFixed(2)}€</span>;
  }
}
