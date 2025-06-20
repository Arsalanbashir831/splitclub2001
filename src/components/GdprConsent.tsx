
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Cookie, UserCheck } from 'lucide-react';

interface ConsentState {
  privacy: boolean;
  cookies: boolean;
  marketing: boolean;
}

export const GdprConsent = () => {
  const { user } = useAuthStore();
  const [consents, setConsents] = useState<ConsentState>({
    privacy: false,
    cookies: false,
    marketing: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingConsents, setHasExistingConsents] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingConsents();
    }
  }, [user]);

  const loadExistingConsents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('consent_type, consent_given')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        setHasExistingConsents(true);
        const consentMap = data.reduce((acc, consent) => {
          acc[consent.consent_type as keyof ConsentState] = consent.consent_given;
          return acc;
        }, {} as Partial<ConsentState>);

        setConsents(prev => ({ ...prev, ...consentMap }));
      }
    } catch (error) {
      console.error('Error loading consents:', error);
    }
  };

  const saveConsents = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const consentRecords = Object.entries(consents).map(([type, given]) => ({
        user_id: user.id,
        consent_type: type,
        consent_given: given,
        ip_address: null, // Could be populated from a service
        user_agent: navigator.userAgent
      }));

      const { error } = await supabase
        .from('user_consents')
        .upsert(consentRecords, {
          onConflict: 'user_id,consent_type'
        });

      if (error) throw error;

      setHasExistingConsents(true);
    } catch (error) {
      console.error('Error saving consents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Privacy & Data Preferences</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          We respect your privacy. Please choose how we can use your data.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={consents.privacy}
              onCheckedChange={(checked) => 
                setConsents(prev => ({ ...prev, privacy: !!checked }))
              }
            />
            <div className="space-y-1">
              <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
                Essential Data Processing
              </label>
              <p className="text-xs text-muted-foreground">
                Required for account functionality, deal management, and security.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="cookies"
              checked={consents.cookies}
              onCheckedChange={(checked) => 
                setConsents(prev => ({ ...prev, cookies: !!checked }))
              }
            />
            <div className="space-y-1">
              <label htmlFor="cookies" className="text-sm font-medium cursor-pointer flex items-center space-x-1">
                <Cookie className="h-3 w-3" />
                <span>Analytics Cookies</span>
              </label>
              <p className="text-xs text-muted-foreground">
                Help us improve the platform with anonymous usage analytics.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="marketing"
              checked={consents.marketing}
              onCheckedChange={(checked) => 
                setConsents(prev => ({ ...prev, marketing: !!checked }))
              }
            />
            <div className="space-y-1">
              <label htmlFor="marketing" className="text-sm font-medium cursor-pointer flex items-center space-x-1">
                <UserCheck className="h-3 w-3" />
                <span>Marketing Communications</span>
              </label>
              <p className="text-xs text-muted-foreground">
                Receive updates about new features and special offers.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={saveConsents} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : hasExistingConsents ? 'Update Preferences' : 'Save Preferences'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            You can change these preferences at any time in your profile settings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
