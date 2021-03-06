import {
  getOr,
} from 'lodash/fp';

import Moment from 'moment';

import {
  createSelector,
} from 'reselect';

export const createLoad = ({
  amount,
  created,
  currency,
  dedupe_id,
  description,
  id,
  is_load,
  local_amount,
  local_currency,
  settled,
}) => ({
  amount: Math.abs(amount / 100),
  currency,
  date: new Moment(settled || created),
  description,
  dupeId: dedupe_id,
  id,
  load: is_load,
  localAmount: Math.abs(local_amount / 100), // eslint-disable-line camelcase
  localCurrency: local_currency,
});

export const createTransaction = ({
  amount,
  created,
  currency,
  decline_reason,
  dedupe_id,
  description,
  id,
  is_load,
  local_amount,
  local_currency,
  merchant,
  settled,
}) => ({
  amount: Math.abs(amount / 100),
  currency,
  date: new Moment(settled || created),
  decline: !!decline_reason, // eslint-disable-line camelcase
  declineReason: decline_reason,
  description: merchant.name || description,
  dupeId: dedupe_id,
  id,
  load: is_load,
  localAmount: Math.abs(local_amount / 100), // eslint-disable-line camelcase
  localCurrency: local_currency,
  merchant,
});

export const getTransactions = createSelector(
  getOr([], 'transactions.data'),
  transactions => transactions.slice().reverse().map((transaction) => {
    switch (transaction.is_load) {
      case true: {
        return createLoad(transaction);
      }
      default: {
        return createTransaction(transaction);
      }
    }
  })
);
