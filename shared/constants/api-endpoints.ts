// Auto-generated API endpoints from Postman collection

import { updateCompanyProfile } from "./urls";

// Admin
export const ADMIN_ENDPOINTS = {
  // Auth
  Login: `/admin/login`,
  Logout: `/admin/logout`,
  Refresh_Token: `/admin/refresh`,
  // Categories
  Get_All_Categories_With_Childrens: `/admin/categories`,
  Create_Category: `/admin/categories/create`,
  Delete_Category: (id: string | number) => `/admin/categories/delete/${id}`,
  Export_Categories: `/admin/categories/export`,
  Reorde_Categories: (orderId: string | number) => `/admin/categories/reorder/${orderId}`,
  Switch_Category_Activation: (id: string | number) => `/admin/categories/switch-activation/${id}`,
  Update_Category: (id: string | number) => `/admin/categories/update/${id}`,
  // Countries
  Create_Country: `/admin/countries/create`,
  Delete_Country: (id: string | number) => `/admin/countries/delete/${id}`,
  Export_Countries: `/admin/countries/export`,
  Get_All_Countries: `/admin/countries`,
  Switch_Activation_Country: (id: string | number) => `/admin/countries/switch-activation/${id}`,
  Update_Country: (id: string | number) => `/admin/countries/update/${id}`,
  // Regions
  Create_Region: `/admin/regions/create`,
  Delete_Region: (id: string | number) => `/admin/regions/delete/${id}`,
  Export_Regions: `/admin/regions/export`,
  Get_All_Regions: `/admin/regions`,
  Get_Regions_By_Country: (country_id: string | number) => `/admin/regions/by-country/${country_id}`,
  Update_Region: (id: string | number) => `/admin/regions/update/${id}`,
  // Audit
  Get_Logs_for_User: (user_id: string | number) => `/admin/audit/get-by-user/${user_id}`,
  // Users > Companies
  Get_All_Companies: `/admin/users/companies`,
  Get_Company_Details: (company_id: string | number) => `/admin/users/companies/details/${company_id}`,
  Create_Company: `/admin/users/companies/create`,
  Update_Company: (id: string | number) => `/admin/users/companies/update/${id}`,
  Delete_Company: (company_id: string | number) => `/admin/users/companies/delete/${company_id}`,
  Switch_Activation_Company: (company_id: string | number) => `/admin/users/companies/switch-activation/${company_id}`,
  Export_Company: `/admin/users/companies/export`,
  // Users > Consumers
  Get_All_Consumers: `/admin/users/consumers`,
  Get_Consumer_Details: (consumer_id: string | number) => `/admin/users/consumers/details/${consumer_id}`,
  Create_Consumer: `/admin/users/consumers/create`,
  Update_Consumer: (consumer_id: string | number) => `/admin/users/consumers/update/${consumer_id}`,
  Delete_Consumer: (consumer_id: string | number) => `/admin/users/consumers/delete/${consumer_id}`,
  Switch_Activation_Consumer: (consumer_id: string | number) => `/admin/users/consumers/switch-activation/${consumer_id}`,
  Export_Consumers: `/admin/users/consumers/export`,
  // Users > Freelancers
  Get_All_Freelancers: `/admin/users/freelancers`,
  Get_Freelancer_Details: (freelancer_id: string | number) => `/admin/users/freelancers/details/${freelancer_id}`,
  // Devices
  Get_All_Devices: `/admin/devices`,
  Revoke_All_Devices_For_User: (user_id: string | number) => `/admin/devices/revoke-devices-for-user/${user_id}`,
  Revoke_Device: (device_id: string | number) => `/admin/devices/revoke-device/${device_id}`,
  Get_Devices_By_User: (user_id: string | number) => `/admin/devices/user/${user_id}`,
  // Stores
  Get_All_Stores: `/admin/stores`,
  Get_Deleted_Stores: `/admin/stores/trashed`,
  Get_Stores_By_User: (user_id: string | number) => `/admin/stores/get-by-user/${user_id}`,
  Create_Store: `/admin/stores/create`,
  Update_Store: (store_id: string | number) => `/admin/stores/update/${store_id}`,
  Delete_Store: (store_id: string | number) => `/admin/stores/delete/${store_id}`,
  Restore_Store: (store_id: string | number) => `/admin/stores/restore/${store_id}`,
  Force_Delete_Store: (store_id: string | number) => `/admin/stores/force-delete/${store_id}`,
  Switch_Activation_Store: (store_id: string | number) => `/admin/stores/switch-activation/${store_id}`,
  Export_Excel: `/admin/stores/export`,
  Update_Store_Status: (store_id: string | number) => `/admin/stores/update-status/${store_id}`,
  // Store Membership
  Get_All_Members: `/admin/store-members`,
  Get_Deleted_Members: `/admin/store-members/trashed`,
  Get_Member_Details: (member_id: string | number) => `/admin/store-members/show/${member_id}`,
  Create_Member: `/admin/store-members/create`,
  Update_Member: (member_id: string | number) => `/admin/store-members/update/${member_id}`,
  Delete_Member: (member_id: string | number) => `/admin/store-members/delete/${member_id}`,
  Restore_Member: (member_id: string | number) => `/admin/store-members/restore/${member_id}`,
};

