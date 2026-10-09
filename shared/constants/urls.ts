// API Endpoints Constants

// Registration endpoints
export const registerCompany: string = "/register/company";
export const registerFreeLancer: string = "/register/freelancer";
export const registerUser: string = "/register/consumer";

// OTP and verification
export const send_otp: string = "/otp/resend";
export const verify_account: string = "/otp/verify";
export const passwordForget: string = `/password/forgot`;
export const passwordVerifyOtp: string = `/password/verify-otp`;
export const VerifyCode: string = `/verify_code`;
export const ResetPasswordUrl: string = `/password/reset`;
export const DeleteAccountUrl: string = "/account/delete";
export const ChangePasswordUrl: string = "/password/change";

// Profile endpoints
export const profileUrl: string = `/profile`;
export const updateUserProfile: string = `/update-profile`;
export const updateProfileImage: string = `/profile-photo`;
export const deleteProfileImage: string = `/delete-photo`
export const updateUserRole: string = `/update-role`;
export const updateCompanyProfile: string = `/update-company-profile`;
export const sheradPage: string = "/shared/view-policy";
export const getProfessions: string = "/shared/professions";

// Pages
export const indexPage: string = "/index-page";
export const selectCatPage: string = "/categories/select-category";
export const categories: string = "/categories";

export const homePage: string = "/home-page";
export const getFavourites: string = "/favourites";
export const favToggle: string = "/favourites/toggle";
export const contactUs: string = "/shared/contact-message";
export const getCountry: string = "/shared/countries";
export const getRegionsByCountry: string = "/shared/regions";

// Advertisements
export const getAds: string = "/advertisements";
export const deleteAds: string = "/advertisements/delete";
export const deleteAdsImage: string = "/advertisements/delete-image";
export const createAds: string = "/advertisements/create";
export const updateAds: string = "/advertisements/update";
export const myAds: string = "/advertisements/get-by-user";
export const getAdsDetails: string = "/advertisements/details";


// Jobs
export const getJobs: string = "/jobs";
export const deleteJobs: string = "/jobs/delete";
export const switchActivationJobs: string = "/jobs/switch-activation";
export const createJobs: string = "/jobs/create";
export const updateJobs: string = "/jobs/update";
export const myJobs: string = "/jobs/get-by-user";
export const getJobsDetails: string = "/jobs/details";

// Auctions
export const getAuctions: string = "/auctions";
export const deleteAuctions: string = "/auctions/delete";
export const switchActivationAuctions: string = "/auctions/switch-activation";
export const createAuctions: string = "/auctions/create";
export const updateAuctions: string = "/auctions/update";
export const myAuctions: string = "/auctions/get-by-user";
export const getAuctDetails: string = "/auctions";
export const getAllBid: string = "/auctions/get-bids";
export const submitBid: string = "/auctions/submit-bid";

// Profile
export interface ProfileEndpoints {
  getMYInfo: string;
}

export const PROFILE_ENDPOINT: ProfileEndpoints = {
  getMYInfo: "/chat/get-my-info",
};

// Reels
export interface ReelEndpoints {
  showAll: string;
  showById: (id: string | number) => string;
}

export const REEL_ENDPOINT: ReelEndpoints = {
  showAll: "/reels/index",
  showById: (id: string | number) => `/reels/show/${id}`,
};

export const reelUrl: string = "/reels";
export const reelsIndexUrl = (currentPage: number): string =>
  `/reels/index?per_page=9&current_page=${currentPage}`;
export const reelComments = (reelId: string | number): string => `/reels/${reelId}/comments`;
export const reelToggleReaction = (reelId: string | number): string =>
  `/reels/${reelId}/toggle-reaction`;
export const reelReactions = (reelId: string | number): string => `/reels/${reelId}/reactions`;

// Chat
export const getInfoChat: string = "/chat/get-my-info";
export const startConversationUrl: string = "/chat/start-conversation";
export const getMessagesUrl: string = "/chat/messages";
export const sendMessagesUrl: string = "/chat/send-message";
export const getConversationsUrl: string = "/chat/get-conversations";

