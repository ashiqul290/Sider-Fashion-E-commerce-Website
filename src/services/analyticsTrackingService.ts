/**
 * Sider Fashion - Client-Side Analytics & UTM Tracking Service
 * Captures UTM query parameters, tracks funnel events (views, clicks, carts, checkouts),
 * and ensures attribution data is preserved through the entire buyer journey.
 */

export interface UTMData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  trafficSource: string; // 'facebook' | 'instagram' | 'google' | 'tiktok' | 'whatsapp' | 'organic' | 'direct' | 'other'
  landingPage?: string;
  capturedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'product_view' | 'product_click' | 'add_to_cart' | 'checkout_started' | 'order_placed';
  productCode?: string;
  productId?: string;
  productName?: string;
  category?: string;
  value?: number;
  quantity?: number;
  timestamp: string;
  utmData?: UTMData;
}

const UTM_STORAGE_KEY = 'sider_active_utm_v1';
const EVENTS_STORAGE_KEY = 'sider_client_events_v1';

export class AnalyticsTrackingService {
  private static cachedUTM: UTMData | null = null;

  /**
   * Initializes UTM tracking from current URL parameters or referrer
   */
  public static init(): UTMData {
    if (typeof window === 'undefined') {
      return { trafficSource: 'direct', capturedAt: new Date().toISOString() };
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || urlParams.get('source') || urlParams.get('ref') || undefined;
      const utmMedium = urlParams.get('utm_medium') || undefined;
      const utmCampaign = urlParams.get('utm_campaign') || urlParams.get('campaign') || undefined;
      const utmContent = urlParams.get('utm_content') || undefined;
      const utmTerm = urlParams.get('utm_term') || undefined;
      const fbclid = urlParams.get('fbclid');
      const gclid = urlParams.get('gclid');

      // Determine traffic source
      let trafficSource = 'direct';
      const referrer = (document.referrer || '').toLowerCase();
      const currentUrl = window.location.href.toLowerCase();

      if (utmSource) {
        const src = utmSource.toLowerCase();
        if (src.includes('fb') || src.includes('facebook')) trafficSource = 'facebook';
        else if (src.includes('ig') || src.includes('instagram')) trafficSource = 'instagram';
        else if (src.includes('google') || src.includes('adwords')) trafficSource = 'google';
        else if (src.includes('tiktok')) trafficSource = 'tiktok';
        else if (src.includes('wa') || src.includes('whatsapp')) trafficSource = 'whatsapp';
        else if (src.includes('organic')) trafficSource = 'organic';
        else trafficSource = utmSource;
      } else if (fbclid) {
        trafficSource = 'facebook';
      } else if (gclid) {
        trafficSource = 'google';
      } else if (referrer) {
        if (referrer.includes('facebook.com') || referrer.includes('fb.me') || referrer.includes('m.facebook.com')) trafficSource = 'facebook';
        else if (referrer.includes('instagram.com')) trafficSource = 'instagram';
        else if (referrer.includes('google.com') || referrer.includes('google.com.bd')) trafficSource = 'google';
        else if (referrer.includes('tiktok.com')) trafficSource = 'tiktok';
        else if (referrer.includes('whatsapp.com') || referrer.includes('wa.me')) trafficSource = 'whatsapp';
        else if (referrer.includes('bing.com') || referrer.includes('yahoo.com')) trafficSource = 'organic';
        else trafficSource = 'other';
      }

      // If new campaign UTM params detected, update stored attribution
      if (utmSource || utmCampaign || fbclid || gclid) {
        const newUtmData: UTMData = {
          utmSource: utmSource || (fbclid ? 'facebook_ads' : (gclid ? 'google_ads' : undefined)),
          utmMedium: utmMedium || (fbclid || gclid ? 'cpc' : undefined),
          utmCampaign: utmCampaign || (fbclid ? 'fb_lead_campaign' : undefined),
          utmContent,
          utmTerm,
          trafficSource,
          landingPage: window.location.pathname,
          capturedAt: new Date().toISOString()
        };
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtmData));
        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(newUtmData));
        this.cachedUTM = newUtmData;
        return newUtmData;
      }

      // If no new params, retrieve active session attribution
      const saved = sessionStorage.getItem(UTM_STORAGE_KEY) || localStorage.getItem(UTM_STORAGE_KEY);
      if (saved) {
        this.cachedUTM = JSON.parse(saved);
        return this.cachedUTM!;
      }

      const defaultData: UTMData = {
        trafficSource,
        landingPage: window.location.pathname,
        capturedAt: new Date().toISOString()
      };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(defaultData));
      this.cachedUTM = defaultData;
      return defaultData;
    } catch (e) {
      return { trafficSource: 'direct', capturedAt: new Date().toISOString() };
    }
  }

  /**
   * Retrieves active attribution data for attaching to newly placed orders
   */
  public static getActiveAttribution(): UTMData {
    if (this.cachedUTM) return this.cachedUTM;
    return this.init();
  }

  /**
   * Tracks an eCommerce funnel event and syncs to backend
   */
  public static trackEvent(
    type: AnalyticsEvent['type'],
    payload: {
      productCode?: string;
      productId?: string;
      productName?: string;
      category?: string;
      value?: number;
      quantity?: number;
    } = {}
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const utmData = this.getActiveAttribution();
      const event: AnalyticsEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type,
        ...payload,
        timestamp: new Date().toISOString(),
        utmData
      };

      // Save locally
      const localEvents = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
      localEvents.unshift(event);
      if (localEvents.length > 500) localEvents.length = 500;
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(localEvents));

      // Asynchronously push to backend
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event })
      }).catch(() => {
        // Safe silent catch
      });
    } catch (err) {
      // Non-blocking
    }
  }
}