// User
export const USER_ENDPOINTS = {
  // Authentication & Users > Authentication
  Check_Forgot_Password_Otp: `/password/verify-otp`,
  Forgot_Password: `/password/forgot`,
  Login: `/login`,
  Logout: `/logout`,
  Refresh_Token: `/refresh`,
  Register_as_Company: `/register/company`,
  Register_as_Consumer: `/register/consumer`,
  Register_as_Freelancer: `/register/freelancer`,
  Resend_OTP: `/otp/resend`,
  Reset_Password: `/password/reset`,
  Verify_Account: `/otp/verify`,
  // Authentication & Users > Devices
  Get_All_Devices: `/devices`,
  Revoke_All_Devices_For_User: `/devices/revoke-all-devices`,
  Revoke_Device: (device_id: string | number) => `/devices/revoke-device/${device_id}`,
  // Authentication & Users > Freelancers
  Confirm_Upgrade: `/freelancers/confirm-upgrade`,
  Get_Requests: `/freelancers/get-requests`,
  Request_Upgrade: `/freelancers/request-upgrade`,
  // Authentication & Users > User Profiles
  Get_Profile: `/profile`,
  Update_Company_Profile: `/update-profile`,
  Update_Consumer_Profile: `/update-profile`,
  Update_Role: `/update-role`,
  // Authentication & Users > Social Login
  Provider_Callback: `/auth/google/callback`,
  Redirect_to_Provider: `/auth/google`,
  // Authentication & Users > Addresses
  Get_My_Addresses: `/addresses`,
  Add_Address: `/addresses/add`,
  Update_Address: (id: string | number) => `/addresses/update/${id}`,
  Delete_Address: (id: string | number) => `/addresses/remove/${id}`,
  // Ads > Advertisements
  Create_Advertisement: `/advertisements`, // Updated to match screenshot (was /advertisements/create)
  Get_Advertisement_Categories: `/advertisement-categories`,
  Get_Advertisement_Subcategories: `/advertisement-subcategories`,
  Delete_Advertisement_Image: (id: string | number) => `/advertisements/delete-image/${id}`,
  Delete_Advertisement: (id: string | number) => `/advertisements/delete/${id}`,
  Get_All_Advertisements: `/advertisements`,
  Get_Advertisements_By_User: `/advertisements/get-by-user`,
  Get_Advertisement_Details: (id: string | number) => `/advertisements/details/${id}`,
  Update_Advertisement: (id: string | number) => `/advertisements/update/${id}`,
  // Ads > Auctions
  Create_Auction: `/auctions/create`,
  Delete_Auction: (id: string | number) => `/auctions/delete/${id}`,
  Get_All_Auctions: `/auctions`,
  Get_all_bids: (id: string | number) => `/auctions/get-bids/${id}`,
  Get_Auction_Details: (id: string | number) => `/auctions/details/${id}`,
  Get_My_Auctions: `/auctions/get-by-user`,
  Submit_Bid: (id: string | number) => `/auctions/submit-bid/${id}`,
  Update_Auctions: (id: string | number) => `/auctions/update/${id}`,
  // Ads > Job Opportunities
  Create_Opportunity: `/jobs/create`,
  Delete_Opportunity: (id: string | number) => `/jobs/delete/${id}`,
  Get_All_Opportunities: `/jobs`,
  Get_Job_Details: (id: string | number) => `/jobs/details/${id}`,
  Get_My_Jobs: `/jobs/get-by-user`,
  Switch_Opportunity_Activation: (id: string | number) => `/jobs/switch-activation/${id}`,
  Update_Opportunity: (id: string | number) => `/jobs/update/${id}`,
  // Ads > Policies
  Get_Policy_By_Type: `/policies`,
  Update_Store_Policy: `/policies/update-policy`,
  // Ads > Redirect
  Resolve_Redierct: `/redirect/resolve`,
  // Shared > Categories
  Get_Parent_Categories: `/categories`,
  Get_Parents_with_Childerns: `/categories/get-with-childrens`,
  Get_Childerns: (id: string | number) => `/categories/childrens/${id}`,
  // Shared > Countries
  Get_Countries: `/shared/countries`,
  // Shared > Regions
  get_Regions_By_Country: (country_id: string | number) => `/shared/regions/${country_id}`,
  // Shared > Professions
  Get_All_Professions: `/shared/professions`,
  // Shared > Favorites
  AddRemove_from_Favourites: `/favourites/toggle`,
  Get_By_User: `/favourites`,
  // Marketplace > Cart
  Get_My_Cart: `/cart`,
  Add_Item: `/cart/add-item`,
  Add_Package: `/cart/add-package`,
  Update_Item: (id: string | number) => `/cart/update-item/${id}`,
  Remove_Item: (id: string | number) => `/cart/remove-item/${id}`,
  // Marketplace > Order
  Get_My_Orders: `/orders`,
  Create_Order: `/orders/create`,
  Get_Order_By_Id: (id: string | number) => `/orders/details/${id}`,
  // Marketplace > Products
  Get_Products: `/products`,
  Get_Product_Details: (product_id: string | number) => `/products/details/${product_id}`,
  Search: `/products/search`,
  // Marketplace > Wishlists
  Toggle_Product_in_Wishlist: `/wishlists/toggle`,
  View_Wishlist: `/wishlists`,
  // Marketplace > Tickets
  Create_Support_Ticket: `/tickets/create`,
  Show_Ticket_Details: (store_id: string | number) => `/tickets/show/${store_id}`,
  Get_Issue_Types: `/tickets/issue-types`,
  // Marketplace > Store
  Get_Store_Details: (store_id: string | number) => `/stores/details/${store_id}`,
  Store_Categories: (store_id: string | number) => `/stores/categories/${store_id}`,
  Best_Sellers: (store_id: string | number) => `/stores/best-sellers/${store_id}`,
  Discounted_Products: (store_id: string | number) => `/stores/discounted-products/${store_id}`,
  Suggested_Products: (store_id: string | number) => `/stores/suggested-products/${store_id}`,
  // Home
  Carousel: `/home/carousel`,
  Featured_Products: `/home/featured-products`,
  Banners: `/home/banners`,
  Top_Offers: `/home/top-offers`,
  Popular_Categories: `/home/popular-categories`,
  Best_Seller_Categories: `/home/best-seller-categories`,
  Best_Seller_Products: `/home/best-seller-products`,
  Suggested_Products_Home: `/home/suggested-products`,
  Sponsored_Categories: `/home/sponsored-categories`,
  Sponsored_Products: `/home/sponsored-products`,
  Discounted_Products_Home: `/home/discounted-products`,
  Pre_Order: `/home/pre-order`,
  Introducing_Products: `/home/introducing-products`,
  Free_Shipping_Products: `/home/free-shipping-products`,
};