// Channels
export interface ChannelEndpoints {
  create: string;
  update: (id: string | number) => string;
  join: (id: string | number) => string;
  leave: (id: string | number) => string;
  delete: (id: string | number) => string;
  addMember: (id: string | number) => string;
  removeMember: (id: string | number) => string;
  sendMessage: string;
  getMessages: (id: string | number) => string;
  myChannels: string;
  publicChannels: string;
  details: (id: string | number) => string;
  member: (id: string | number) => string;
  memberRequest: (id: string | number) => string;
}

export const CHANNEL_ENDPOINTS: ChannelEndpoints = {
  create: "/channels/create",
  update: (id: string | number) => `/channels/update/${id}`,
  join: (id: string | number) => `/channels/join/${id}`,
  leave: (id: string | number) => `/channels/leave/${id}`,
  delete: (id: string | number) => `/channels/delete/${id}`,
  addMember: (id: string | number) => `/channels/add-member/${id}`,
  removeMember: (id: string | number) => `/channels/remove-member/${id}`,
  sendMessage: "/channels/send-message",
  getMessages: (id: string | number) => `/channels/messages/${id}`,
  myChannels: "/channels/my-channels",
  publicChannels: "/channels/public-channels",
  details: (id: string | number) => `/channels/details/${id}`,
  member: (id: string | number) => `/channels/members/${id}`,
  memberRequest: (id: string | number) => `/channels//member-requests/${id}`,
};

// Referrals
export const getInvintLink: string = "/referrals/get-invite-link";
export const claimCeward: string = "/referrals/claim-reward";
export const getBalance: string = "/referrals/balance";

// Community
export const postUrl: string = "/posts";
export const postsUrl = (id: string | number): string => `/posts/${id}`;
export const myPostUrl: string = "/posts/my-posts";
export const postIndexUrl: string = "/posts/index";
export const allCommentsUrl = (postId: string | number): string => `/comments/post/${postId}/comments`;
export const createCommentUrl = (postId: string | number): string => `/posts/${postId}/comments`;
export const commentsReply = (commentId: string | number): string => `/comments/${commentId}/replies`;
export const commentUrl = (id: string | number): string => `/comments/${id}`;
export const comments: string = "/comments";

export const getTopLevelComments = (postId: string | number): string =>
  `posts/${postId}/top-level-comments`;

export const getPostReactions = (postId: string | number): string =>
  `/reactions/post/${postId}/reactions`;
export const getPostReactionsByType = (postId: string | number, type: string): string =>
  `/reactions/post/${postId}/type/${type}`;
export const getPostById = (postId: string | number): string => `/posts/show/${postId}`;
export const reactionToggle = (postId: string | number): string => `/reactions/post/${postId}/toggle`;
// reaction Posts
export const reactionsUrl: string = "/reactions";

// Stories
export const storiesUrl: string = "/stories";
export const myStoriesUrl: string = "/stories/my-stories";
export const allStories: string = "/stories/all";

export interface StoriesEndpoints {
  activeStories: string;
  myStories: string;
  allStories: string;
}

export const STORIES_ENDPOINTS: StoriesEndpoints = {
  activeStories: "/stories/all",
  myStories: "/stories/my-stories",
  allStories: "/stories",
};

export interface DevicesEndpoints {
  devices: string;
  revokeDevice: (id: string | number) => string;
  revokeAll: string;
}

export const DEVIECES_ENDPOINT: DevicesEndpoints = {
  devices: `/devices`,
  revokeDevice: (id: string | number) => `/devices/revoke-device/${id}`,
  revokeAll: `/devices/revoke-all-devices`,
};

