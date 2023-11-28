// common
import { createWebHistory, createRouter } from 'vue-router';
import AuthGuard from './services/authGuard';
import Login from './view/auth/login';
import Forgot from './view/auth/forgot';
import Register from './view/auth/register/register';
import NotFound from './view/auth/404';
import RegisterSendMail from './view/auth/register/send-mail';
import AccountVerify from './view/auth/register/register_step2';
import SecurityList from './view/users/security/securityList';
import ConfirmResetPassword from './view/auth/resetPassword/reset.vue';
import ChangePassword from './view/users/changePassword/changePassword';
// import invoiceDetails from './view/users/invoice/invoiceDetails';
import allNotifications from './view/users/notifications/allNotifications';
// users
import ExplorePage from './view/users/explore/explorePage';
import ExploreSearch from './view/users/explore/search/explorePage';
// import favorite from './view/users/favoriteList/allList';
import AllCase from './view/users/cases/allCases';
import RequestsList from './view/users/requests/requestList';
import emailChangeRequest from './view/cpanel/emailChange/emailChangeRequest';
import emailVerifyRequest from './view/cpanel/emailChange/emailVerifyRequest';

// import allMessage from './view/messages/messages';
import userProfile from './view/users/profile/user/userProfile';
import adminProfile from './view/admin/profile/adminProfile';
import UpdateAdminProfile from './view/admin/profile/updateAdminProfile';
import DentistProfile from './view/users/profile/dentist/dentistProfile';
import UpdateDentistProfile from './view/users/profile/dentist/edit/updateDentistProfile';
import UpdateProfile from './view/users/profile/user/updateProfile/updateProfile';
import ListProfileView from './view/users/profile/Lists/index';
import AddProfileService from './view/service/profile_service/service_create';
import UpdateProfileService from './view/service/profile_service/service_create';
import CaseCreate from './view/users/cases/create/create_case';
import CaseEdit from './view/users/cases/edit/edit_case';
import CaseProfile from './view/users/cases/case_profile/caseProfile';
import chatPage from './view/components/ChatApp';
import messages from './view/messages/messages';
import messagesList from './view/messages/messages';
import allMessages from './view/messages/allMessages';
import OtherDeviceList from './view/users/otherDevices/otherDeviceList';
import favoriteList from './view/users/favoriteList/favoriteList';
import addTraining from './view/training/profile_training/addTraining';
// Payment User
import payment from './view/users/payment/index';
import invoiceDetails from './view/users/payment/tabs/invoice/invoiceDetails';
// Payment Admin
import paymentAdmin from './view/admin/payment/index';
import invoiceDetailsAdmin from './view/admin/payment/tabs/invoice/invoiceDetails';


import trashList from './view/users/trash/trash_index';
// admin
// import UserCpanel from './view/admin/users/userList';
// import CasesCpanel from './view/admin/cases/caseList';
import AdminsCpanel from './view/admin/admins/adminList';

// super admin
// import UserCpanelSA from './view/super_admin/users/userList';
import CasesCpanelSA from './view/super_admin/cases/caseList';
import AdminsCpanelSA from './view/super_admin/admins/adminList';
import createAdmin from './view/super_admin/admins/create_admin';
import createServiceType from './view/super_admin/serviceTypes/create_service_type';
import editServiceType from './view/super_admin/serviceTypes/edit_service_type';
import createGateway from './view/super_admin/gateway/create_gateway';
import editGateway from './view/super_admin/gateway/edit_gateway';
import allServiceTypes from './view/super_admin/serviceTypes/allList';

// admin & super admin
import ProfileViewForAdmin from './view/cpanel/userList/profile_view';
import allGateway from './view/super_admin/gateway/gatewayList';
import serviceTypeAdmin from './view/admin/serviceTypes/serviceTypeList';
import featureList from './view/cpanel/feature/feature_list';
import featureAdd from './view/cpanel/feature/feature_add';
import featureSerialize from './view/cpanel/feature/feature_serialize';
import trashCpanel from './view/cpanel/trash/trash_index';
import CasesCpanel from './view/cpanel/cases/allCases';
import UserCpanel from './view/cpanel/userList/list/userList.vue';

// local
import ls from 'localstorage-slim';
import { AES } from 'crypto-js';
import encUTF8 from 'crypto-js/enc-utf8';

ls.config.encrypt = true;
ls.config.secret = 'my-secret-password';
ls.config.decrypter = (data, secret) => {
  try {
    return JSON.parse(AES.decrypt(data, secret).toString(encUTF8));
  } catch (e) {
    // incorrect secret, return the encrypted data instead / or null
    return data; // or return null;
  }
};