//Adds 
export const ADS_ENDPOINTS = {
  all_adds: "/advertisements",
  ad_details: (id: number) => `/advertisements/show/${id}`,
  ad_similar: (id: number) => `/advertisements/${id}/similar`,
  categories_withSub: "/advertisement-categories/with-subcategories",
  all_categories: "/advertisement-categories",
  toggle_favourit: "/advertisement-favorites/toggle",
  get_favourit: "/advertisement-favorites"
}
export const JOBS_ENDPOINTS = {
  all_jobs: "/job-postings",
  showjobById: "/job-postings/details",
  getActiveCat: "/job-categories",
  applyJob: "/job-applications/apply",
  companyProfile: "/job-postings/companies/profile",
  myCompany: "/company-profile/show",
  updateCompanyProfile: "/company-profile/update",
  addCompanyGallery: "/company-profile/add-gallery",
  addCompanyTeam: "/company-profile/add-team",
  updateCompanyTeam: "/company-profile/update-team",
  deleteCompanyTeam: "/company-profile/delete-team",
  deleteImageGallery: "/company-profile/delete-gallery",
  getMyProfileUser: "/job-profile/show",
  updateProfileUser: "/job-profile/update",
  deleteLogoProfile: "/company-profile/logo",
  deleteCoverProfile: "/company-profile/cover",
};

