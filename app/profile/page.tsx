import { createClient } from '@/utils/supabase/server';
import { logout } from '../auth/actions';
import { redirect } from 'next/navigation';
import Amount from '../components/amount';

type Balance = {
  store: string;
  paypal: string;
  total_amount: number;
};

export default async function profilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: balances } = await supabase
    .rpc('get_user_balances', {
      req_user_id: user.id,
    })
    .returns<Balance[]>();

  return (
    <div className="max-w-sm mx-auto text-center">
      <h4>PROFILE</h4>
      <p className="font-extralight">
        {user?.user_metadata?.first_name}{' '}
        {user?.user_metadata?.last_name}
      </p>
      <div className="grid gap-3 mx-auto w-[16em] mt-3 ">
        {balances &&
          balances.map((balance, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center justify-center gap-2"
            >
              <p>{balance.store}</p>
              <p className="px-3 text-right">
                {Amount(balance.total_amount)}
              </p>
              {balance.paypal && (
                <a
                  href={'https://paypal.me/' + balance.paypal}
                  className="rounded-full bg-[#003087] px-3 py-2 text-white"
                >
                  PayPal
                </a>
              )}
            </div>
          ))}
      </div>
      <button className="secondary mt-8 w-fit" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