const routes = [
  {
    path: '/',
    component: Login,
  },
  // {
  //   path: '/404',
  //   component: ExplorePage,
  // },
  // {
  //   path: '*',
  //   redirect: '/404',
  // },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/recover',
    redirect: '/',
  },
  {
    path: '/forgot',
    component: Forgot,
  },
  {
    path: '/email-change-request',
    component: emailChangeRequest,
    beforeEach: AuthGuard.isLoggedIn,
  },
  {
    path: '/email-verify-request',
    component: emailVerifyRequest,
    beforeEach: AuthGuard.isLoggedIn,
  },

  {
    path: '/register',
    component: Register,
    beforeEach: AuthGuard.isGuest,
  },
  {
    path: '/account-verify/:id',
    // name: "ConfirmResetPassword",
    component: AccountVerify,
    // beforeEach: AuthGuard.isGuest,
  },
  {
    path: '/sendmail',
    component: RegisterSendMail,
  },
  {
    path: '/explore',
    name: 'ExplorePage',
    component: ExplorePage,
    beforeEach: AuthGuard.isProfessional,
  },
  {
    path: '/explore/search',
    name: 'ExploreSearch',
    component: ExploreSearch,
    beforeEach: AuthGuard.isProfessional,
  },
  {
    path: '/favorites/list',
    name: 'favoriteList',
    beforeEach: AuthGuard.isProfessional,
    component: favoriteList,
  },
  {
    path: '/training/add',
    name: 'addTraining',
    beforeEach: AuthGuard.isProfessional,
    component: addTraining,
  },
  {
    path: '/messages/all',
    name: 'allMessages',
    beforeEach: AuthGuard.isLoggedIn,
    component: allMessages,
  },
  {
    path: '/messages/:id',
    name: 'messages',
    beforeEach: AuthGuard.isLoggedIn,
    component: messages,
  },
  {
    path: '/messages/',
    name: 'messagesList',
    beforeEach: AuthGuard.isLoggedIn,
    component: messagesList,
  },
  {
    path: '/security',
    name: 'SecurityList',
    // beforeEach: AuthGuard.isProfessional,
    component: SecurityList,
  },
  {
    path: '/notifications',
    name: 'allNotifications',
    component: allNotifications,
  },
  // Cases
  {
    path: '/cases/all',
    name: 'AllCase',
    beforeEach: AuthGuard.isProfessional,
    component: AllCase,
  },
  {
    path: '/case/create',
    name: 'CaseCreate',
    beforeEach: AuthGuard.isDentist,
    component: CaseCreate,
  },
  {
    path: '/case/edit/:case_id',
    name: 'CaseEdit',
    beforeEach: AuthGuard.isDentist,
    component: CaseEdit,
  },
  {
    path: '/case/:case_id',
    name: 'CaseProfile',
    beforeEach: AuthGuard.isProfessional,
    component: CaseProfile,
  },

  // Requests
  {
    path: '/requests',
    name: 'RequestsList',
    beforeEach: AuthGuard.isProfessional,
    component: RequestsList,
  },
  // payment
  {
    path: '/payments',
    name: 'payment',
    beforeEach: AuthGuard.isProfessional,
    component: payment,
  },
  {
    path: '/invoice/:id',
    name: 'invoiceDetails',
    component: invoiceDetails,
    beforeEach: AuthGuard.isGuest,
  },
  {
    path: '/admin/payments',
    name: 'paymentAdmin',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: paymentAdmin,
  },
  {
    path: '/admin/invoice/:id',
    name: 'invoiceDetailsAdmin',
    component: invoiceDetailsAdmin,
    beforeEach: AuthGuard.isGuest,
  },
  // Trash
  {
    path: '/trash',
    name: 'trashList',
    beforeEach: AuthGuard.isLogged,
    component: trashList,
  },

  // Dentist Route
  {
    path: '/dentist/:id',
    name: 'DentistProfile',
    beforeEach: AuthGuard.isDentist,
    component: DentistProfile,
  },
  {
    path: '/dentist/:id/edit',
    name: 'UpdateDentistProfile',
    beforeEach: AuthGuard.isDentist,
    component: UpdateDentistProfile,
  },

  // Lab Route
  {
    path: '/profile/user',
    name: 'userProfile',
    beforeEach: AuthGuard.isProfessional,
    component: userProfile,
  },
  {
    path: '/edit/user-profile',
    name: 'UpdateProfile',
    beforeEach: AuthGuard.isProfessional,
    component: UpdateProfile,
  },
  // Admin Route
  {
    path: '/profile/admin',
    name: 'adminProfile',
    beforeEach: AuthGuard.isAdmin,
    component: adminProfile,
  },
  {
    path: '/edit/admin-profile',
    name: 'UpdateAdminProfile',
    beforeEach: AuthGuard.isAdmin,
    component: UpdateAdminProfile,
  },
  // {
  //   path: '/cpanel/users',
  //   name: 'UserCpanel',
  //   beforeEach: AuthGuard.isAdmin,
  //   component: UserCpanel,
  // },
  {
    path: '/cpanel/cases',
    name: 'CasesCpanel',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: CasesCpanel,
  },
  {
    path: '/admins',
    name: 'AdminsCpanel',
    beforeEach: AuthGuard.isAdmin,
    component: AdminsCpanel,
  },

  // Super Admin Route
  {
    path: '/cpanel/users',
    name: 'UserCpanel',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: UserCpanel,
  },
  {
    path: '/sa/cases',
    name: 'CasesCpanelSA',
    beforeEach: AuthGuard.isSuperAdmin,
    component: CasesCpanelSA,
  },
  {
    path: '/sa/admins',
    name: 'AdminsCpanelSA',
    beforeEach: AuthGuard.isSuperAdmin,
    component: AdminsCpanelSA,
  },
  {
    path: '/user/:user_id',
    name: 'ListProfileView',
    beforeEach: AuthGuard.isLogged,
    component: ListProfileView,
  },
  {
    path: '/cpanel/user/:user_id',
    name: 'ProfileViewForAdmin',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: ProfileViewForAdmin,
  },
  {
    path: '/cpanel/gateway',
    name: 'allGateway',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: allGateway,
  },
  {
    path: '/cpanel/gateway/add',
    name: 'createGateway',
    beforeEach: AuthGuard.isSuperAdmin,
    component: createGateway,
  },
  {
    path: '/gateway/edit/:id',
    name: 'editGateway',
    beforeEach: AuthGuard.isSuperAdmin,
    component: editGateway,
  },
  {
    path: '/service/list',
    name: 'serviceTypeAdmin',
    beforeEach: AuthGuard.isAdmin,
    component: serviceTypeAdmin,
  },
  {
    path: '/cpanel/services',
    name: 'allServiceTypes',
    beforeEach: AuthGuard.isSuperAdmin,
    component: allServiceTypes,
  },
  {
    path: '/service-type/create',
    name: 'createServiceType',
    beforeEach: AuthGuard.isSuperAdmin,
    component: createServiceType,
  },
  {
    path: '/service-type/edit/:id',
    name: 'editServiceType',
    beforeEach: AuthGuard.isSuperAdmin,
    component: editServiceType,
  },
  {
    path: '/add/admin',
    name: 'createAdmin',
    beforeEach: AuthGuard.isSuperAdmin,
    component: createAdmin,
  },
  {
    path: '/feature/list',
    name: 'featureList',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: featureList,
  },
  {
    path: '/feature/add',
    name: 'featureAdd',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: featureAdd,
  },
  {
    path: '/cpanel/trash',
    name: 'trashCpanel',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: trashCpanel,
  },
  {
    path: '/feature/serialize',
    name: 'featureSerialize',
    beforeEach: AuthGuard.isAdmin_SuperAdmin,
    component: featureSerialize,
  },
  {
    path: '/password/change',
    name: 'ChangePassword',
    beforeEach: AuthGuard.isLogged,
    component: ChangePassword,
  },
  {
    path: '/other-devices',
    name: 'OtherDeviceList',
    beforeEach: AuthGuard.isLogged,
    component: OtherDeviceList,
  },
  {
    path: '/service/add',
    name: 'AddProfileService',
    beforeEach: AuthGuard.isProfessional,
    component: AddProfileService,
  },
  {
    path: '/service/update/:id',
    name: 'UpdateProfileService',
    beforeEach: AuthGuard.isProfessional,
    component: UpdateProfileService,
  },
  {
    path: '/chatPage',
    component: chatPage,
  },
  {
    path: '/recover/:id',
    component: ConfirmResetPassword,
    beforeEach: AuthGuard.isGuest,
  },
  {
    // path: "*",
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// trying to access a restricted page + not logged in
router.beforeEach(async (to, from, next) => {
  const publicPages = [
    '/login',
    '/register',
    '/sendmail',
    '/register/confirm',
    '/home',
    '/forgot',
    '/:catchAll(.*)',
  ];
  // const { authorize } = to.meta;
  const authRequired = !publicPages.includes(to.path);
  // const loggedIn = localStorage.getItem('user');
  const loggedIn = JSON.parse(ls.get('user'));
  // redirect to login page
  if (window.location.href.indexOf('recover') > -1) {
    next();
  } else if (window.location.href.indexOf('account-verify') > -1) {
    next();
  } else if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