// Seller
export const SELLER_ENDPOINTS = {
  // Marketplace > Audit
  Get_Audit_By_Store: (store_id: string | number) => `/audit/get-by-store/${store_id}`,
  // Marketplace > Policies
  Get_Policy_By_Type: `/policies`,
  Update_Store_Policy: `/policies/update-policy`,
  // Marketplace > Stores
  Get_Stores_By_User: `/stores/get-by-user`,
  Create_Store: `/stores/create`,
  Store_Details: (store_id: string | number) => `/stores/show/${store_id}`,
  Update_Store: (store_id: string | number) => `/stores/update/${store_id}`,
  Delete_Store: (store_id: string | number) => `/stores/delete/${store_id}`,
  Force_Delete: (store_id: string | number) => `/stores/force-delete/${store_id}`,
  Restore_Store: (store_id: string | number) => `/stores/restore/${store_id}`,
  Switch_Activation_Store: (store_id: string | number) => `/stores/switch-activation/${store_id}`,
  Get_Store_Categories: (store_id: string | number) => `/stores/categories/${store_id}`,
  // Marketplace > Products
  Get_Products_By_Store: (store_id: string | number) => `/products/get-by-store/${store_id}`,
  Get_Related_Products: (product_id: string | number) => `/products/related-products/${product_id}`,
  Get_Products_with_variants: (store_id: string | number) => `/products/get-by-store/with-variants/${store_id}`,
  Create_Product: `/products/create`,
  Update_Product: (product_id: string | number) => `/products/update/${product_id}`,
  Delete_Product: (product_id: string | number) => `/products/delete/${product_id}`,
  Duplicate_Product: (product_id: string | number) => `/products/duplicate/${product_id}`,
  Product_Details: (product_id: string | number) => `/products/show/${product_id}`,
  Switch_Activation_Product: (product_id: string | number) => `/products/switch-activation/${product_id}`,
  // Marketplace > Store Membership > Members
  Get_Store_Members: (store_id: string | number) => `/stores/members/${store_id}`,
  Update_Member_Role: (member_id: string | number) => `/stores/members/update-role/${member_id}`,
  Get_Member_Details: (member_id: string | number) => `/stores/members/show/${member_id}`,
  Remove_Member: (member_id: string | number) => `/stores/members/remove/${member_id}`,
  Restore_Member: (member_id: string | number) => `/stores/members/restore/${member_id}`,
  Get_Removed_Store_Members: (store_id: string | number) => `/stores/members/members-removed/${store_id}`,
  // Marketplace > Store Membership > Invitation
  Send_Invitation: `/stores/invitations/send`,
  Preview_Invitation: (token: string) => `/stores/invitations/preview/${token}`,
  Accept_Invitation: (token: string) => `/stores/invitations/accept/${token}`,
  Revoke_Invitation: (member_id: string | number) => `/stores/invitations/revoke/${member_id}`,
  // Marketplace > Redirect
  Resolve_Redierct: `/redirect/resolve`,
  // Marketplace > Inventory
  Get_Inventory_Items: (store_id: string | number) => `/inventory/get-by-store/${store_id}`,
  Export_Variants: `/inventory/export`,
  Import_Variants: `/inventory/import`,
  // Marketplace > Violations
  Submit_violation: `/violations/submit`,
  // Marketplace > Flash Sale
  Get_Flash_Sales_by_Store: (store_id: string | number) => `/flash-sales/by-store/${store_id}`,
  Show_Flash_Sale_Details: (flash_sale_id: string | number) => `/flash-sales/flash-sale/${flash_sale_id}`,
  Create_Flash_Sale: `/flash-sales/create`,
  Update_Flash_Sale: (id: string | number) => `/flash-sales/update/${id}`,
  Delete_Flash_Sale: (id: string | number) => `/flash-sales/delete/${id}`,
  // Marketplace > Coupon
  Create_Coupon: `/coupons/create`,
  Delete_Coupon: (id: string | number) => `/coupons/delete/${id}`,
  Get_All_Coupons_by_Store: (store_id: string | number) => `/coupons/get-by-store/${store_id}`,
  Show_Coupon_Details: (coupon_id: string | number) => `/coupons/show/${coupon_id}`,
  // Marketplace > SLA Rules
  View_Store_SLA_Rules: (store_id: string | number) => `/sla-rules/${store_id}`,
  Create_SLA_Rule: `/sla-rules/create`,
  Delete_SLA_Rule: (sla_rule_id: string | number) => `/sla-rules/delete/${sla_rule_id}`,
  View_SLA_Rule_Details: (sla_rule_id: string | number) => `/sla-rules/show/${sla_rule_id}`,
  // Marketplace > Tickets
  List_Tickets_for_Store: (store_id: string | number) => `/support-tickets/get-by-store/${store_id}`,
  Reply_to_Ticket: (id: string | number) => `/support-tickets/reply/${id}`,
  Resolve_Ticket: (id: string | number) => `/support-tickets/resolve/${id}`,
  Escalate_Ticket: (id: string | number) => `/support-tickets/escalate/${id}`,
  Show_Ticket_Details: (store_id: string | number) => `/support-tickets/show/${store_id}`,
  Get_Issue_Types: `/support-tickets/issue-types`,
  // Marketplace > Packages
  Get_Product_Packages: (product_id: string | number) => `/packages/product/${product_id}/list`,
  Get_Packages_By_Store: (store_id: string | number) => `/packages/store/${store_id}/list`,
  Create_Package: (product_id: string | number) => `/packages/product/${product_id}/create`,
  Get_Package_Details: (package_id: string | number) => `/packages/details/${package_id}`,
  Update_Package: (package_id: string | number) => `/packages/update/${package_id}`,
  Delete_Package: (package_id: string | number) => `/packages/delete/${package_id}`,
  Add_Item_To_Package: (package_id: string | number) => `/packages/add-items/${package_id}`,
  Remove_Items_From_Package: (package_id: string | number) => `/packages/remove-items/${package_id}`,
};

