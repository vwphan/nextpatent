// pages/index.js
import { createUser } from '../lib/mongodb';

const LandingPage = () => {
  // ...

  const handleVerify = async () => {
    // ...
    const user = { phoneNumber, verificationCode };
    const userId = await createUser(user);
    // ...
  };

  return (
    // ...
  );
};