// Products
export interface ProductsEndpoints {
  details: (id: string | number) => string;
  detailsUser: (id: string | number) => string;
  getByStore: (id: string | number) => string;
  createProduct: string;
  deleteProduct: (id: string | number) => string;
  updateProduct: (id: string | number) => string;
  switchActivation: (id: string | number) => string;
  dublicate: (id: string | number) => string;
  relatedProductsByMainProduct: (id: string | number) => string;
  productVariants: (id: string | number) => string;
  getAll: string;
}

export const PRODUCTS_ENDPOINT: ProductsEndpoints = {
  details: (id: string | number) => `/products/show/${id}`,
  detailsUser: (id: string | number) => `/products/details/${id}`,
  getByStore: (id: string | number) => `/products/get-by-store/${id}`,
  createProduct: `/products/create`,
  deleteProduct: (id: string | number) => `/products/delete/${id}`,
  updateProduct: (id: string | number) => `/products/update/${id}`,
  switchActivation: (id: string | number) => `/products/switch-activation/${id}`,
  dublicate: (id: string | number) => `/products/duplicate/${id}`,
  relatedProductsByMainProduct: (id: string | number) => `/products/related-products/${id}`,
  productVariants: (id: string | number) => `/products/variants/${id}`,
  getAll: `/products`
};

export interface FlashSaleEndpoints {
  create: string;
  getByStore: (id: string | number) => string;
  getDetails: (id: string | number) => string;
  delete: string;
  update: (id: string | number) => string;
}

export const FLASHSELL_ENDPOINT: FlashSaleEndpoints = {
  create: `/flash-sales/create`,
  getByStore: (id: string | number) => `/flash-sales/by-store/${id}`,
  getDetails: (id: string | number) => `/flash-sales/flash-sale/${id}`,
  delete: `/flash-sales/delete`,
  update: (id: string | number) => `/flash-sales/update/${id}`,
};

export interface CouponsEndpoints {
  getByStore: (id: string | number) => string;
  getDetails: (id: string | number) => string;
  delete: string;
  create: string;
}

export const COUPONS_ENDPOINT: CouponsEndpoints = {
  getByStore: (id: string | number) => `/coupons/get-by-store/${id}`,
  getDetails: (id: string | number) => `/coupons/show/${id}`,
  delete: `/coupons/delete`,
  create: `/coupons/create`,
};

export interface StoreEndpoints {
  getUserStores: string;
  getTrashedStores: string;
  createStore: string;
  getStoreDetails: (id: string | number) => string;
  updateStore: (id: string | number) => string;
  updateStoreLogo: (id: string | number) => string;
  deleteStoreLogo: string;
  deleteStore: string;
  restoreStore: (id: string | number) => string;
  deactiveStore: (id: string | number) => string;
  forceDeleteStore: string;
  storePolicies: (id: string | number, type: string) => string;
  updateStorePolicy: string;
  getWithChildrens: string;
  sendInvitations: string;
  previewInvitations: (token: string) => string;
  acceptInvitations: (token: string) => string;
  revokeInvitations: (id: string | number) => string;
  resendInvitation: string;
  showMember: (id: string | number) => string;
  getMembers: (id: string | number) => string;
  updateRole: (id: string | number) => string;
  removeMember: string;
  restoreMember: (id: string | number) => string;
  getItems: (id: string | number) => string;
  exportVariants: string;
  importVariants: string;
}