// Service Market
export const SERVICE_MARKET_ENDPOINTS = {
  getProviderProfile: "/service-provider",
  updateProviderProfile: "/service-provider/update",
  createProviderProfile: "/service-provider",
  submitVerification: "/service-provider/submit-verification",
  serviceOffers: "/service-offers",
  serviceOrders: "/service-orders",
  myServices: "/services",
  providerServices: "/service-offers",
  updateProviderServices: "/service-offers/update",
  deleteProviderServices: "/service-offers/delete",
  showService: (id: number) => `/service-offers/show/${id}`,
  providerProjects: "/provider-projects",
  updateProviderProjects: "/provider-projects/update",
  deleteProject :"/provider-projects/delete",
  showProject: (id: number) => `/provider-projects/show/${id}`,
  clientRFQ: "/custom-requests/update",
  customRequests: "/custom-requests",
  showCustomRequest: (id: string | number) => `/custom-requests/show/${id}`,
  cancelRequest: (id: string | number) => `/custom-requests/cancel/${id}`,
  acceptQuote: (quoteId: string | number) => `/custom-requests/quotes/${quoteId}/accept`,
  customRequestCategories: "/custom-request-categories",
  processPayment: (orderId: string | number) => `/custom-request-orders/${orderId}/process-payment`,
};

