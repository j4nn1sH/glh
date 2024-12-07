'use client';

import { login, signup } from './actions';

import { useState } from 'react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(
    'signup'
  );

  return (
    <div className="flex flex-col gap-3 max-w-xs mx-auto mt-12">
      <div
        className={`flex flex-col font-mono ${
          activeTab == 'signup' ? 'flex-row' : 'flex-col-reverse'
        }`}
      >
        <p
          className={`${
            activeTab == 'signup' ? 'text-xl font-bold uppercase' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('signup')}
        >
          Register
        </p>
        <p
          className={`${
            activeTab == 'login' ? 'text-xl font-bold uppercase' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </p>
      </div>
      {activeTab == 'signup' ? <SignupForm /> : <LoginForm />}
    </div>
  );
}

function SignupForm() {
  return (
    <form className="grid grid-cols-2 gap-2">
      <input
        id="first_name"
        name="first_name"
        type="text"
        placeholder="First name..."
        required
      />
      <input
        id="last_name"
        name="last_name"
        type="text"
        placeholder="Last name..."
        required
      />
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email..."
        required
        className="col-span-2"
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password..."
        required
        className="col-span-2"
      />
      <input
        id="confirm-password"
        name="confirm-password"
        type="password"
        placeholder="Confirm password..."
        required
        className="col-span-2"
      />
      <p className="text-sm text-gray-500 col-span-2">
        By registering you agree to our privacy policy and terms of
        use!
      </p>
      <button className="col-span-2" formAction={signup}>
        Continue
      </button>
    </form>
  );
}

function LoginForm() {
  return (
    <form className="grid gap-2">
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email..."
        required
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password..."
        required
      />
      <button formAction={login}>Continue</button>
    </form>
  );
}
