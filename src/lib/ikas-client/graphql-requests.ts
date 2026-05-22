import { gql } from 'graphql-request';

export const GET_MERCHANT = gql`
  query getMerchant {
    getMerchant {
      id
      email
      firstName
      lastName
      storeName
      phoneNumber
      region
      address {
        addressLine1
        city {
          name
        }
        country {
          name
        }
      }
    }
  }
`;

export const GET_AUTHORIZED_APP = gql`
  query getAuthorizedApp {
    getAuthorizedApp {
      id
      salesChannelId
    }
  }
`;

export const GET_MERCHANT_LICENCE = gql`
  query getMerchantLicence {
    getMerchantLicence {
      merchantId
      activeSubscriptionCode
      period
      region
      fromDate
      toDate
      appSubscriptions {
        id
        name
        storeAppId
        storeAppListingSubscriptionId
        storeAppListingSubscriptionKey
        appPaymentKey
        merchantAppPaymentId
        authorizedAppId
        addedDate
        lastPaymentDate
        lastPaymentPrice
        lastPaymentPriceWithTax
        lastPaymentPeriod
        lastPaymentPeriodInDays
        lastPaymentDiscountRatio
        currencyCode
        currencySymbol
        deleted
        createdAt
        updatedAt
      }
    }
  }
`;