// Provider milestone-template CRUD endpoints. Backend mounts these under
// /api/v1/milestones (Modules\Services\routes\provider.php) with the
// service.profile.provider middleware — caller must have a provider profile.
export const PROVIDER_MILESTONE_ENDPOINTS = {
  list: "/milestones",
  show: (id: string | number) => `/milestones/show/${id}`,
  create: "/milestones",
  update: (id: string | number) => `/milestones/update/${id}`,
  delete: (id: string | number) => `/milestones/delete/${id}`,
  toggleActivation: (id: string | number) => `/milestones/toggle-activation/${id}`,
  addServiceLine: (milestoneId: string | number) => `/milestones/${milestoneId}/services`,
  updateServiceLine: (lineId: string | number) => `/milestones/services/update/${lineId}`,
  deleteServiceLine: (lineId: string | number) => `/milestones/services/delete/${lineId}`,
};

// Provider RFQ Endpoints
export const PROVIDER_RFQ_ENDPOINTS = {
  requests: "/provider-custom-requests",
  discoverRequests: "/discover/requests",
  discoverRequestDetails: (id: string | number) => `/discover/requests/${id}`,
  showRequest: (id: string | number) => `/provider-custom-requests/show/${id}`,
  submitQuote: (requestId: string | number) => `/custom-requests/${requestId}/quotes`,
  updateQuote: (quoteId: string | number) => `/quotes/${quoteId}`,
  cancelQuote: (quoteId: string | number) => `/quotes/${quoteId}/cancel`,
  myQuotes: "/provider/quotes",
  quoteStats: "/provider/quotes/stats",
  categories: "/custom-request-categories",
};


// Public Services

export const SERVICES_PUBLIC_ENDPOINTS = {
  getAll:"/services",
  getDetails:(id:number)=>`/services/show/${id}`,
  getServiceProjects:(id:number)=>`/services/${id}/projects`,
  getAllCategories :"/user/service-categories",
  report :(id:number)=>`/services/${id}/report`,
  review :(id:number)=>`/services/${id}/review`
}

export const CLIENT_SERVICES_ORDERS = {
  create: "/service-orders",
  getAll: "/service-orders",
  getDetails: (id: string | number) => `/service-orders/show/${id}`,
  cancel: (id: string | number) => `/service-orders/cancel/${id}`,
  accept: (id: string | number) => `/service-orders/accept/${id}`,
  reject: (id: string | number) => `/service-orders/reject/${id}`,
  requestRevision: (id: string | number) => `/service-orders/${id}/revisions`,
  submitDispute: (id: string | number) => `/service-orders/dispute/${id}`,
  uploadAttachment: (id: string | number) => `/service-orders/attachments/${id}`,
  approveExtension: (id: string | number) => `/service-orders/approve-extension/${id}`,
  rejectExtension: (id: string | number) => `/service-orders/reject-extension/${id}`,
  // Milestone phase actions — backend exposes per-phase pay / accept / request-revision
  // off the order-scoped phase controller. payPhase returns { order, checkout_url }
  // that the FE redirects to Stripe Checkout.
  phasePay: (orderId: string | number, phaseId: string | number) =>
    `/service-orders/${orderId}/phases/${phaseId}/pay`,
  phaseAccept: (orderId: string | number, phaseId: string | number) =>
    `/service-orders/${orderId}/phases/${phaseId}/accept`,
  phaseRequestRevision: (orderId: string | number, phaseId: string | number) =>
    `/service-orders/${orderId}/phases/${phaseId}/revisions`,
};

// OrderableType values accepted by POST /service-orders (and used to dispatch
// rendering on order-detail pages). Mirrors Modules\Services\Enums\OrderableType
// in the backend.
export const ORDERABLE_TYPE = {
  ServiceOffer: "service_offer",
  MilestoneTemplate: "milestone_template",
} as const;
export type OrderableType = (typeof ORDERABLE_TYPE)[keyof typeof ORDERABLE_TYPE];

