import React from 'react';
import { CheckCircle2, Crown, Mail, Phone, MapPin, User } from 'lucide-react';
import { MerchantAppSubscription } from '@/types/subscription';
import { GetMerchantQueryData, SubscriptionPeriodEnum } from '@/lib/ikas-client/generated/graphql';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MeData } from '@/app/dashboard/page';

const PERIOD_LABELS: Record<SubscriptionPeriodEnum, string> = {
  [SubscriptionPeriodEnum.MONTHLY]: 'monthly',
  [SubscriptionPeriodEnum.YEARLY]: 'annual',
  [SubscriptionPeriodEnum.ONE_TIME]: 'one-time',
};

interface HomePageProps {
  token: string | null;
  merchant?: GetMerchantQueryData | null;
  me?: MeData | null;
  activeSubscription?: MerchantAppSubscription | null;
}

const HomePage: React.FC<HomePageProps> = ({ token, merchant, me, activeSubscription }) => {
  if (!token) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
        <div className="text-center p-20 bg-muted rounded-xl border border-dashed">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground">Please authenticate to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const fullName = [merchant?.firstName, merchant?.lastName].filter(Boolean).join(' ');
  const location = [merchant?.address?.city?.name, merchant?.address?.country?.name]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-background min-h-[100vh]">
      <div className="text-center mb-8">
        <CheckCircle2 className="mx-auto text-green-600" size={56} />
        <h2 className="mt-4 text-2xl font-semibold tracking-tight">Welcome to Your Dashboard!</h2>
        <p className="mt-2 text-muted-foreground">
          You are authenticated to{' '}
          <span className="font-medium">{merchant?.storeName}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">

        {me && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                Logged In User
              </CardTitle>
              <CardDescription>Currently viewing this app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(me.firstName || me.lastName) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{[me.firstName, me.lastName].filter(Boolean).join(' ')}</span>
                </div>
              )}
              {me.email && (
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Email:
                  </span>
                  <span className="font-medium text-sm">{me.email as string}</span>
                </div>
              )}
              <div className="mt-2 text-xs text-muted-foreground break-all bg-muted rounded p-2">
                raw: {JSON.stringify(me)}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Store Owner
            </CardTitle>
            <CardDescription>Merchant profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {fullName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{fullName}</span>
              </div>
            )}
            {merchant?.email && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> Email:
                </span>
                <span className="font-medium text-sm">{merchant.email}</span>
              </div>
            )}
            {merchant?.phoneNumber && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" /> Phone:
                </span>
                <span className="font-medium">{merchant.phoneNumber}</span>
              </div>
            )}
            {location && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> Location:
                </span>
                <span className="font-medium">{location}</span>
              </div>
            )}
            {merchant?.storeName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Store:</span>
                <span className="font-medium">{merchant.storeName}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {activeSubscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Active Subscription
              </CardTitle>
              <CardDescription>Your current plan details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{activeSubscription.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                {activeSubscription.lastPaymentDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Payment:</span>
                    <span className="font-medium">
                      {new Date(activeSubscription.lastPaymentDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    {activeSubscription.lastPaymentPrice}{' '}
                    {activeSubscription.currencyCode ?? ''} /{' '}
                    {PERIOD_LABELS[activeSubscription.lastPaymentPeriod]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomePage;
