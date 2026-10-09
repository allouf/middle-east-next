// Complete list of all API endpoints with metadata

export interface ApiEndpoint {
  name: string;
  method: string;
  path: string;
  pathParams: string[];
  queryParams: string[];
  bodyType?: string;
  folder: string[];
  auth: string;
}

export const ALL_ENDPOINTS: ApiEndpoint[] = [
  {
    name: "Login",
    method: "POST",
    path: "/admin/login",
    pathParams: [],
    queryParams: [],
    bodyType: "LoginRequest",
    folder: ["Admin", "Auth"],
    auth: "noauth"
  },
  {
    name: "Logout",
    method: "POST",
    path: "/admin/logout",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Auth"],
    auth: "bearer"
  },
  {
    name: "Refresh Token",
    method: "POST",
    path: "/admin/refresh",
    pathParams: [],
    queryParams: [],
    bodyType: "RefreshTokenRequest",
    folder: ["Admin", "Auth"],
    auth: "noauth"
  },
  {
    name: "Get All Categories With Childrens",
    method: "GET",
    path: "/admin/categories",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Create Category",
    method: "POST",
    path: "/admin/categories/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateCategoryRequest",
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Delete Category",
    method: "DELETE",
    path: "/admin/categories/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Export Categories",
    method: "GET",
    path: "/admin/categories/export",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Reorde Categories",
    method: "POST",
    path: "/admin/categories/reorder/{id}",
    pathParams: ["orderId"],
    queryParams: [],
    bodyType: "ReordeCategoriesRequest",
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Switch Category Activation",
    method: "POST",
    path: "/admin/categories/switch-activation/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Update Category",
    method: "POST",
    path: "/admin/categories/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateCategoryRequest",
    folder: ["Admin", "Categories"],
    auth: "bearer"
  },
  {
    name: "Create Country",
    method: "POST",
    path: "/admin/countries/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateCountryRequest",
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Delete Country",
    method: "DELETE",
    path: "/admin/countries/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Export Countries",
    method: "GET",
    path: "/admin/countries/export",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Get All Countries",
    method: "GET",
    path: "/admin/countries",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/admin/countries/switch-activation/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Update Country",
    method: "POST",
    path: "/admin/countries/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateCountryRequest",
    folder: ["Admin", "Countries"],
    auth: "bearer"
  },
  {
    name: "Create Region",
    method: "POST",
    path: "/admin/regions/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateRegionRequest",
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Delete Region",
    method: "DELETE",
    path: "/admin/regions/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Export Regions",
    method: "GET",
    path: "/admin/regions/export",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Get All Regions",
    method: "GET",
    path: "/admin/regions",
    pathParams: [],
    queryParams: ["country_id"],
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Get Regions By Country",
    method: "GET",
    path: "/admin/regions/by-country/:country_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Update Region",
    method: "POST",
    path: "/admin/regions/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateRegionRequest",
    folder: ["Admin", "Regions"],
    auth: "bearer"
  },
  {
    name: "Get Logs for User",
    method: "GET",
    path: "/admin/audit/get-by-user/:user_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Audit"],
    auth: "bearer"
  },
  {
    name: "Get All Companies",
    method: "GET",
    path: "/admin/users/companies",
    pathParams: [],
    queryParams: ["search"],
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Get Company Details",
    method: "GET",
    path: "/admin/users/companies/details/:company_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Create Company",
    method: "POST",
    path: "/admin/users/companies/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateCompanyRequest",
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Update Company",
    method: "POST",
    path: "/admin/users/companies/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateCompanyRequest",
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Delete Company",
    method: "DELETE",
    path: "/admin/users/companies/delete/:company_id",
    pathParams: [],
    queryParams: [],
    bodyType: "DeleteCompanyRequest",
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/admin/users/companies/switch-activation/:company_id",
    pathParams: [],
    queryParams: [],
    bodyType: "SwitchActivationRequest",
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Export Company",
    method: "GET",
    path: "/admin/users/companies/export",
    pathParams: [],
    queryParams: [],
    bodyType: "ExportCompanyRequest",
    folder: ["Admin", "Users", "Companies"],
    auth: "bearer"
  },
  {
    name: "Get All Consumers",
    method: "GET",
    path: "/admin/users/consumers",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Get Consumer Details",
    method: "GET",
    path: "/admin/users/consumers/details/:consumer_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Create Consumer",
    method: "POST",
    path: "/admin/users/consumers/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateConsumerRequest",
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Update Consumer",
    method: "POST",
    path: "/admin/users/consumers/update/:consumer_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateConsumerRequest",
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Delete Consumer",
    method: "DELETE",
    path: "/admin/users/consumers/delete/:consumer_id",
    pathParams: [],
    queryParams: [],
    bodyType: "DeleteConsumerRequest",
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/admin/users/consumers/switch-activation/:consumer_id",
    pathParams: [],
    queryParams: [],
    bodyType: "SwitchActivationRequest",
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Export Consumers",
    method: "GET",
    path: "/admin/users/consumers/export",
    pathParams: [],
    queryParams: [],
    bodyType: "ExportConsumersRequest",
    folder: ["Admin", "Users", "Consumers"],
    auth: "bearer"
  },
  {
    name: "Get All Freelancers",
    method: "GET",
    path: "/admin/users/freelancers",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Users", "Freelancers"],
    auth: "bearer"
  },
  {
    name: "Get Freelancer Details",
    method: "GET",
    path: "/admin/users/freelancers/details/:freelancer_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Users", "Freelancers"],
    auth: "bearer"
  },
  {
    name: "Get All Devices",
    method: "GET",
    path: "/admin/devices",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Devices"],
    auth: "bearer"
  },
  {
    name: "Revoke All Devices For User",
    method: "POST",
    path: "/admin/devices/revoke-devices-for-user/:user_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Devices"],
    auth: "bearer"
  },
  {
    name: "Revoke Device",
    method: "POST",
    path: "/admin/devices/revoke-device/:device_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Devices"],
    auth: "bearer"
  },
  {
    name: "Get By User",
    method: "GET",
    path: "/admin/devices/user/:user_id",
    pathParams: [],
    queryParams: [],
    bodyType: "GetByUserRequest",
    folder: ["Admin", "Devices"],
    auth: "bearer"
  },
  {
    name: "Get All Stores",
    method: "GET",
    path: "/admin/stores",
    pathParams: [],
    queryParams: ["search"],
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Get Deleted Stores",
    method: "GET",
    path: "/admin/stores/trashed",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Get By User",
    method: "GET",
    path: "/admin/stores/get-by-user/:user_id",
    pathParams: [],
    queryParams: [],
    bodyType: "GetByUserRequest",
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Create Store",
    method: "POST",
    path: "/admin/stores/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateStoreRequest",
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Update Store",
    method: "POST",
    path: "/admin/stores/update/:store_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateStoreRequest",
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Delete Store",
    method: "DELETE",
    path: "/admin/stores/delete/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Restore Store",
    method: "POST",
    path: "/admin/stores/restore/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Force Delete Store",
    method: "DELETE",
    path: "/admin/stores/force-delete/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/admin/stores/switch-activation/:store_id",
    pathParams: [],
    queryParams: [],
    bodyType: "SwitchActivationRequest",
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Export Excel",
    method: "GET",
    path: "/admin/stores/export",
    pathParams: [],
    queryParams: [],
    bodyType: "ExportExcelRequest",
    folder: ["Admin", "Stores"],
    auth: "bearer"
  },
  {
    name: "Update Store Status",
    method: "POST",
    path: "/admin/stores/update-status/:store_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateStoreStatusRequest",
    folder: ["Admin", "Stores"],
    auth: "noauth"
  },
  {
    name: "Get All Members",
    method: "GET",
    path: "/admin/store-members",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Get Deleted Members",
    method: "GET",
    path: "/admin/store-members/trashed",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Get Member Details",
    method: "GET",
    path: "/admin/store-members/show/:member_id",
    pathParams: [],
    queryParams: [],
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Create Member",
    method: "POST",
    path: "/admin/store-members/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateMemberRequest",
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Update Member",
    method: "POST",
    path: "/admin/store-members/update/:member_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateMemberRequest",
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Delete Member",
    method: "DELETE",
    path: "/admin/store-members/delete/:member_id",
    pathParams: [],
    queryParams: [],
    bodyType: "DeleteMemberRequest",
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Restore Member",
    method: "POST",
    path: "/admin/store-members/restore/:member_id",
    pathParams: [],
    queryParams: [],
    bodyType: "RestoreMemberRequest",
    folder: ["Admin", "Store Membership"],
    auth: "bearer"
  },
  {
    name: "Check Forgot Password Otp",
    method: "POST",
    path: "/password/verify-otp",
    pathParams: [],
    queryParams: [],
    bodyType: "CheckForgotPasswordOtpRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Forgot Password",
    method: "POST",
    path: "/password/forgot",
    pathParams: [],
    queryParams: [],
    bodyType: "ForgotPasswordRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Login",
    method: "POST",
    path: "/login",
    pathParams: [],
    queryParams: [],
    bodyType: "LoginRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Logout",
    method: "POST",
    path: "/logout",
    pathParams: [],
    queryParams: [],
    bodyType: "LogoutRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "bearer"
  },
  {
    name: "Refresh Token",
    method: "POST",
    path: "/refresh",
    pathParams: [],
    queryParams: [],
    bodyType: "RefreshTokenRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Register as Company",
    method: "POST",
    path: "/register/company",
    pathParams: [],
    queryParams: [],
    bodyType: "RegisterasCompanyRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Register as Consumer",
    method: "POST",
    path: "/register/consumer",
    pathParams: [],
    queryParams: [],
    bodyType: "RegisterasConsumerRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Register as Freelancer",
    method: "POST",
    path: "/register/freelancer",
    pathParams: [],
    queryParams: [],
    bodyType: "RegisterasFreelancerRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Resend OTP",
    method: "POST",
    path: "/otp/resend",
    pathParams: [],
    queryParams: ["contact"],
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Reset Password",
    method: "POST",
    path: "/password/reset",
    pathParams: [],
    queryParams: [],
    bodyType: "ResetPasswordRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Verify Account",
    method: "POST",
    path: "/otp/verify",
    pathParams: [],
    queryParams: [],
    bodyType: "VerifyAccountRequest",
    folder: ["User", "Authentication & Users", "Authentication"],
    auth: "noauth"
  },
  {
    name: "Get All Devices",
    method: "GET",
    path: "/devices",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Devices"],
    auth: "bearer"
  },
  {
    name: "Revoke All Devices For User",
    method: "POST",
    path: "/devices/revoke-all-devices",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Devices"],
    auth: "bearer"
  },
  {
    name: "Revoke Device",
    method: "POST",
    path: "/devices/revoke-device/:device_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Devices"],
    auth: "bearer"
  },
  {
    name: "Confirm Upgrade",
    method: "POST",
    path: "/freelancers/confirm-upgrade",
    pathParams: [],
    queryParams: [],
    bodyType: "ConfirmUpgradeRequest",
    folder: ["User", "Authentication & Users", "Freelancers"],
    auth: "bearer"
  },
  {
    name: "Get Requests",
    method: "GET",
    path: "/freelancers/get-requests",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Freelancers"],
    auth: "bearer"
  },
  {
    name: "Request Upgrade",
    method: "POST",
    path: "/freelancers/request-upgrade",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Freelancers"],
    auth: "bearer"
  },
  {
    name: "Get Profile",
    method: "GET",
    path: "/profile",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "User Profiles"],
    auth: "bearer"
  },
  {
    name: "Update Company Profile",
    method: "POST",
    path: "/update-profile",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateCompanyProfileRequest",
    folder: ["User", "Authentication & Users", "User Profiles"],
    auth: "bearer"
  },
  {
    name: "Update Consumer Profile",
    method: "POST",
    path: "/update-profile",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateConsumerProfileRequest",
    folder: ["User", "Authentication & Users", "User Profiles"],
    auth: "bearer"
  },
  {
    name: "Update Role",
    method: "POST",
    path: "/update-role",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateRoleRequest",
    folder: ["User", "Authentication & Users", "User Profiles"],
    auth: "bearer"
  },
  {
    name: "Provider Callback",
    method: "GET",
    path: "/auth/google/callback",
    pathParams: [],
    queryParams: ["id_token"],
    folder: ["User", "Authentication & Users", "Social Login"],
    auth: "bearer"
  },
  {
    name: "Redirect to Provider",
    method: "GET",
    path: "/auth/google",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Social Login"],
    auth: "bearer"
  },
  {
    name: "Get My Addresses",
    method: "GET",
    path: "/addresses",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Authentication & Users", "Addresses"],
    auth: "bearer"
  },
  {
    name: "Add Address",
    method: "POST",
    path: "/addresses/add",
    pathParams: [],
    queryParams: [],
    bodyType: "AddAddressRequest",
    folder: ["User", "Authentication & Users", "Addresses"],
    auth: "bearer"
  },
  {
    name: "Update Address",
    method: "PUT",
    path: "/addresses/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateAddressRequest",
    folder: ["User", "Authentication & Users", "Addresses"],
    auth: "bearer"
  },
  {
    name: "Delete Address",
    method: "DELETE",
    path: "/addresses/remove/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "DeleteAddressRequest",
    folder: ["User", "Authentication & Users", "Addresses"],
    auth: "bearer"
  },
  {
    name: "Create Advertisement",
    method: "POST",
    path: "/advertisements/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateAdvertisementRequest",
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Delete Advertisement Image",
    method: "DELETE",
    path: "/advertisements/delete-image/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Delete Advertisement",
    method: "DELETE",
    path: "/advertisements/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Get All Advertisements",
    method: "GET",
    path: "/advertisements",
    pathParams: [],
    queryParams: ["per_page", "page"],
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Get By User",
    method: "GET",
    path: "/advertisements/get-by-user",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Get Details",
    method: "GET",
    path: "/advertisements/details/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Update Advertisement",
    method: "POST",
    path: "/advertisements/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateAdvertisementRequest",
    folder: ["User", "Ads", "Advertisements"],
    auth: "bearer"
  },
  {
    name: "Create Auction",
    method: "POST",
    path: "/auctions/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateAuctionRequest",
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Delete Auction",
    method: "DELETE",
    path: "/auctions/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Get All Auctions",
    method: "GET",
    path: "/auctions",
    pathParams: [],
    queryParams: ["per_page", "page"],
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Get all bids",
    method: "GET",
    path: "/auctions/get-bids/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Get Details",
    method: "GET",
    path: "/auctions/details/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Get My Auctions",
    method: "GET",
    path: "/auctions/get-by-user",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Submit Bid",
    method: "POST",
    path: "/auctions/submit-bid/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "SubmitBidRequest",
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Update Auctions",
    method: "POST",
    path: "/auctions/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateAuctionsRequest",
    folder: ["User", "Ads", "Auctions"],
    auth: "bearer"
  },
  {
    name: "Create Opportunity",
    method: "POST",
    path: "/jobs/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateOpportunityRequest",
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Delete Opportunity",
    method: "DELETE",
    path: "/jobs/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Get All Opportunities",
    method: "GET",
    path: "/jobs",
    pathParams: [],
    queryParams: ["per_page", "page"],
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Get Details",
    method: "GET",
    path: "/jobs/details/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "noauth"
  },
  {
    name: "Get My Jobs",
    method: "GET",
    path: "/jobs/get-by-user",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Switch Opportunity Activation",
    method: "POST",
    path: "/jobs/switch-activation/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Update Opportunity",
    method: "POST",
    path: "/jobs/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateOpportunityRequest",
    folder: ["User", "Ads", "Job Opportunities"],
    auth: "bearer"
  },
  {
    name: "Get Policy By Type",
    method: "GET",
    path: "/policies",
    pathParams: [],
    queryParams: ["store_id", "type"],
    folder: ["User", "Ads", "Policies"],
    auth: "bearer"
  },
  {
    name: "Update Store Policy",
    method: "POST",
    path: "/policies/update-policy",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateStorePolicyRequest",
    folder: ["User", "Ads", "Policies"],
    auth: "bearer"
  },
  {
    name: "Resolve Redierct",
    method: "GET",
    path: "/redirect/resolve",
    pathParams: [],
    queryParams: ["path"],
    folder: ["User", "Ads", "Redirect"],
    auth: "bearer"
  },
  {
    name: "Get Parent Categories",
    method: "GET",
    path: "/categories",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Shared", "Categories"],
    auth: "bearer"
  },
  {
    name: "Get Parents with Childerns",
    method: "GET",
    path: "/categories/get-with-childrens",
    pathParams: [],
    queryParams: ["paginagte"],
    folder: ["User", "Shared", "Categories"],
    auth: "bearer"
  },
  {
    name: "Get Childerns",
    method: "GET",
    path: "/categories/childrens/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Shared", "Categories"],
    auth: "bearer"
  },
  {
    name: "Get Countries",
    method: "GET",
    path: "/shared/countries",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["User", "Shared", "Countries"],
    auth: "noauth"
  },
  {
    name: "get Regions By Country",
    method: "GET",
    path: "/shared/regions/:country_id",
    pathParams: [],
    queryParams: ["paginate"],
    folder: ["User", "Shared", "Regions"],
    auth: "noauth"
  },
  {
    name: "Get All Professions",
    method: "GET",
    path: "/shared/professions",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Shared", "Professions"],
    auth: "noauth"
  },
  {
    name: "Add/Remove from Favourites",
    method: "POST",
    path: "/favourites/toggle",
    pathParams: [],
    queryParams: [],
    bodyType: "Add/RemovefromFavouritesRequest",
    folder: ["User", "Shared", "Favorites"],
    auth: "bearer"
  },
  {
    name: "Get By User",
    method: "GET",
    path: "/favourites",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Shared", "Favorites"],
    auth: "bearer"
  },
  {
    name: "Get My Cart",
    method: "GET",
    path: "/cart",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Cart"],
    auth: "bearer"
  },
  {
    name: "Add Item",
    method: "POST",
    path: "/cart/add-item",
    pathParams: [],
    queryParams: [],
    bodyType: "AddItemRequest",
    folder: ["User", "Marketplace", "Cart"],
    auth: "bearer"
  },
  {
    name: "Add Package",
    method: "POST",
    path: "/cart/add-package",
    pathParams: [],
    queryParams: [],
    bodyType: "AddPackageRequest",
    folder: ["User", "Marketplace", "Cart"],
    auth: "bearer"
  },
  {
    name: "Update Item",
    method: "POST",
    path: "/cart/update-item/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateItemRequest",
    folder: ["User", "Marketplace", "Cart"],
    auth: "bearer"
  },
  {
    name: "Remove Item",
    method: "DELETE",
    path: "/cart/remove-item/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Marketplace", "Cart"],
    auth: "bearer"
  },
  {
    name: "Get My Orders",
    method: "GET",
    path: "/orders",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Order"],
    auth: "bearer"
  },
  {
    name: "Create Order",
    method: "POST",
    path: "/orders/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateOrderRequest",
    folder: ["User", "Marketplace", "Order"],
    auth: "bearer"
  },
  {
    name: "Get Order By Id",
    method: "GET",
    path: "/orders/details/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["User", "Marketplace", "Order"],
    auth: "bearer"
  },
  {
    name: "Get Products",
    method: "GET",
    path: "/products",
    pathParams: [],
    queryParams: ["category_id", "store_id"],
    folder: ["User", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Get Product Details",
    method: "GET",
    path: "/products/details/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Search",
    method: "GET",
    path: "/products/search",
    pathParams: [],
    queryParams: ["q", "limit"],
    folder: ["User", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Toggle Product in Wishlist",
    method: "POST",
    path: "/wishlists/toggle",
    pathParams: [],
    queryParams: [],
    bodyType: "ToggleProductinWishlistRequest",
    folder: ["User", "Marketplace", "Wishlists"],
    auth: "bearer"
  },
  {
    name: "View Wishlist",
    method: "GET",
    path: "/wishlists",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Wishlists"],
    auth: "bearer"
  },
  {
    name: "Create Support Ticket",
    method: "POST",
    path: "/tickets/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateSupportTicketRequest",
    folder: ["User", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Show Ticket Details",
    method: "GET",
    path: "/tickets/show/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Get Issue Types",
    method: "GET",
    path: "/tickets/issue-types",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Get Store Details",
    method: "GET",
    path: "/stores/details/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Store"],
    auth: "noauth"
  },
  {
    name: "Store Categories",
    method: "GET",
    path: "/stores/categories/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Store"],
    auth: "noauth"
  },
  {
    name: "Best Sellers",
    method: "GET",
    path: "/stores/best-sellers/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Store"],
    auth: "noauth"
  },
  {
    name: "Discounted Products",
    method: "GET",
    path: "/stores/discounted-products/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Store"],
    auth: "noauth"
  },
  {
    name: "Suggested Products",
    method: "GET",
    path: "/stores/suggested-products/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Marketplace", "Store"],
    auth: "noauth"
  },
  {
    name: "Carousel",
    method: "GET",
    path: "/home/carousel",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Featured Products",
    method: "GET",
    path: "/home/featured-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Banners",
    method: "GET",
    path: "/home/banners",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Top Offers",
    method: "GET",
    path: "/home/top-offers",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Popular Categories",
    method: "GET",
    path: "/home/popular-categories",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Best Seller Categories",
    method: "GET",
    path: "/home/best-seller-categories",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Best Seller Products",
    method: "GET",
    path: "/home/best-seller-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Suggested Products",
    method: "GET",
    path: "/home/suggested-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Sponsored Categories",
    method: "GET",
    path: "/home/sponsored-categories",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Sponsored Products",
    method: "GET",
    path: "/home/sponsored-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Discounted Products",
    method: "GET",
    path: "/home/discounted-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Pre Order",
    method: "GET",
    path: "/home/pre-order",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Introducing Products",
    method: "GET",
    path: "/home/introducing-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Free Shipping Products",
    method: "GET",
    path: "/home/free-shipping-products",
    pathParams: [],
    queryParams: [],
    folder: ["User", "Home"],
    auth: "noauth"
  },
  {
    name: "Get By Store",
    method: "GET",
    path: "/audit/get-by-store/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Audit"],
    auth: "bearer"
  },
  {
    name: "Get Policy By Type",
    method: "GET",
    path: "/policies",
    pathParams: [],
    queryParams: ["store_id", "type"],
    folder: ["Seller", "Marketplace", "Policies"],
    auth: "bearer"
  },
  {
    name: "Update Store Policy",
    method: "POST",
    path: "/policies/update-policy",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateStorePolicyRequest",
    folder: ["Seller", "Marketplace", "Policies"],
    auth: "bearer"
  },
  {
    name: "Get By User",
    method: "GET",
    path: "/stores/get-by-user",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Create Store",
    method: "POST",
    path: "/stores/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateStoreRequest",
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Store Details",
    method: "GET",
    path: "/stores/show/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Update Store",
    method: "POST",
    path: "/stores/update/:store_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateStoreRequest",
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Delete Store",
    method: "DELETE",
    path: "/stores/delete/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Force Delete",
    method: "DELETE",
    path: "/stores/force-delete/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Restore Store",
    method: "POST",
    path: "/stores/restore/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/stores/switch-activation/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Get Store Categories",
    method: "GET",
    path: "/stores/categories/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Stores"],
    auth: "bearer"
  },
  {
    name: "Get By Store",
    method: "GET",
    path: "/products/get-by-store/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Get Related Products",
    method: "GET",
    path: "/products/related-products/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Get Products with variants",
    method: "GET",
    path: "/products/get-by-store/with-variants/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Create Product",
    method: "POST",
    path: "/products/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateProductRequest",
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Update Product",
    method: "POST",
    path: "/products/update/:product_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateProductRequest",
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Delete Product",
    method: "DELETE",
    path: "/products/delete/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Duplicate Product",
    method: "POST",
    path: "/products/duplicate/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Product Details",
    method: "GET",
    path: "/products/show/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Switch Activation",
    method: "POST",
    path: "/products/switch-activation/:product_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Products"],
    auth: "bearer"
  },
  {
    name: "Get Store Members",
    method: "GET",
    path: "/stores/members/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Update Member Role",
    method: "POST",
    path: "/stores/members/update-role/:member_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdateMemberRoleRequest",
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Get Member Details",
    method: "GET",
    path: "/stores/members/show/:member_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Remove Member",
    method: "DELETE",
    path: "/stores/members/remove/:member_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Restore Member",
    method: "POST",
    path: "/stores/members/restore/:member_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Get Removed Store Members",
    method: "GET",
    path: "/stores/members/members-removed/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Members"],
    auth: "bearer"
  },
  {
    name: "Send Invitation",
    method: "POST",
    path: "/stores/invitations/send",
    pathParams: [],
    queryParams: [],
    bodyType: "SendInvitationRequest",
    folder: ["Seller", "Marketplace", "Store Membership", "Invitation"],
    auth: "bearer"
  },
  {
    name: "Preview Invitation",
    method: "GET",
    path: "/stores/invitations/preview/:token",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Invitation"],
    auth: "noauth"
  },
  {
    name: "Accept Invitation",
    method: "POST",
    path: "/stores/invitations/accept/:token",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Invitation"],
    auth: "bearer"
  },
  {
    name: "Revoke Invitation",
    method: "POST",
    path: "/stores/invitations/revoke/:member_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Store Membership", "Invitation"],
    auth: "bearer"
  },
  {
    name: "Resolve Redierct",
    method: "GET",
    path: "/redirect/resolve",
    pathParams: [],
    queryParams: ["path"],
    folder: ["Seller", "Marketplace", "Redirect"],
    auth: "bearer"
  },
  {
    name: "Get Inventory Items",
    method: "GET",
    path: "/inventory/get-by-store/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Inventory"],
    auth: "bearer"
  },
  {
    name: "Export Variants",
    method: "GET",
    path: "/inventory/export",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Inventory"],
    auth: "bearer"
  },
  {
    name: "Import Variants",
    method: "POST",
    path: "/inventory/import",
    pathParams: [],
    queryParams: [],
    bodyType: "ImportVariantsRequest",
    folder: ["Seller", "Marketplace", "Inventory"],
    auth: "bearer"
  },
  {
    name: "Submit violation",
    method: "POST",
    path: "/violations/submit",
    pathParams: [],
    queryParams: [],
    bodyType: "SubmitviolationRequest",
    folder: ["Seller", "Marketplace", "Violations"],
    auth: "bearer"
  },
  {
    name: "Get Flash Sales by Store",
    method: "GET",
    path: "/flash-sales/by-store/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Flash Sale"],
    auth: "bearer"
  },
  {
    name: "Show Flash Sale Details",
    method: "GET",
    path: "/flash-sales/flash-sale/:flash_sale_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Flash Sale"],
    auth: "bearer"
  },
  {
    name: "Create Flash Sale",
    method: "POST",
    path: "/flash-sales/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateFlashSaleRequest",
    folder: ["Seller", "Marketplace", "Flash Sale"],
    auth: "bearer"
  },
  {
    name: "Update Flash Sale",
    method: "POST",
    path: "/flash-sales/update/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "UpdateFlashSaleRequest",
    folder: ["Seller", "Marketplace", "Flash Sale"],
    auth: "bearer"
  },
  {
    name: "Delete Flash Sale",
    method: "DELETE",
    path: "/flash-sales/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Flash Sale"],
    auth: "bearer"
  },
  {
    name: "Create Coupon",
    method: "POST",
    path: "/coupons/create",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Coupon"],
    auth: "bearer"
  },
  {
    name: "Delete Coupon",
    method: "DELETE",
    path: "/coupons/delete/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Coupon"],
    auth: "bearer"
  },
  {
    name: "Get All Coupons by Store",
    method: "GET",
    path: "/coupons/get-by-store/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Coupon"],
    auth: "bearer"
  },
  {
    name: "Show Coupon Details",
    method: "GET",
    path: "/coupons/show/:coupon_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Coupon"],
    auth: "bearer"
  },
  {
    name: "View Store SLA Rules",
    method: "GET",
    path: "/sla-rules/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "SLA Rules"],
    auth: "bearer"
  },
  {
    name: "Create SLA Rule",
    method: "POST",
    path: "/sla-rules/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreateSLARuleRequest",
    folder: ["Seller", "Marketplace", "SLA Rules"],
    auth: "bearer"
  },
  {
    name: "Delete SLA Rule",
    method: "DELETE",
    path: "/sla-rules/delete/:sla_rule_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "SLA Rules"],
    auth: "bearer"
  },
  {
    name: "View SLA Rule Details",
    method: "GET",
    path: "/sla-rules/show/:sla_rule_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "SLA Rules"],
    auth: "bearer"
  },
  {
    name: "List Tickets for Store",
    method: "GET",
    path: "/support-tickets/get-by-store/:store_id",
    pathParams: [],
    queryParams: ["status", "priority", "issue_type_id", "search", "date_from", "date_to"],
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Reply to Ticket",
    method: "POST",
    path: "/support-tickets/reply/{id}",
    pathParams: ["id"],
    queryParams: [],
    bodyType: "ReplytoTicketRequest",
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Resolve Ticket",
    method: "POST",
    path: "/support-tickets/resolve/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Escalate Ticket",
    method: "POST",
    path: "/support-tickets/escalate/{id}",
    pathParams: ["id"],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Show Ticket Details",
    method: "GET",
    path: "/support-tickets/show/:store_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Get Issue Types",
    method: "GET",
    path: "/support-tickets/issue-types",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Tickets"],
    auth: "bearer"
  },
  {
    name: "Get Product Packages",
    method: "GET",
    path: "/packages/product/:product_id/list",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Get Packages By Store",
    method: "GET",
    path: "/packages/store/:store_id/list",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Create Package",
    method: "POST",
    path: "/packages/product/:product_id/create",
    pathParams: [],
    queryParams: [],
    bodyType: "CreatePackageRequest",
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Get Package Details",
    method: "GET",
    path: "/packages/details/:package_id",
    pathParams: [],
    queryParams: [],
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Update Package",
    method: "POST",
    path: "/packages/update/:package_id",
    pathParams: [],
    queryParams: [],
    bodyType: "UpdatePackageRequest",
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Delete Package",
    method: "DELETE",
    path: "/packages/delete/:package_id",
    pathParams: [],
    queryParams: [],
    bodyType: "DeletePackageRequest",
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Add Item To Package",
    method: "POST",
    path: "/packages/add-items/:package_id",
    pathParams: [],
    queryParams: [],
    bodyType: "AddItemToPackageRequest",
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
  {
    name: "Remove Items From Package",
    method: "POST",
    path: "/packages/remove-items/:package_id",
    pathParams: [],
    queryParams: [],
    bodyType: "RemoveItemsFromPackageRequest",
    folder: ["Seller", "Marketplace", "Packages"],
    auth: "bearer"
  },
];