// Seller-side Stripe Connect onboarding. Required before a seller can accept
// orders (StripeConnectRail::supports() refuses if charges_enabled=false).
// Frontend flow: POST start -> redirect to onboarding_url -> Stripe returns
// to our app -> GET status?refresh=1 -> read the latest flags.
export const STRIPE_ONBOARDING_ENDPOINTS = {
  start: "/seller/stripe-onboarding",
  status: "/seller/stripe-onboarding/status",
  // Use with ?refresh=1 to force a sync from Stripe instead of returning
  // the cached DB snapshot (useful right after the seller returns from
  // the hosted onboarding page).
  statusRefresh: "/seller/stripe-onboarding/status?refresh=1",
};

// Invoice lookup. Used by the /checkout/return page to figure out which
// order (or topup) a Stripe Checkout session belonged to so we can route
// the buyer to the right place after payment.
export const INVOICE_ENDPOINTS = {
  bySession: (sessionId: string) => `/invoices/by-session/${sessionId}`,
};

// Wallet (platform credit). Per-user balance + transaction history + topup
// via the generic PaymentInitiator. Mirrors Modules\Wallet routes/user.php.
export const WALLET_ENDPOINTS = {
  show: "/wallet",
  transactions: "/wallet/transactions",
  topup: "/wallet/topup",
};

// Mirrors Modules\Wallet\Enums\WalletTransactionType. Used to drive the
// transaction-history filter chips on the /wallet page.
export const WALLET_TX_TYPE = {
  Credit: "CREDIT",
  Debit:  "DEBIT",
  Lock:   "LOCK",
  Unlock: "UNLOCK",
  Refund: "REFUND",
} as const;
export type WalletTxType = (typeof WALLET_TX_TYPE)[keyof typeof WALLET_TX_TYPE];

export const CLIENT_DISPUTES_ENDPOINTS = {
  getAll: "/orders-disputes",
  create: (orderId: string | number) => `/orders-disputes/orders/${orderId}`,
  getDetails: (disputeId: string | number) => `/orders-disputes/${disputeId}`,
};

export const PROVIDER_SERVICES_ORDERS = {
  create: "/provider-orders",
  getAll: "/provider-orders",
  getDetails: (id: string | number) => `/provider-orders/show/${id}`,
  cancel: (id: string | number) => `/provider-orders/cancel/${id}`,
  accept: (id: string | number) => `/provider-orders/accept/${id}`,
  reject: (id: string | number) => `/provider-orders/reject/${id}`,
  confirm: (id: string | number) => `/provider-orders/start/${id}`,
  deliver: (id: string | number) => `/provider-orders/deliver/${id}`,
  requestExtension: (id: string | number) => `/provider-orders/request-extension/${id}`,
  rejectRevision: (revisionId: string | number) => `/provider-orders/revisions/${revisionId}/reject`,
  acceptRevision: (revisionId: string | number) => `/provider-orders/revisions/${revisionId}/accept`,
  // Milestone phase actions (provider-side counterparts to the buyer's
  // pay / accept / revisions). Backend exposes them off the phase
  // controller mounted under /provider-orders.
  phaseStart: (orderId: string | number, phaseId: string | number) =>
    `/provider-orders/${orderId}/phases/${phaseId}/start`,
  phaseDeliver: (orderId: string | number, phaseId: string | number) =>
    `/provider-orders/${orderId}/phases/${phaseId}/deliver`,
  // Negotiation lifecycle — provider defines milestone template inline
  // on a status=Negotiation order. Creates the template, copies phases,
  // flips status to PendingPayment so the buyer can pay phase 1.
  defineMilestone: (orderId: string | number) =>
    `/provider-orders/${orderId}/define-milestone`,
};

export const PUBLIC_PROVIDER_PROFILE = {
  about:(id:number)=>`/providers/${id}/about`,
  services:(id:number)=>`/providers/${id}/services`,
  portfolio:(id:number)=>`/providers/${id}/portfolio`,
}

// Boost Campaign Endpoints
export const BOOST_CAMPAIGN_ENDPOINTS = {
  list: "/boost-campaigns",
  create: "/boost-campaigns",
  boostPlans: "/boost-plans",
};
