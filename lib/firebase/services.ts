import { db, storage } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  increment,
  writeBatch,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  Firm, 
  Challenge, 
  Deal, 
  Payout, 
  BrokerSpread, 
  Event, 
  Award, 
  CommunityPost, 
  Review, 
  LoyaltyReward, 
  MarketTicker, 
  BlogPost 
} from '../types';

// Helper to convert Firestore Snapshot to Array of items
const mapSnapshot = <T>(snapshot: any): T[] => {
  return snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
};

// ==========================================
// MEDIA & FILE UPLOADS
// ==========================================
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!storage) throw new Error('Storage is not initialized');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(fileUrl: string): Promise<void> {
  if (!storage) throw new Error('Storage is not initialized');
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image from Storage:', error);
  }
}

// ==========================================
// SITE SETTINGS
// ==========================================
export async function getSiteSettings(): Promise<any> {
  if (!db) return null;
  const docRef = doc(db, 'siteSettings', 'main');
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateSiteSettings(data: any): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'siteSettings', 'main');
  await setDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  }, { merge: true });
}

// ==========================================
// PROP FIRMS
// ==========================================
export async function getFirms(): Promise<Firm[]> {
  if (!db) return [];
  const colRef = collection(db, 'firms');
  const snap = await getDocs(query(colRef, orderBy('name')));
  return mapSnapshot<Firm>(snap);
}

export async function getFirmBySlug(slug: string): Promise<Firm | null> {
  if (!db) return null;
  const colRef = collection(db, 'firms');
  const q = query(colRef, where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Firm);
}

export async function createFirm(firm: Omit<Firm, 'id'> & { id?: string }): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const id = firm.id || firm.name.toLowerCase().replace(/\s+/g, '-');
  const docRef = doc(db, 'firms', id);
  await setDoc(docRef, {
    ...firm,
    id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return id;
}

export async function updateFirm(id: string, firm: Partial<Firm>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'firms', id);
  await updateDoc(docRef, {
    ...firm,
    updated_at: new Date().toISOString()
  });

  // Cascade denormalized data updates to challenges, deals, and payouts
  if (firm.name || firm.logo_url || firm.slug) {
    const batch = writeBatch(db);
    
    // Updates challenges
    const challsSnap = await getDocs(query(collection(db, 'challenges'), where('firm_id', '==', id)));
    challsSnap.forEach((challDoc) => {
      const updates: any = {};
      if (firm.name) updates.firm_name = firm.name;
      if (firm.logo_url) updates.firm_logo = firm.logo_url;
      if (firm.slug) updates.firm_slug = firm.slug;
      batch.update(challDoc.ref, updates);
    });

    // Updates deals
    const dealsSnap = await getDocs(query(collection(db, 'deals'), where('firm_id', '==', id)));
    dealsSnap.forEach((dealDoc) => {
      const updates: any = {};
      if (firm.name) updates.firm_name = firm.name;
      if (firm.logo_url) updates.firm_logo = firm.logo_url;
      if (firm.slug) updates.firm_slug = firm.slug;
      batch.update(dealDoc.ref, updates);
    });

    await batch.commit();
  }
}

export async function deleteFirm(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'firms', id));
  
  // Cascade delete challenges and deals
  const batch = writeBatch(db);
  const challsSnap = await getDocs(query(collection(db, 'challenges'), where('firm_id', '==', id)));
  challsSnap.forEach(d => batch.delete(d.ref));
  const dealsSnap = await getDocs(query(collection(db, 'deals'), where('firm_id', '==', id)));
  dealsSnap.forEach(d => batch.delete(d.ref));
  await batch.commit();
}

// ==========================================
// EVALUATION CHALLENGES
// ==========================================
export async function getChallenges(): Promise<Challenge[]> {
  if (!db) return [];
  const colRef = collection(db, 'challenges');
  const snap = await getDocs(query(colRef, orderBy('price')));
  return mapSnapshot<Challenge>(snap);
}

export async function getChallengesByFirm(firmId: string): Promise<Challenge[]> {
  if (!db) return [];
  const colRef = collection(db, 'challenges');
  const snap = await getDocs(query(colRef, where('firm_id', '==', firmId)));
  return mapSnapshot<Challenge>(snap);
}

export async function createChallenge(challenge: Omit<Challenge, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'challenges'));
  await setDoc(docRef, {
    ...challenge,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateChallenge(id: string, challenge: Partial<Challenge>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'challenges', id);
  await updateDoc(docRef, {
    ...challenge,
    updated_at: new Date().toISOString()
  });
}

export async function deleteChallenge(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'challenges', id));
}

