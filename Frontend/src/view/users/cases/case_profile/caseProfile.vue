<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content" id="ext">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-lg-9">
            <!-- Top Header -->
            <div class="row">
              <div class="col-lg-6 col-sm-12 d-flex mb-2 mb-lg-auto pageHeader">
                <router-link
                  :to="{ name: 'AllCase' }"
                  v-if="
                    this.getCurrentUserRole?.role?.role_id === 3 ||
                    this.getCurrentUserRole?.role?.role_id === 4 ||
                    this.getCurrentUserRole?.role?.role_id === 5 ||
                    this.getCurrentUserRole?.role?.role_id === 6
                  "
                >
                  <button class="backBtn">
                    <img
                      v-if="
                        this.getCurrentUserRole?.role?.role_id !== 1 ||
                        this.getCurrentUserRole?.role?.role_id !== 2
                      "
                      src="../../../../assets/images/icons/common/back.svg"
                      alt="back"
                    />
                  </button>
                </router-link>
                <router-link :to="{ name: 'CasesCpanel' }" v-else>
                  <button class="backBtn">
                    <img
                      src="../../../../assets/images/icons/common/back.svg"
                      alt="back"
                    />
                  </button>
                </router-link>
                <h1 class="text-bold-700 mb-0 headerTXT pl-1">Case Profile</h1>
                <!-- <button class="showRTBtn" @click.prevent="caseShow()">
                  Case
                </button> -->
                <div
                  class="list-container"
                  :class="caseSidebar ? 'active' : ''"
                >
                  <button
                    class="more-button"
                    aria-label="Menu Button"
                    @click.prevent="caseShow()"
                  >
                    <div class="menu-icon-wrapper">
                      <div class="menu-icon-line half first"></div>
                      <div class="menu-icon-line"></div>
                      <div class="menu-icon-line half last"></div>
                    </div>
                  </button>
                </div>
                <!-- Button -->
              </div>
              <div
                class="col-lg-6 col-sm-12 text-right d-flex d-lg-block justify-content-between"
              >
                <router-link
                  v-if="this.getCurrentUserRole.role.role_id === 3"
                  :to="{
                    path: '/case/edit/' + this.case_id,
                    params: { case_id: this.case_id },
                  }"
                >
                  <button class="actionBtn settingsIcon">
                    <img
                      src="../../../../assets/images/icons/common/config.svg"
                      alt="config"
                    />
                  </button>
                </router-link>
                <button
                  v-if="
                    (this.getCurrentUserRole.role.role_id === 3 ||
                      this.getCurrentUserRole.role.role_id === 5) &&
                    confirmPayData?.length > 0
                  "
                  class="actionBtn"
                  data-bs-toggle="modal"
                  href="#confirmPayModal"
                  role="button"
                >
                  <img
                    class="confirmPayIcon"
                    src="../../../../assets/images/icons/common/confirm.svg"
                    alt="config"
                    style="margin-right: 10px"
                  />
                  Confirm Pay
                </button>
                <button
                  class="actionBtn"
                  data-bs-toggle="modal"
                  @click="showConfirmPayError"
                  role="button"
                  v-if="confirmPayDataL"
                >
                  <img
                    class="confirmPayIcon"
                    src="../../../../assets/images/icons/common/confirm.svg"
                    alt="config"
                    style="margin-right: 10px"
                  />
                  Confirm Pay
                </button>
              </div>
              <div class="col-12">
                <hr />
              </div>
            </div>
            <!-- Confirm PAY Modal -->
            <div
              class="modal fade"
              id="confirmPayModal"
              aria-hidden="true"
              aria-labelledby="confirmPayModal"
              tabindex="-1"
            >
              <div
                class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered"
              >
                <div class="modal-content">
                  <div class="modal-header">
                    <!-- Header Text -->
                    <h5 class="modal-title" id="confirmPayModal">
                      CONFIRM COMPLETED SERVICES
                    </h5>
                    <!-- Close Button -->
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i class="fa fa-close"></i> Close
                    </button>
                  </div>
                  <div class="modal-body">
                    <!-- <h2>No Services have completed yest</h2> -->
                    <div v-for="(item, index) in confirmPayData" :key="index">
                      <div class="d-flex justify-content-between">
                        <p>{{ item.service_name }}</p>
                        <!-- <p>Mark Complete</p> -->
                      </div>
                      <!-- Service Group/Card -->
                      <div class="serviceGroup flex-wrap mb-2">
                        <div class="col-12 d-flex align-items-center">
                          <!-- Image -->
                          <img
                            v-if="item.profile_image"
                            :src="confirmPayBaseImg + '/' + item.profile_image"
                            @error="replaceByDefaultImg"
                            alt="img"
                          />

                          <!-- Consultant & Status -->
                          <div class="w-100 d-flex flex-column mx-1">
                            <p class="title">{{ item.name }}</p>
                            <p class="service">
                              <label>Service Status :</label>
                              <span v-if="item.service_status === 'Complete'">
                                {{ item.service_status }}
                                <i class="feather icon-check-circle"></i
                              ></span>
                            </p>
                          </div>
                          <!-- label -->
                          <span v-if="item.is_approve === 1" class="paid"
                            >PAID</span
                          >
                          <!-- Checkbox -->
                          <a
                            v-if="item.is_approve !== 1"
                            data-bs-toggle="collapse"
                            href="#collapseExample"
                            role="button"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                            @click.prevent="actionForConfirmPay(item.id)"
                          >
                            <i
                              v-if="isChecked"
                              class="feather icon-chevron-up"
                            ></i>
                            <i
                              v-if="!isChecked"
                              class="feather icon-chevron-down"
                            >
                            </i>
                          </a>
                        </div>
                        <div
                          v-if="
                            item?.id == selectedConfirmPayId &&
                            item.is_approve !== 1
                          "
                          class="mt-1 collapse col-12"
                          id="collapseExample"
                        >
                          <div class="card card-body pb-1 mb-0">
                            <div class="d-flex justify-content-between">
                              <!-- <div class="col"> -->
                              <label>Rating : </label>
                              <div class="rating">
                                <star-rating
                                  :rating="item.rating"
                                  v-model="ratingFilter"
                                  @update:rating="setRating"
                                  :star-size="16"
                                  :show-rating="false"
                                  :border-width="2"
                                  :rounded-corners="true"
                                  :padding="2"
                                ></star-rating>
                              </div>
                              <!-- </div> -->
                            </div>
                            <!-- <div class="col-12"> -->
                            <textarea
                              type="text"
                              v-model="item.review"
                              @change="changeReason(item.review)"
                              class="my-1 form-control"
                              placeholder="Enter description"
                            >
                            </textarea>
                            <!-- </div> -->
                            <button
                              class="w-100 btn btn-primary"
                              @click.prevent="submitConfirmPay(item.id)"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                      <!-- Service Group End -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Confirm Pay Modal END -->

            <div class="content-body">
              <div class="col-lg-6">
                <!-- case information -->
                <CaseDetails
                  :caseInfo="this.caseInformation"
                  :userRole="this.getCurrentUserRole.role.role_id"
                />
              </div>
              <div class="col-lg-12">
                <section>
                  <!-- Patient Detail -->
                  <div class="row">
                    <!-- <div class="col-lg-9 p-0"> -->
                    <div class="card-body px-0">
                      <!-- Tab Start -->
                      <ul
                        class="nav nav-tabs caseProfileSection"
                        role="tablist"
                      >
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            @click.prevent="setActive('caseFiles')"
                            :class="{ active: isActive('caseFiles') }"
                            href="#caseFiles"
                          >
                            <h4 class="tabHeaderTxt">Case Files</h4></a
                          >
                        </li>
                        <li
                          class="nav-item"
                          v-if="
                            this.getCurrentUserRole.role.role_id === 4 ||
                            this.getCurrentUserRole.role.role_id === 5 ||
                            this.getCurrentUserRole.role.role_id === 6
                          "
                        >
                          <a
                            class="nav-link"
                            @click.prevent="setActive('myService')"
                            :class="{ active: isActive('myService') }"
                            href="#myService"
                          >
                            <!-- {{ this.getCurrentUserRole.role.role_id }} -->
                            <h4 class="tabHeaderTxt">My Services</h4></a
                          >
                        </li>

                        <li
                          class="nav-item"
                          v-if="this.getCurrentUserRole.role.role_id === 3"
                        >
                          <a
                            class="nav-link"
                            @click.prevent="setActive('paymentHistory')"
                            :class="{ active: isActive('paymentHistory') }"
                            href="#paymentHistory"
                            ><h4 class="tabHeaderTxt">Payment History</h4></a
                          >
                        </li>
                      </ul>
                      <!-- Tab Content Start -->
                      <div class="tab-content">
                        <div
                          v-if="
                            this.getCurrentUserRole.role.role_id === 4 ||
                            this.getCurrentUserRole.role.role_id === 5 ||
                            this.getCurrentUserRole.role.role_id === 6
                          "
                          class="tab-pane"
                          :class="{ 'active show': isActive('myService') }"
                          id="myService"
                        >
                          <MyServices
                            :caseID="this.case_id"
                            :caseServiceList="this.serviceList"
                            :caseInfo="this.caseDetails"
                            :getCaseDetails="this.getCaseDetails"
                          />
                        </div>
                        <div
                          class="tab-pane top-mr"
                          :class="{ 'active show': isActive('caseFiles') }"
                          id="caseFiles"
                        >
                          <!-- Case File Content -->
                          <UploadCaseFiles
                            :caseID="this.case_id"
                            :caseFileList="this.uploadedCaseFiles"
                            :caseInfo="this.caseInformation"
                            :userRole="this.getCurrentUserRole.role.role_id"
                          />
                          <!--End Case File Content -->
                        </div>
                        <!-- Case Tab End -->

                        <!-- Forum Tab End -->
                        <div
                          class="tab-pane"
                          v-if="this.getCurrentUserRole.role.role_id === 3"
                          :class="{ 'active show': isActive('paymentHistory') }"
                          id="paymentHistory"
                        >
                          <PaymentHistory :caseID="this.case_id" />
                        </div>

                        <!-- Payment History Tab End -->
                      </div>
                    </div>
                    <!-- </div> -->
                  </div>
                </section>
              </div>
            </div>
          </div>

          <!-- Case Member -->
          <div class="col-lg-3">
            <!-- Filter Section -->
            <div
              class="filterContainer"
              :class="caseSidebar ? 'menuOpen' : 'menuClose'"
            >
              <p class="caseMemberTxt">Case Members</p>

              <!-- Dentist Name -->
              <div class="memberGroup">
                <label class="headerLabel">Dentist</label>
                <div class="squareDiv">
                  <img
                    v-if="!dentistInfo.profile_pic"
                    src="../../../../assets/images/profile/no-user.png"
                    @error="replaceByDefaultImg"
                    class="pic"
                    alt="pic"
                  />
                  <img
                    @error="replaceByDefaultImg"
                    v-if="dentistInfo.profile_pic"
                    :src="
                      dentistInfo.imageFolderPath +
                      '/' +
                      dentistInfo.profile_pic
                    "
                    class="pic"
                    alt="pic"
                  />
                  <p class="link name text-capitalize">
                    {{
                      dentistInfo.creator_name
                        ? dentistInfo.creator_name
                        : 'Not available'
                    }}
                  </p>
                </div>
              </div>
              <!-- Dentist Name -->

              <!-- Service / Members -->
              <div
                class="memberGroup"
                v-for="(service, index) in serviceList"
                :key="index"
                v-show="service.service.active_status == 1"
              >
                <div class="title-block">
                  <!-- <div class="col"> -->
                  <hr />
                  <div class="headerLabel line">
                    {{
                      service.service.name
                        ? service.service.name
                        : 'Name not found'
                    }}
                  </div>
                </div>
                <!-- Member Details -->
                <div v-for="(item, index) in service.caseMember" :key="index">
                  <div class="squareDiv" v-if="item.isOption === false">
                    <button
                      v-if="
                        (item.recCancelBtn === true &&
                          moment(item.current, 'DD.MM.YYYY').diff(
                            moment(item.created_at, 'DD.MM.YYYY'),
                            'hours',
                          ) <= 72) ||
                        item.senCancelBtn === true
                      "
                      type="button"
                      class="option"
                      @click.prevent="
                        onMemberOptionAction(item.id, service.service.name)
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <br />
                    <img
                      v-if="!item.profile_image"
                      src="../../../../assets/images/profile/no-user.png"
                      @error="replaceByDefaultImg"
                      class="pic"
                      alt="pic"
                    />
                    <router-link
                      class="link"
                      :to="'/user/' + item.user_id"
                    >
                      <img
                        @error="replaceByDefaultImg"
                        v-if="item.profile_image"
                        :src="
                          dentistInfo.imageFolderPath + '/' + item.profile_image
                        "
                        class="pic"
                        alt="pic"
                      />
                    </router-link>
                    <p class="name">
                      <router-link
                        class="link"
                        :to="'/user/' + item.user_id"
                        v-if="this.getUserId !== item.user_id"
                      >
                        {{
                          item.profile_name
                            ? item.profile_name
                            : 'Name not found'
                        }}</router-link
                      >
                      <router-link
                        to="#"
                        v-if="this.getUserId === item.user_id"
                      >
                        {{
                          item.profile_name
                            ? item.profile_name
                            : 'Name not found'
                        }}</router-link
                      >
                      <br />
                      <span>Status :</span>
                      <b class="serviceStatus">
                        {{ item.service_status === 1 ? 'TO DO' : '' }}
                        {{ item.service_status === 2 ? 'In Progress' : '' }}
                        {{ item.service_status === 3 ? 'Completed' : '' }}
                      </b>
                    </p>
                    <p
                      class="d-block m-auto"
                      v-if="item.user_id !== this.getUserId"
                    >
                      <router-link
                        :to="'/messages/' + item.user_id"
                        tag="button"
                      >
                        <img
                          src="../../../../assets/images/icons/common/message_icon.svg"
                          alt="message_icon"
                          style="width: 30px"
                        />
                      </router-link>
                    </p>
                  </div>

                  <!-- if option / cancel request -->
                  <div class="squareDiv" v-if="item.isOption === true">
                    <button
                      type="button"
                      class="option"
                      @click.prevent="
                        onMemberOptionAction(item.id, service.service.name)
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <button
                      type="button"
                      class="cancelRequest"
                      data-bs-toggle="modal"
                      href="#cancelMember"
                      role="button"
                    >
                      <i class="fa fa-exclamation"></i> Cancel Request
                    </button>
                  </div>
                </div>
                <!-- Request Status START-->
                <div
                  v-for="(item, index) in service.caseMemberRequest"
                  :key="index"
                  v-show="service.caseMemberRequest.length > 0"
                >
                  <div class="squareDiv" v-if="service.isOption === false">
                    <button
                      v-if="item.created_by === this.getUserId"
                      type="button"
                      class="option"
                      @click.prevent="
                        onOptionAction(item.id, service.service.name, item.id)
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <img
                      v-if="!item.profile_image"
                      src="../../../../assets/images/profile/no-user.png"
                      class="pic"
                      alt="pic"
                    />
                    <img
                      @error="replaceByDefaultImg"
                      v-if="item.profile_image"
                      :src="
                        dentistInfo.imageFolderPath + '/' + item.profile_image
                      "
                      class="pic"
                      alt="pic"
                    />
                    <p class="name memberRequest text-capitalize">
                      {{
                        item.profile_name ? item.profile_name : 'Name not found'
                      }}
                      <br />
                      <!-- <span>Service Status :</span> -->
                      <label class="text-red mr-1 RR">
                        {{
                          item.service_provider_response === 1 ? 'Approved' : ''
                        }}
                        {{
                          item.service_provider_response === 2 ? 'Reject' : ''
                        }}
                        {{
                          item.service_provider_response === 3
                            ? 'Request Pending'
                            : ''
                        }}
                        {{
                          item.service_provider_response === 4
                            ? 'Time Over'
                            : ''
                        }}
                      </label>
                      <!-- <router-link to="/requests">View</router-link> -->
                    </p>
                    <p class="d-block m-auto">
                      <router-link
                        :to="'/messages/' + item.user_id"
                        tag="button"
                      >
                        <img
                          src="../../../../assets/images/icons/common/message_icon.svg"
                          alt="message_icon"
                          style="width: 30px"
                        />
                      </router-link>
                    </p>
                  </div>

                  <!-- if option / cancel request -->
                  <div class="squareDiv" v-if="service.isOption === true">
                    <button
                      type="button"
                      class="option"
                      @click.prevent="
                        onOptionAction(
                          this.isCancelClicked,
                          service.service.name,
                          item.id,
                        )
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <button
                      type="button"
                      class="cancelRequest"
                      data-bs-toggle="modal"
                      href="#cancelServiceRequest"
                      role="button"
                    >
                      <i class="fa fa-exclamation"></i> Cancel Request
                    </button>
                  </div>
                </div>
                <!-- Request Status End-->
                <!-- Recommend Status START-->
                <div
                  v-for="(item, index) in service.caseMemberRecommendRequest"
                  :key="index"
                  v-show="service.caseMemberRecommendRequest.length > 0"
                >
                  <div class="squareDiv" v-if="service.isOption === false">
                    <button
                      v-if="item.created_by === this.getUserId"
                      type="button"
                      class="option"
                      @click.prevent="
                        onOptionAction(item.id, service.service.name, item.id)
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <img
                      v-if="!item.profile_image"
                      src="../../../../assets/images/profile/no-user.png"
                      class="pic"
                      alt="pic"
                      @error="replaceByDefaultImg"
                    />
                    <img
                      v-if="item.profile_image"
                      :src="
                        dentistInfo.imageFolderPath + '/' + item.profile_image
                      "
                      class="pic"
                      alt="pic"
                      @error="replaceByDefaultImg"
                    />
                    <p class="name memberRequest text-capitalize">
                      {{
                        item.profile_name ? item.profile_name : 'Name not found'
                      }}
                      <br />
                      <!-- <span>Service Status :</span> -->
                      <label class="text-red mr-1 RR">
                        {{
                          item.service_provider_response === 1 ? 'Approved' : ''
                        }}
                        {{
                          item.service_provider_response === 2 ? 'Reject' : ''
                        }}
                        {{
                          item.service_provider_response === 3
                            ? 'Recommend Pending'
                            : ''
                        }}
                        {{
                          item.service_provider_response === 4
                            ? 'Time Over'
                            : ''
                        }}
                      </label>
                      <!-- <router-link to="/requests">View</router-link> -->
                    </p>
                    <p class="d-block m-auto">
                      <router-link to="/messages/all">
                        <img
                          src="../../../../assets/images/icons/common/message_icon.svg"
                          alt="message_icon"
                          style="width: 30px"
                        />
                      </router-link>
                    </p>
                  </div>

                  <!-- if option / cancel request -->
                  <div class="squareDiv" v-if="service.isOption === true">
                    <button
                      type="button"
                      class="option"
                      @click.prevent="
                        onOptionAction(
                          this.isCancelClicked,
                          service.service.name,
                          item.id,
                        )
                      "
                    >
                      <i class="fa fa-ellipsis-h"></i>
                    </button>
                    <button
                      type="button"
                      class="cancelRequest"
                      data-bs-toggle="modal"
                      href="#cancelServiceRecommendRequest"
                      role="button"
                    >
                      <i class="fa fa-exclamation"></i> Cancel Request
                    </button>
                  </div>
                </div>
                <!-- Request Status End-->
                <!-- Add Service -->
                <!-- <div> -->
                <div
                  class="memberGroup squareDiv"
                  v-if="
                    service.caseMember.length === 0 &&
                    service.service.can_add_member === false
                  "
                >
                  <h5 class="m-auto text-secondary">No Member Added Yet</h5>
                </div>
                <!-- </div> -->
                <div
                  v-if="
                    service.caseMember.length === 0 ||
                    service.caseMember[service.caseMember.length - 1]
                      ?.service_status === 3
                  "
                >
                  <div
                    class="memberGroup squareDiv"
                    v-if="
                      service.isMember === 1 &&
                      service.service.can_add_member === true
                    "
                  >
                    <!-- <h5
                      v-if="service.caseMember.length === 0"
                      class="m-auto text-secondary"
                    >
                      No Member Added Yet
                    </h5> -->
                    <button
                      v-if="
                        service.service.can_add_member === true &&
                        accountStatus === 'completed'
                      "
                      type="button"
                      class="w-100 justify-content-center addNew"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                      @click.prevent="
                        getCaseSuggestions(
                          service.service.id,
                          service.service.name,
                          this.case_id,
                        )
                      "
                    >
                      <img
                        src="../../../../assets/images/icons/common/add-circle-outline.svg"
                        alt="add-circle-outline"
                        style="margin: 6px auto"
                      />
                    </button>
                    <button
                      v-if="
                        accountStatus !== 'completed' &&
                        this.getCurrentUserRole.role.role_id !== 4
                      "
                      type="button"
                      class="w-100 justify-content-center addNew"
                      @click.prevent="showError"
                    >
                      <img
                        src="../../../../assets/images/icons/common/add-circle-outline.svg"
                        alt="add-circle-outline"
                        style="margin: 6px auto"
                      />
                    </button>
                    <button
                      v-if="
                        accountStatus !== 'completed' &&
                        this.getCurrentUserRole.role.role_id === 4
                      "
                      type="button"
                      class="w-100 justify-content-center addNew"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                      @click.prevent="
                        getCaseSuggestions(
                          service.service.id,
                          service.service.name,
                          this.case_id,
                        )
                      "
                    >
                      <img
                        src="../../../../assets/images/icons/common/add-circle-outline.svg"
                        alt="add-circle-outline"
                        style="margin: 6px auto"
                      />
                    </button>
                  </div>
                </div>
                <!-- Add Service End -->
              </div>
            </div>
            <!-- Filter End -->
          </div>
          <!-- Case Member End -->

          <!-- Add New Service Part START -->
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div class="offcanvas-header">
              <h1 class="addMemberTxt">Add Member</h1>
              <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <i class="fa fa-close"></i>
              </button>
            </div>
            <div class="offcanvas-body">
              <!-- Add Member -->
              <!-- Service Name -->
              <div class="serviceSelectGroup">
                <div class="d-flex mb-1">
                  <label>{{ this.selectedSuggestionName }}</label>
                  <hr />
                </div>
                <Multiselect
                  v-model="serviceMember.value"
                  v-bind="serviceMember"
                  :searchable="true"
                >
                  <template v-slot:option="{ option }">
                    <img
                      class="character-option-icon searchOptionImg"
                      :src="option.userImagePath + '/' + option.userImage"
                      @error="replaceByDefaultProImage"
                    />
                    <div class="searchOptionName">
                      <p class="text-dark">
                        {{ option.name }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="btn-close add searchOptionButton"
                      data-bs-dismiss="offcanvas"
                      aria-label="Close"
                      @click.prevent="
                        serviceAddConfirmation(
                          option.userId,
                          option.service_price,
                        )
                      "
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </template>
                </Multiselect>
                <!-- Search Field -->
              </div>
              <div class="serviceSuggestions">
                <div class="d-flex">
                  <label>Suggestions</label>
                  <hr />
                </div>
                <!-- Suggestions -->
                <div class="scroller">
                  <div class="overflow-auto">
                    <div
                      class="row suggestionDiv mx-0"
                      v-for="(user, index) in suggestions"
                      :key="index"
                    >
                      <!-- Image -->
                      <div class="col-2 h-100 justify-content-center px-0">
                        <img
                          v-if="!user.userProfileInfo.profile_image"
                          src="https://icon-library.com/images/suggestion-icon/suggestion-icon-6.jpg"
                          alt="pic"
                        />
                        <img
                          onerror="javascript:this.src='https://icon-library.com/images/suggestion-icon/suggestion-icon-6.jpg'"
                          v-if="user.userProfileInfo.profile_image"
                          :src="
                            user.userProfileInfo.profileImageFolderPath +
                            '/' +
                            user.userProfileInfo.profile_image
                          "
                          alt="pic"
                        />
                      </div>
                      <!-- Details/Star -->
                      <div class="col-9 d-flex align-items-center">
                        
                          <p class="serviceProvider text-capitalize">
                            {{
                              user.userProfileInfo.name
                                ? user.userProfileInfo.name
                                : user.userProfileInfo.first_name +
                                  ' ' +
                                  user.userProfileInfo.last_name
                            }}
                          </p>
                        <!-- <p class="serviceProvider">****</p> -->
                      </div>
                      <div class="col-1 px-0">
                        <button
                          type="button"
                          class="btn-close add cursor-pointer"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                          @click.prevent="
                            serviceAddConfirmation(
                              user.user_id,
                              user.service_price,
                            )
                          "
                        >
                          <i class="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <p
                      class="alert alert-info mt-1"
                      v-if="suggestions.length === 0"
                    >
                      No Suggestions Available !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Add New Service Part END -->

          <!-- Send Request for Service ADD - MODAL -->
          <div
            class="modal fade"
            :class="showSendRequest ? 'show' : ''"
            :style="{
              visibility: showSendRequest ? 'visible' : 'hidden',
              display: showSendRequest ? 'block' : '',
              background: showSendRequest ? 'rgba(0,0,0,0.5)' : '',
              zIndex: showSendRequest ? '2000' : '',
            }"
            id="sendServiceRequest"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <p class="serviceDetails">
                  Service : <b>{{ selectedSuggestionName }}</b>
                  <span class="float-right text-bold-600">{{
                    '$' + user_price
                  }}</span>
                </p>
                <div class="modal-body p-0">
                  <div class="row ct">
                    <div class="col-6 caseTxt">
                      <div>Case ID:</div>
                    </div>
                    <div class="col-6 caseTotal">
                      <div>{{ caseInformation.case_id }}</div>
                    </div>
                    <div
                      class="col-6 caseTxt mb-0"
                      v-if="this.getCurrentUserRole.role.role_id === 3"
                    >
                      <div>Patient Name:</div>
                    </div>
                    <div
                      class="col-6 caseTotal"
                      v-if="this.getCurrentUserRole.role.role_id === 3"
                    >
                      <div>
                        {{ caseInformation.patient_name }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="this.getCurrentUserRole.role.role_id === 3"
                  >
                    <div
                      class="col-12 mt-1 pb-1 pt-2"
                      style="border-top: 1px solid #e3e3e3"
                    >
                      <h4>Payment Method</h4>
                    </div>
                    <!-- Payment Radio button -->
                    <!-- <div class="col-6">
                      <div class="plans">
                        <label class="plan basic-plan" for="basic">
                          <input
                            type="radio"
                            value="1"
                            v-model="paymentType"
                            @change="paymentTypeChange"
                          />
                          <div class="plan-content">
                            <img
                              loading="lazy"
                              src="./ios-card.svg"
                              alt="icon"
                            />
                            <div class="plan-details">
                              <span>Default Card</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div> -->
                    <div class="col-6">
                      <div class="plans">
                        <label class="plan complete-plan" for="complete">
                          <input
                            type="radio"
                            value="2"
                            v-model="paymentType"
                            @change="paymentTypeChange"
                          />
                          <div class="plan-content">
                            <img
                              loading="lazy"
                              src="./ios-walet.svg"
                              alt="icon"
                            />
                            <div class="plan-details">
                              <span>Easifi Wallet</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <!-- <div class="col-6">
                      {{ paymentType }}
                    </div> -->
                    <!--End Payment Radio button -->
                  </div>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                  <button
                    class="btn-close"
                    data-bs-dismiss="modal"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    aria-label="Close"
                    @click.prevent="toggleShowSendRequest()"
                  >
                    Cancel
                  </button>
                  <button
                    v-if="
                      this.getCurrentUserRole.role.role_id === 3 ||
                      this.getCurrentUserRole.role.role_id === 5
                    "
                    class="btn-send-request"
                    data-bs-dismiss="modal"
                    @click.prevent="addServiceAction()"
                  >
                    Send Request
                  </button>
                  <button
                    v-if="this.getCurrentUserRole.role.role_id === 4"
                    class="btn-send-request"
                    data-bs-dismiss="modal"
                    @click.prevent="addServiceAction()"
                  >
                    Recommend
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- MODAL END -->

          <!-- Alert/MODAL confirmation for Cancel Request -->
          <div
            class="modal fade"
            id="cancelServiceRequest"
            aria-hidden="true"
            aria-labelledby="cancelServiceRequest"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <p class="serviceDetails">
                  Are you sure you want to cancel the service
                  <b class="red">{{ serviceName }}</b> for the following case :
                </p>
                <div class="modal-body">
                  <table class="ct">
                    <th class="caseTxt" width="100px">Case ID</th>
                    <th
                      class="patientTxt"
                      v-if="this.getCurrentUserRole.role.role_id === 3"
                    >
                      Patient Name
                    </th>
                    <tbody>
                      <td class="caseTotal">{{ caseInformation.case_id }}</td>
                      <td
                        class="patientName"
                        v-if="this.getCurrentUserRole.role.role_id === 3"
                      >
                        {{ caseInformation.patient_name }}
                      </td>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                  <button
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                  <button
                    class="btn-delete-request"
                    data-bs-dismiss="modal"
                    @click.prevent="onCancelAction()"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Alert END -->
          <!-- Alert/MODAL confirmation for Cancel Member -->
          <div
            class="modal fade"
            id="cancelMember"
            aria-hidden="true"
            aria-labelledby="cancelMember"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <p class="serviceDetails">
                  Are you sure you want to cancel the Member
                  <b class="red">{{ serviceName }}</b> for the following case :
                </p>
                <div class="modal-body">
                  <table class="ct">
                    <th class="caseTxt" width="100px">Case ID</th>
                    <th
                      class="patientTxt"
                      v-if="this.getCurrentUserRole.role.role_id === 3"
                    >
                      Patient Name
                    </th>
                    <tbody>
                      <td class="caseTotal">{{ caseInformation.case_id }}</td>
                      <td
                        class="patientName"
                        v-if="this.getCurrentUserRole.role.role_id === 3"
                      >
                        {{ caseInformation.patient_name }}
                      </td>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                  <button
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                  <button
                    class="btn-delete-request"
                    data-bs-dismiss="modal"
                    @click.prevent="onCancelMemberAction()"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Alert END -->
          <!-- Alert/MODAL confirmation for Cancel Request -->
          <div
            class="modal fade"
            id="cancelServiceRecommendRequest"
            aria-hidden="true"
            aria-labelledby="cancelServiceRecommendRequest"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <p class="serviceDetails">
                  Are you sure you want to cancel the service
                  <b class="red">{{ serviceName }}</b> for the following case :
                </p>
                <div class="modal-body">
                  <table class="ct">
                    <th class="caseTxt" width="100px">Case ID</th>
                    <th
                      class="patientTxt"
                      v-if="this.getCurrentUserRole.role.role_id === 3"
                    >
                      Patient Name
                    </th>
                    <tbody>
                      <td class="caseTotal">{{ caseInformation.case_id }}</td>
                      <td
                        class="patientName"
                        v-if="this.getCurrentUserRole.role.role_id === 3"
                      >
                        {{ caseInformation.patient_name }}
                      </td>
                    </tbody>
                  </table>
                </div>
                <div class="modal-footer d-flex flex-nowrap">
                  <button
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Close
                  </button>
                  <button
                    class="btn-delete-request"
                    data-bs-dismiss="modal"
                    @click.prevent="onCancelRecommendation()"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Alert END -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CaseDetails from './caseDetails.vue';
import UploadCaseFiles from '../files/uploadFile.vue';
import PaymentHistory from '../payment/paymentHistory.vue';
import MyServices from '../services/myServices.vue';
import { createToast } from 'mosha-vue-toastify';
import caseAPI from '../../../../services/case.API';
// import USERS_API from '../../../../services/user.API';
import Multiselect from '@vueform/multiselect';
import proImg from '../../../../assets/images/profile/no-user.png';
import requestsAPI from '../../../../services/requests.API';
import paymentAPI from '../../../../services/payment.API';
import StarRating from 'vue-star-rating';
import moment from 'moment';
export default {
  name: 'CaseProfile',
  components: {
    CaseDetails,
    UploadCaseFiles,
    PaymentHistory,
    Multiselect,
    MyServices,
    StarRating,
  },
  mounted() {
    this.$store.dispatch('profile/loadUser');
    // console.log(this.getCurrentUserRole.role.role_id);
    // console.log('Role =============' + this.getCurrentUserRole.role.role_id);
    this.case_id = Number(this.$route.params.case_id);
    if (this.case_id) {
      this.getCaseDetails(this.case_id);
    } else {
      this.$router.push('/cases/all');
      createToast('Case details not found', {
        type: 'danger',
        position: 'top-right',
        duration: 2000,
        showIcon: true,
      });
    }
    if (
      this.getCurrentUserRole.role.role_id === 4 ||
      this.getCurrentUserRole.role.role_id === 5 ||
      this.getCurrentUserRole.role.role_id === 6
    ) {
      this.setActive('caseFiles');
    } else {
      this.setActive('caseFiles');
    }

    // get payment info
    paymentAPI.getAccountStatus().then(response => {
      if (response.data.status === 200 && response.data.success === true) {
        if (response.data.account_status) {
          this.accountStatus = response.data.account_status;
        }
      }
    });
    // get confirm pay data
    this.getConfirmPayData();
  },
  data() {
    return {
      user_price: 0,
      reviewComment: '',
      confirmPayData: [],
      confirmPayBaseImg: '',
      accountStatus: '',
      case_id: 0,
      base_url: '',
      caseDetails: '',
      caseInformation: {},
      activeItem: '',
      selectedCaseService: '',
      uploadedCaseFiles: [],
      dentistInfo: {},
      serviceList: [],
      isCancelClicked: '',
      serviceName: '',
      suggestions: [],
      selectedSuggestion: '',
      user_id_to_add: '',
      selectedSuggestionName: '',
      showSendRequest: false,
      canAddService: false,
      howAreYouFeeling: '2',
      paymentType: '2',
      value: {},
      serviceMember: {
        value: null,
        placeholder: 'Search Member',
        closeOnSelect: false,
        searchable: true,
        trackBy: 'name',
        label: 'name',
        options: [],
      },
      reqID: '',
      isChecked: false,
      cardList: [],
      caseSidebar: false,
      ratingFilter: 0,
      selectedConfirmPayId: '',
      selectedMemberID: '',
      confirmPayDataL: true,
      currentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  },
  computed: {
    getUserRole() {
      return this.$store.state.profile.role_id;
    },
    getUserId() {
      return this.$store.state.profile.user_id;
    },
    getCurrentUserRole() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.moment = moment;
  },
  methods: {
    replaceByDefaultImg(e) {
      e.target.src = proImg;
    },
    showConfirmPayError() {
      createToast('Sorry, No case completed yet', {
        type: 'danger',
        position: 'top-right',
        duration: 2000,
        showIcon: true,
      });
    },
    setRating(rating) {
      this.ratingFilter = rating;
    },
    changeReason(reason) {
      this.reviewComment = reason;
    },
    // get confirm pay data
    getConfirmPayData() {
      caseAPI
        .getConfirmPayData(this.case_id)
        .then(response => {
          if (response.data.success === true) {
            this.confirmPayDataLength = response.data.data.map(e => e);
            this.confirmPayData = response.data.data;
            this.confirmPayBaseImg = response.data.imageFolderPath;
            this.confirmPayDataL = false;
          }
        })
        .catch(error => {
          console.log(error.response.data.success);
          if (error.response.data.success === false) {
            if (
              this.getCurrentUserRole.role.role_id == 4 ||
              this.getCurrentUserRole.role.role_id == 6 ||
              this.getCurrentUserRole.role.role_id == 2 ||
              this.getCurrentUserRole.role.role_id == 1
            ) {
              this.confirmPayDataL = false;
            }
          }
        });
    },
    // action for confirm pay
    actionForConfirmPay(id) {
      if (!this.isChecked) {
        this.selectedConfirmPayId = id;
        this.isChecked = !this.isChecked;
      } else {
        // this.selectedConfirmPayId = '';
        this.isChecked = !this.isChecked;
      }

      // console.log(this.selectedConfirmPayId, this.isChecked);
    },
    // submit confirm pay
    submitConfirmPay(id) {
      let data = {
        id: id,
        rating: this.ratingFilter,
        review: this.reviewComment,
      };
      // console.log(data);
      if (data) {
        caseAPI.submitConfirmPayData(data).then(
          response => {
            if (response.data.success === true) {
              // show alart
              createToast(response.data.message, {
                type: 'success',
                position: 'top-right',
                duration: 2000,
                showIcon: true,
              });
              // reset data
              this.id = '';
              this.ratingFilter = 0;
              this.reviewComment = '';
              // update modal data
              this.getConfirmPayData();

              // payment update
              this.getAllTransactions();
            } else {
              // show error
              createToast(response.data.message, {
                type: 'danger',
                position: 'top-right',
                duration: 2000,
                showIcon: true,
              });
            }
          },
          err => {
            // if server error
            if (err.response.data.success === false) {
              createToast(err.response.data.message, {
                type: 'danger',
                position: 'top-right',
                duration: 2000,
                showIcon: true,
              });
            }
          },
        );
      }
    },
    // get case details
    getCaseDetails(case_id) {
      // console.log(this.serviceList);

      caseAPI.getCaseDetails(case_id).then(
        response => {
          if (response.data.success === true) {
            this.base_url = response.data['file-path'];
            this.caseDetails = response.data.data;
            // console.log(this.caseDetails);
            this.caseInformation = {
              id: response.data.data.id,
              case_id: response.data.data.case_id,
              case_type: response.data.data.case_type,
              case_type_id: response.data.data.case_type_id,
              patient_name: response.data.data.patient_name,
              patient_age: response.data.data.patient_age,
              patient_address: response.data.data.patient_address,
              status: response.data.data.status,
              case_progress_status: response.data.data.case_progress_status,
              created_by: response.data.data.created_by,
              userAccessRole: response.data.data.userAccessRole,
            };
            this.uploadedCaseFiles = response.data.data.caseFileList;
            this.dentistInfo = {
              creator_name: response.data.data.creator_name,
              created_by: response.data.data.created_by,
              imageFolderPath: response.data.data.imageFolderPath,
              profile_pic: response.data.data.profile_image,
            };

            this.serviceList = response.data.data.serviceList.map(service => {
              return {
                service: service.service,
                caseMember: service.caseMember.map(e => {
                  return {
                    id: e.id,
                    user_id: e.user_id,
                    amount: e.amount,
                    service_status: e.service_status,
                    recCancelBtn:
                      e.request_user_id === this.getUserId &&
                      e.service_status === 1
                        ? true
                        : false,
                    senCancelBtn:
                      e.user_id === this.getUserId && e.service_status !== 3
                        ? true
                        : false,
                    created_at: moment(e.created_at).format('DD/MM/YYYY'),
                    // created_att: moment(e.created_at).format(
                    //   'DD/MM/YYYY HH:mm:ss',
                    // ),
                    current: moment().format('DD/MM/YYYY'),

                    status: e.status,
                    profile_name: e.profile_name,
                    profile_image: e.profile_image,
                    request_user_id: e.request_user_id,
                    isOption: false,
                  };
                }),
                caseMemberRequest: service.caseMemberRequest,
                caseMemberRecommendRequest: service.caseMemberRecommendRequest,
                isOption: false,
              };
            });

            this.serviceList.forEach(service => {
              if (
                service.caseMemberRequest.length === 0 &&
                service.caseMemberRecommendRequest.length === 0
              ) {
                service.isMember = 1;
              } else {
                service.isMember = 0;
              }
              if (service.caseMemberRequest.length > 0) {
                service.isMember = 0;
              } else if (service.caseMemberRecommendRequest.length > 0) {
                service.isMember = 0;
              } else {
                service.isMember = 1;
              }
            });
          } else {
            this.$router.push('/cases/all');
            createToast(response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
        err => {
          if (err.response.data.success === false) {
            this.$router.push('/cases/all');
            createToast(err.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
      );
    },
    // show error
    showError() {
      createToast('Please add your Payment Information', {
        type: 'danger',
        position: 'top-right',
        showIcon: true,
        timeout: 2000,
      });
      this.$router.push('/payments');
    },
    // get suggestions
    getCaseSuggestions(serviceID, serviceName, caseID) {
      this.selectedSuggestion = serviceID;
      this.selectedSuggestionName = serviceName;
      // bind data
      let data = {
        case_id: caseID,
        service_id: serviceID,
      };
      // get suggestions list for add member
      if (data) {
        caseAPI.getSuggestions(data).then(response => {
          if (response.data?.data) {
            this.suggestions = response.data.data;
            this.serviceMember.options = response.data.data.map(e => {
              return {
                name: e.userProfileInfo.name
                  ? e.userProfileInfo.name
                  : e.userProfileInfo.first_name +
                    ' ' +
                    e.userProfileInfo.last_name,
                userImage: e.userProfileInfo.profile_image,
                userImagePath: e.userProfileInfo.profileImageFolderPath,
                userId: e.user_id,
                service_price: e.service_price,
              };
            });
            console.log(this.serviceMember.options);
            this.getCaseDetails(this.case_id);
          }
        });
      }
    },

    // radio button change
    paymentTypeChange(e) {
      this.paymentType = e.target.value;
    },

    // get confirmation for service add
    serviceAddConfirmation(userID, servicePrice) {
      this.user_id_to_add = Number(userID);
      this.user_price = Number(servicePrice);
      this.toggleShowSendRequest();
    },
    // toggle show send request
    toggleShowSendRequest() {
      this.showSendRequest
        ? (this.showSendRequest = false)
        : (this.showSendRequest = true);
    },
    // add service action
    addServiceAction() {
      this.toggleShowSendRequest();

      // bind data
      let data = {
        service_id: this.selectedSuggestion,
        case_id: this.case_id,
        user_id: this.user_id_to_add,
        payment_type: 1,
      };
      if (data) {
        caseAPI.addCaseMember(data).then(
          response => {
            if (response.data.success) {
              this.getCaseDetails(this.case_id);
              createToast(response.data.message, {
                type: 'success',
                position: 'top-right',
                showIcon: true,
              });
            } else {
              createToast(response.data.message, {
                type: 'danger',
                position: 'top-right',
                showIcon: true,
              });
            }
          },
          error => {
            if (error.response.data.success === false) {
              createToast(error.response.data.message, {
                type: 'danger',
                position: 'top-right',
                showIcon: true,
              });
            }
          },
        );
      }
    },

    isActive(menuItem) {
      return this.activeItem === menuItem;
    },

    setActive(menuItem) {
      this.activeItem = menuItem;
    },

    onOptionAction(id, serviceName, reqID) {
      // Show/Hide option tab
      this.isCancelClicked = id;

      // request option
      this.serviceList.map(service =>
        service.caseMemberRequest.map(request => {
          if (request.id === id) {
            service.isOption = !service.isOption;
          } else {
            service.isOption = false;
          }
        }),
      );

      // recommend option
      this.serviceList.map(service =>
        service.caseMemberRecommendRequest.map(request => {
          if (request.id === id) {
            service.isOption = !service.isOption;
          } else {
            service.isOption = false;
          }
        }),
      );

      this.serviceName = serviceName;
      this.reqID = reqID;
      // console.log(this.reqID);
    },
    onMemberOptionAction(id, serviceName) {
      console.log(id, serviceName);
      // Show/Hide option tab
      // this.isCancelClicked = id;
      // this.reqID = id;
      this.selectedMemberID = id;
      // request option
      this.serviceList.map(service =>
        service.caseMember.map(request => {
          if (request.id === id) {
            request.isOption = !request.isOption;
          } else {
            request.isOption = false;
          }
        }),
      );

      this.serviceName = serviceName;
    },
    onCancelAction() {
      // cancel action
      requestsAPI.dentistCancelSentRequest(this.reqID).then(
        response => {
          if (response.data.success) {
            this.getCaseDetails(this.case_id);
            createToast(response.data.message, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
            });
          } else {
            createToast(response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
      );
    },
    onCancelMemberAction() {
      // console.log(this.selectedMemberID);
      caseAPI.cancelService(this.selectedMemberID).then(
        response => {
          if (response.data.success === true) {
            this.getCaseDetails(this.case_id);
            createToast(response.data.message, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
              timeout: 2000,
            });
          } else {
            createToast(response.data.message, {
              type: 'danger',
              position: 'top-right',
              timeout: 2000,
              showIcon: true,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              position: 'top-right',
              timeout: 2000,
              showIcon: true,
            });
          }
        },
      );
    },
    replaceByDefaultProImage(e) {
      e.target.src = proImg;
    },
    onCancelRecommendation() {
      // CANCEL RECOMMENDATION
      requestsAPI.cancelSentRecommendRequest(this.reqID).then(
        response => {
          if (response.data.success) {
            this.getCaseDetails(this.case_id);
            createToast(response.data.message, {
              type: 'success',
              position: 'top-right',
              showIcon: true,
            });
          } else {
            createToast(response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
      );
    },
    caseShow() {
      this.caseSidebar = !this.caseSidebar;
    },
  },
};
</script>

<style scoped>
@import url('./case.css');

#ext .nav.nav-tabs .nav-item .nav-link.active:after {
  height: 3px;
  box-shadow: none !important;
}
#ext .nav.nav-tabs .nav-item .nav-link {
  padding: 15px 30px;
}
#ext ul.nav.nav-tabs {
  margin: 0 20px 5px;
}
span.paid {
  color: rgb(53, 146, 53);
  font-weight: bold;
  font-size: 16px;
}
.squareDiv .name a.link,
.squareDiv .name a {
  color: #123c3d;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: capitalize;
}
.squareDiv {
  display: flex;
  align-items: center;
}
.squareDiv .pic {
  width: 45px;
  height: 45px;
  border: 10px;
  border-radius: 15%;
}
/* .squareDiv .name {
  color: #000000;
  font-weight: bold;
  font-size: 0.7rem;
  height: 100%;
  justify-content: center;
  width: 100%;
  margin: auto 15px;
  word-break: break-all;
} */
.squareDiv .link.name {
  color: #123c3d;
  font-weight: 600;
  font-size: 13px;
  height: 100%;
  justify-content: center;
  width: 100%;
  margin: auto 15px;
  word-break: break-all;
}
.filterContainer .memberGroup span {
  font-size: 0.7rem;
}
.caseMemberTxt {
  margin-bottom: 3rem !important;
  font-size: 1.5rem !important;
}
/* .squareDiv .pic {
  min-width: 59px !important;
} */
.actionBtn .confirmPayIcon {
  width: 20px;
}
.tab-content {
  /* margin-top: -25px; */
  padding: 10px 0;
  background-color: #fff;
  border: 1px solid #e3e3e3;
}
.settingsIcon {
  padding: 15px 18px;
}
.serviceStatus {
  font-weight: 600;
}
.pageHeader {
  margin-top: 8px;
}
html body .content .content-wrapper {
  padding: calc(2.2rem - 1.6rem) 2.2rem 0;
}

/* button */
</style>