export const STORE_ENDPOINT: StoreEndpoints = {
  getUserStores: "/stores/get-by-user",
  getTrashedStores: "/stores/get-deleted-by-user",
  createStore: "/stores/create",
  getStoreDetails: (id: string | number) => `/stores/show/${id}`,
  updateStore: (id: string | number) => `/stores/update/${id}`,
  updateStoreLogo: (id: string | number) => `/stores/uploade-image/${id}`,
  deleteStoreLogo: `/stores/delete-image`,
  deleteStore: `/stores/delete`,
  restoreStore: (id: string | number) => `/stores/restore/${id}`,
  deactiveStore: (id: string | number) => `/stores/switch-activation/${id}`,
  forceDeleteStore: `/stores/force-delete`,
  storePolicies: (id: string | number, type: string) => `/policies?store_id=${id}&type=${type}`,
  updateStorePolicy: "/policies/update-policy",
  // categories end point :
  getWithChildrens: "/categories/get-with-childrens",
  // store member
  sendInvitations: "/stores/invitations/send",
  previewInvitations: (token: string) => `/stores/invitations/preview/${token}`,
  acceptInvitations: (token: string) => `/stores/invitations/accept/${token}`,
  revokeInvitations: (id: string | number) => `/stores/invitations/revoke/${id}`,
  resendInvitation: `/stores/invitations/resend`,
  showMember: (id: string | number) => `/stores/members/show/${id}`,
  getMembers: (id: string | number) => `/stores/members/${id}`,
  updateRole: (id: string | number) => `/stores/members/update-role/${id}`,
  removeMember: `/stores/members/remove`,
  restoreMember: (id: string | number) => `/stores/members/restore/${id}`,
  // inventory
  getItems: (id: string | number) => `/inventory/get-by-store/${id}`,
  exportVariants: `/inventory/import`,
  importVariants: `/inventory/export`,
};

export interface PackagesEndpoints {
  getByStore: (id: string | number) => string;
  create: (id: string | number) => string;
  update: (id: string | number) => string;
  getDetails: (id: string | number) => string;
  toggleActivation: (id: string | number) => string;
  delete: string;
}

export const PACKAGES_ENDPOINT: PackagesEndpoints = {
  getByStore: (id: string | number) => `/packages/store/${id}/list`,
  create: (id: string | number) => `/packages/product/${id}/create`,
  update: (id: string | number) => `/packages/update/${id}`,
  getDetails: (id: string | number) => `/packages/details/${id}`,
  toggleActivation: (id: string | number) => `/packages/toggle-activation/${id}`,
  delete: "/packages/delete",

};

export interface OrdersEndpoints {
  getByStore: (id: string | number) => string;
  statisticsByStore: (id: string | number) => string;
  details: (id: string | number) => string;
  getMyOrder: string;
  checkCoupon: string;
}

export const ORDERS_ENDPOINT: OrdersEndpoints = {
  getByStore: (id: string | number) => `/orders/get-by-store/${id}`,
  statisticsByStore: (id: string | number) => `/statistics/orders/by-store/${id}`,
  details: (id: string | number) => `/orders/details/${id}`,
  //user 
  getMyOrder: "/orders",
  checkCoupon: "/orders/check-coupon"
};

export interface AddressesEndpoints {
  getAll: string;
  add: string;
  delelte: string;
  update: (id: string | number) => string;
}

export const ADDRESSES_ENDPOINT: AddressesEndpoints = {
  getAll: "/addresses",
  add: "/addresses/add",
  delelte: "/addresses/remove",
  update: (id: string | number) => `/addresses/update/${id}`,
};

export interface SupportTicketsEndpoints {
  getListTiketes: (id: string | number) => string;
  replyTikets: (id: string | number) => string;
  resolveTikets: (id: string | number) => string;
  escalateTikets: (id: string | number) => string;
  showDetialsTiket: (id: string | number) => string;

  //user 
  createTikets: string;
  showUserDetialsTiket: (id: string | number) => string;
  getIssueType: string;
  getMyTikets: string;
}

export const Support_Tikctes: SupportTicketsEndpoints = {
  getListTiketes: (id: string | number) => `/support-tickets/get-by-store/${id}`,
  replyTikets: (id: string | number) => `/support-tickets/reply/${id}`,
  resolveTikets: (id: string | number) => `/support-tickets/resolve/${id}`,
  escalateTikets: (id: string | number) => `/support-tickets/escalate/${id}`,
  showDetialsTiket: (id: string | number) => `/support-tickets/show/${id}`,

  //user 
  createTikets: `/tickets/create`,
  showUserDetialsTiket: (id: string | number) => `/tickets/show/${id}`,
  getIssueType: `/support-tickets/issue-types`,
  getMyTikets: `/tickets/my`,
};