// ==========================================
// DISCOUNT DEALS
// ==========================================
export async function getDeals(): Promise<Deal[]> {
  if (!db) return [];
  const colRef = collection(db, 'deals');
  const snap = await getDocs(query(colRef, orderBy('discount_pct', 'desc')));
  return mapSnapshot<Deal>(snap);
}

export async function createDeal(deal: Omit<Deal, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'deals'));
  await setDoc(docRef, {
    ...deal,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateDeal(id: string, deal: Partial<Deal>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'deals', id);
  await updateDoc(docRef, {
    ...deal,
    updated_at: new Date().toISOString()
  });
}

export async function deleteDeal(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'deals', id));
}

export async function incrementDealClicks(id: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'deals', id);
  await updateDoc(docRef, {
    clicks_count: increment(1)
  });
}

// ==========================================
// PAYOUT PROOFS
// ==========================================
export async function getPayouts(): Promise<Payout[]> {
  if (!db) return [];
  const colRef = collection(db, 'payouts');
  const snap = await getDocs(query(colRef, orderBy('payout_date', 'desc')));
  return mapSnapshot<Payout>(snap);
}

export async function createPayout(payout: Omit<Payout, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'payouts'));
  await setDoc(docRef, {
    ...payout,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updatePayout(id: string, payout: Partial<Payout>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'payouts', id);
  await updateDoc(docRef, {
    ...payout,
    updated_at: new Date().toISOString()
  });
}

export async function deletePayout(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'payouts', id));
}

// ==========================================
// REVIEWS
// ==========================================
export async function getReviews(): Promise<Review[]> {
  if (!db) return [];
  const colRef = collection(db, 'reviews');
  const snap = await getDocs(query(colRef, orderBy('created_at', 'desc')));
  return mapSnapshot<Review>(snap);
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'reviews'));
  await setDoc(docRef, {
    ...review,
    id: docRef.id,
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateReview(id: string, review: Partial<Review>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'reviews', id);
  await updateDoc(docRef, {
    ...review,
    updated_at: new Date().toISOString()
  });
}

export async function deleteReview(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'reviews', id));
}

export async function incrementReviewUpvotes(id: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'reviews', id);
  await updateDoc(docRef, {
    upvotes: increment(1)
  });
}

// ==========================================
// TOURNAMENTS & EVENTS
// ==========================================
export async function getEvents(): Promise<Event[]> {
  if (!db) return [];
  const colRef = collection(db, 'events');
  const snap = await getDocs(query(colRef, orderBy('start_date', 'asc')));
  return mapSnapshot<Event>(snap);
}

export async function createEvent(event: Omit<Event, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'events'));
  await setDoc(docRef, {
    ...event,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'events', id);
  await updateDoc(docRef, {
    ...event,
    updated_at: new Date().toISOString()
  });
}

export async function deleteEvent(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'events', id));
}

// ==========================================
// BLOG POSTS
// ==========================================
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!db) return [];
  const colRef = collection(db, 'blogPosts');
  const snap = await getDocs(query(colRef, orderBy('published_at', 'desc')));
  return mapSnapshot<BlogPost>(snap);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!db) return null;
  const colRef = collection(db, 'blogPosts');
  const q = query(colRef, where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : ({ id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost);
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'blogPosts'));
  await setDoc(docRef, {
    ...post,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'blogPosts', id);
  await updateDoc(docRef, {
    ...post,
    updated_at: new Date().toISOString()
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'blogPosts', id));
}

// ==========================================
// LOYALTY REWARDS
// ==========================================
export async function getLoyaltyRewards(): Promise<LoyaltyReward[]> {
  if (!db) return [];
  const colRef = collection(db, 'loyaltyRewards');
  const snap = await getDocs(query(colRef, orderBy('points_cost', 'asc')));
  return mapSnapshot<LoyaltyReward>(snap);
}

export async function createLoyaltyReward(reward: Omit<LoyaltyReward, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'loyaltyRewards'));
  await setDoc(docRef, {
    ...reward,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateLoyaltyReward(id: string, reward: Partial<LoyaltyReward>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'loyaltyRewards', id);
  await updateDoc(docRef, {
    ...reward,
    updated_at: new Date().toISOString()
  });
}

export async function deleteLoyaltyReward(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'loyaltyRewards', id));
}

