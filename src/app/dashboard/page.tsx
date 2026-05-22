'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TokenHelpers } from '@/helpers/token-helpers';
import { ApiRequests } from '@/lib/api-requests';
import { MerchantAppSubscription } from '@/types/subscription';
import { AppBridgeHelper } from '@ikas/app-helpers';
import HomePage from '../../components/home-page';
import Loading from '@/components/Loading';
import { GetMerchantQueryData } from '@/lib/ikas-client/generated/graphql';

function findActiveAppSubscription(
  subscriptions: MerchantAppSubscription[] | null | undefined
): MerchantAppSubscription | null {
  if (!subscriptions) return null;
  return subscriptions.find((s) => !s.deleted) ?? null;
}

export interface MeData {
  email?: string;
  firstName?: string;
  lastName?: string;
  id?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<GetMerchantQueryData | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [activeSubscription, setActiveSubscription] =
    useState<MerchantAppSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMerchant = useCallback(async (currentToken: string) => {
    try {
      const res = await ApiRequests.ikas.getMerchant(currentToken);
      if (res.status === 200 && res.data?.data?.merchantInfo) {
        setMerchant(res.data.data.merchantInfo);
      }
    } catch (error) {
      console.error('Error fetching merchant:', error);
    }
  }, []);

  /**
   * Checks subscription status via the merchant licence and redirects if none is active.
   */
  const checkSubscription = useCallback(
    async (currentToken: string) => {
      try {
        const res = await ApiRequests.ikas.getMerchantLicence(currentToken);
        if (res.status === 200 && res.data?.data?.licence) {
          const subscription = findActiveAppSubscription(
            res.data.data.licence.appSubscriptions
          );
          if (!subscription) {
            router.push('/subscription');
            return false;
          }
          setActiveSubscription(subscription);
          return true;
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
      return true; // Allow access on error to avoid blocking
    },
    [router]
  );

  /**
   * Initializes the dashboard by fetching the token, checking subscription, and fetching store name.
   */
  const initializeDashboard = useCallback(async () => {
    try {
      const fetchedToken = await TokenHelpers.getTokenForIframeApp();
      setToken(fetchedToken || null);

      if (fetchedToken) {
        await fetchMerchant(fetchedToken);
        try {
          const meData = await AppBridgeHelper.getMeData();
          // getMeData may return a string (email) or an object
          if (typeof meData === 'string') {
            setMe({ email: meData });
          } else if (meData && typeof meData === 'object') {
            setMe(meData as unknown as MeData);
          }
        } catch (error) {
          console.error('Error fetching me data:', error);
        }
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMerchant, checkSubscription]);

  // Close loader on mount
  useEffect(() => {
    AppBridgeHelper.closeLoader();
  }, []);

  // Run initialization on mount
  useEffect(() => {
    initializeDashboard();
  }, [initializeDashboard]);

  if (isLoading) {
    return <Loading />;
  }

  return <HomePage token={token} merchant={merchant} me={me} activeSubscription={activeSubscription} />;
}
