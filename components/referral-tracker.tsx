"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import {
  getUserProfile,
  validateReferralCode,
  trackReferralVisit,
  convertReferralAttribution
} from '@/lib/firebase/services';
import { saveUser, getStoredUser, UserProfile } from '@/lib/utils/auth-store';

export function ReferralTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check for incoming referral code in search parameters
    const handleReferralLanding = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      if (refCode && refCode.trim()) {
        const trimmedCode = refCode.trim();
        
        // If the user is already logged in, do not attribute
        const currentUser = getStoredUser();
        if (currentUser) {
          return;
        }

        try {
          const referrerUid = await validateReferralCode(trimmedCode);
          if (referrerUid) {
            await trackReferralVisit(trimmedCode, referrerUid);
          }
        } catch (err) {
          console.error('Error validating referral code on land:', err);
        }
      }
    };

    handleReferralLanding();

    // 2. Synchronize Firebase Auth changes with LocalStorage and provision new profiles
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch existing profile from Firestore
          let profile = await getUserProfile(user.uid);

          if (!profile) {
            // First time registration: provision their profile doc in Firestore
            const generatedRefCode = `EMP-${user.uid.substring(0, 5).toUpperCase()}`;
            
            // Build new user profile
            const newProfile: UserProfile = {
              uid: user.uid,
              displayName: user.displayName || user.email?.split('@')[0] || 'Trader',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '',
              role: 'trader',
              traderId: generatedRefCode,
              referral_code: generatedRefCode,
              points: 3000, // Initial signup points reward
              accountsPurchased: [],
              country: 'Global',
              bio: 'Registered trader on EMPIRIAL 2.0.',
            };

            // Read pending referral attribution from local storage
            const attributionStr = localStorage.getItem('empirial_attribution');
            if (attributionStr) {
              try {
                const attribution = JSON.parse(attributionStr);
                const { referralCode, referrerUserId } = attribution;
                
                // Self-referral protection
                if (referrerUserId && referrerUserId !== user.uid) {
                  newProfile.referredBy = referrerUserId;
                  newProfile.referralCodeUsed = referralCode;
                }
              } catch (e) {
                console.error('Failed to parse referral attribution:', e);
              }
            }

            // Sync user profile to Firestore users collection
            if (db) {
              await setDoc(doc(db, 'users', user.uid), {
                ...newProfile,
                createdAt: new Date().toISOString()
              });
            }

            // Apply conversion and reward the referrer if attributed
            if (newProfile.referredBy) {
              await convertReferralAttribution(user.uid, newProfile.displayName, newProfile.email);
            }

            profile = newProfile;
          } else {
            // Existing user: Check if there's any pending local referral attribution to resolve
            const attributionStr = localStorage.getItem('empirial_attribution');
            if (attributionStr && !profile.referredBy) {
              try {
                const attribution = JSON.parse(attributionStr);
                const { referralCode, referrerUserId } = attribution;
                
                if (referrerUserId && referrerUserId !== user.uid) {
                  profile.referredBy = referrerUserId;
                  profile.referralCodeUsed = referralCode;
                  
                  // Save updated profile in Firestore
                  if (db) {
                    await setDoc(doc(db, 'users', user.uid), {
                      referredBy: referrerUserId,
                      referralCodeUsed: referralCode
                    }, { merge: true });
                  }
                  
                  // Apply conversion
                  await convertReferralAttribution(user.uid, profile.displayName, profile.email);
                }
              } catch (e) {
                console.error('Failed to parse referral attribution:', e);
              }
            }
          }

          // Save user session to localStorage and trigger dispatch to sync pages
          saveUser(profile);
        } catch (err) {
          console.error('Error synchronizing auth state:', err);
        }
      } else {
        // User logged out
        // Only clear state if they didn't explicitly close out (which logoutUser already handles)
        const loggedOut = localStorage.getItem('empirial_logged_out');
        if (loggedOut === 'true') {
          return;
        }
        
        // Sync null to state
        localStorage.removeItem('empirial_user');
        window.dispatchEvent(new CustomEvent('auth-changed', { detail: null }));
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}

export default ReferralTracker;