// ==========================================
// BROKER SPREADS
// ==========================================
export async function getBrokerSpreads(): Promise<BrokerSpread[]> {
  if (!db) return [];
  const colRef = collection(db, 'brokerSpreads');
  const snap = await getDocs(colRef);
  return mapSnapshot<BrokerSpread>(snap);
}

export async function createBrokerSpread(spread: Omit<BrokerSpread, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'brokerSpreads'));
  await setDoc(docRef, {
    ...spread,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateBrokerSpread(id: string, spread: Partial<BrokerSpread>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'brokerSpreads', id);
  await updateDoc(docRef, {
    ...spread,
    updated_at: new Date().toISOString()
  });
}

export async function deleteBrokerSpread(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'brokerSpreads', id));
}

// ==========================================
// INDUSTRY AWARDS
// ==========================================
export async function getAwards(): Promise<Award[]> {
  if (!db) return [];
  const colRef = collection(db, 'awards');
  const snap = await getDocs(query(colRef, orderBy('year', 'desc')));
  return mapSnapshot<Award>(snap);
}

export async function createAward(award: Omit<Award, 'id'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'awards'));
  await setDoc(docRef, {
    ...award,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return docRef.id;
}

export async function updateAward(id: string, award: Partial<Award>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'awards', id);
  await updateDoc(docRef, {
    ...award,
    updated_at: new Date().toISOString()
  });
}

export async function deleteAward(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'awards', id));
}

export async function submitAwardVote(awardId: string, firmId: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'awards', awardId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;
  
  const awardData = snap.data() as Award;
  const nominees = awardData.nominated_firms.map(n => {
    if (n.firm_id === firmId) {
      return { ...n, votes: n.votes + 1 };
    }
    return n;
  });

  await updateDoc(docRef, {
    nominated_firms: nominees,
    updated_at: new Date().toISOString()
  });
}

// ==========================================
// MARKET TICKERS
// ==========================================
export async function getMarketTickers(): Promise<MarketTicker[]> {
  if (!db) return [];
  const colRef = collection(db, 'marketTickers');
  const snap = await getDocs(colRef);
  return mapSnapshot<MarketTicker>(snap);
}

export async function updateMarketTicker(symbol: string, data: Partial<MarketTicker>): Promise<void> {
  if (!db) return;
  const id = symbol.replace('/', '-');
  const docRef = doc(db, 'marketTickers', id);
  await updateDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  });
}

// ==========================================
// COMMUNITY FORUM POSTS
// ==========================================
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  if (!db) return [];
  const colRef = collection(db, 'communityPosts');
  const snap = await getDocs(query(colRef, orderBy('created_at', 'desc')));
  return mapSnapshot<CommunityPost>(snap);
}

export async function createCommunityPost(post: Omit<CommunityPost, 'id' | 'created_at'>): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const docRef = doc(collection(db, 'communityPosts'));
  await setDoc(docRef, {
    ...post,
    id: docRef.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: []
  });
  return docRef.id;
}

export async function addCommunityComment(postId: string, comment: any): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'communityPosts', postId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return;
  
  const post = snap.data() as CommunityPost;
  const comments = post.comments || [];
  const newComment = {
    id: `comment_${Date.now()}`,
    ...comment,
    created_at: new Date().toISOString().split('T')[0],
    upvotes: 0
  };
  
  await updateDoc(docRef, {
    comments: [...comments, newComment],
    comments_count: increment(1),
    updated_at: new Date().toISOString()
  });
}

export async function deleteCommunityPost(id: string): Promise<void> {
  if (!db) return;
  await deleteDoc(doc(db, 'communityPosts', id));
}

// ==========================
// MOCK PROFILE MIGRATION ASSISTANTS
// ==========================
export async function verifyAdminUser(uid: string): Promise<boolean> {
  if (!db) return false;
  const docRef = doc(db, 'admins', uid);
  const snap = await getDoc(docRef);
  return snap.exists() && snap.data().is_active === true;
}

export async function getPartnerLogos(): Promise<any[]> {
  if (!db) return [];
  const colRef = collection(db, 'partnerLogos');
  const snap = await getDocs(colRef);
  return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getPricingPlans(): Promise<any[]> {
  if (!db) return [];
  const colRef = collection(db, 'pricingPlans');
  const snap = await getDocs(colRef);
  return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getFaqs(): Promise<any[]> {
  if (!db) return [];
  const colRef = collection(db, 'faqs');
  const snap = await getDocs(colRef);
  return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