export interface SlaRulesEndpoints {
  viewStoreSla: (id: string | number) => string;
  createRule: string;
  deleteRule: string;
  viewRuleDetails: (id: string | number) => string;
}

export const SLA_RULES: SlaRulesEndpoints = {
  viewStoreSla: (id: string | number) => `/sla-rules/${id}`,
  createRule: `/sla-rules/create`,
  deleteRule: `/sla-rules/delete`,
  viewRuleDetails: (id: string | number) => `/sla-rules/show/${id}`,
};

export interface UserStoresEndpoints {
  getDetails: (id: string | number) => string;
  categories: (id: string | number) => string;
  discountProducts: (id: string | number) => string;
  bestSeller: (id: string | number) => string;
  suggestedProducts: (id: string | number) => string;
}

export const USER_STORES_ENDPOINT: UserStoresEndpoints = {
  getDetails: (id: string | number) => `/stores/details/${id}`,
  categories: (id: string | number) => `/stores/categories/${id}`,
  discountProducts: (id: string | number) => `/stores/discounted-products/${id}`,
  bestSeller: (id: string | number) => `/stores/best-sellers/${id}`,
  suggestedProducts: (id: string | number) => `/stores/suggested-products/${id}`,
};

export interface HomeEndpoints {
  suggestedProducts: string;
  bestSellersProducts: string;
  discountProducts: string;
}

export const HOME_ENDPINTS: HomeEndpoints = {
  suggestedProducts: "/home/suggested-products",
  bestSellersProducts: "/home/best-seller-products",
  discountProducts: "/home/discounted-products",
};

export interface ReviewsEndpoints {
  getByStore: (id: string | number) => string;
  show: (id: string | number) => string;
  statisticsByStore: (id: string | number) => string;
}

export const REVIEWS_ENDPOINT: ReviewsEndpoints = {
  getByStore: (id: string | number) => `/reviews/get-by-store/${id}`,
  show: (id: string | number) => `/reviews/show/${id}`,
  statisticsByStore: (id: string | number) => `/statistics/reviews/by-store/${id}`,
};


export interface AdvertisementsEndpoints {
  getAll: string;
  getAllMyAds: string;
  getById: (id: string | number) => string;
  changeStatus: (id: string | number) => string;
  deleteAdvertisements: string;
  update: (id: string | number) => string;

  getAdsCategories: string;
  getActiveAdsCategories: string;
  getSubByCatID: (id: string | number) => string;
  createReport: string;
};

export const AdvertisementsEndpoints: AdvertisementsEndpoints = {
  getAll: 'advertisements',
  deleteAdvertisements: `advertisements`,
  update: (id: string | number) => `advertisements/${id}`,
  getById: (id: string | number) => `advertisements/show/${id}`,
  changeStatus: (id: string | number) => `advertisements/${id}/update-status`,
  getAllMyAds: `advertisements/my-advertisements`,
  //Advertisement Categories and Subcategories 
  getAdsCategories: " advertisement-categories",
  getActiveAdsCategories: "advertisement-categories/active",
  getSubByCatID: (id: string | number) => `advertisement-subcategories/category/${id}`,

  //advertisement-reports 
  createReport: "advertisement-reports",
};
// Service Offers
export interface ServiceOffersEndpoints {
  getAll: string;
  getStats: string;
  getCategories: string;
  delete: (id: string | number) => string;
  show: (id: string | number) => string;
}

export const SERVICE_OFFERS: ServiceOffersEndpoints = {
  getAll: '/service-offers',
  getStats: '/service-offers/stats',
  getCategories: '/service-categories',
  delete: (id: string | number) => `/service-offers/delete/${id}`,
  show: (id: string | number) => `/service-offers/show/${id}`,
};

// Re-export all endpoints from Postman collection
export * from './api-endpoints';

