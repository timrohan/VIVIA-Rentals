const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-08-01' });

async function createPaymentIntent({ amount, currency = 'usd', metadata = {} }) {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

async function retrieveAccount(accountId) {
  return await stripe.accounts.retrieve(accountId);
}

async function exchangeOAuthCode(code) {
  // Exchange authorization code for connected account tokens
  return await stripe.oauth.token({ grant_type: 'authorization_code', code });
}

async function createTransfer({ amount, currency = 'usd', destination }) {
  return await stripe.transfers.create({
    amount,
    currency,
    destination,
  });
}

module.exports = { createPaymentIntent, retrieveAccount, exchangeOAuthCode, createTransfer };
