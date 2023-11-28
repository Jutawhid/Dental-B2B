<template>
  <div class="card p-0 p-lg-2">
    <div class="card-body">
      <div class="row">
        <!-- <p
          class="alert alert-info col-12"
          v-if="accountStatus === 'inprogress'"
        >
          <i class="fa fa-info-circle"></i>
          {{ message }}
        </p> -->
        <!-- Easifi wallet START -->
        <AddMoneyToWallet />
        <!-- Easifi wallet END -->

        <!-- Add New Card Start-->
        <AddCard v-if="isAddingCard" />
        <!-- Add New Card End -->
        <div class="offset-4 col-lg-4 d-flex flex-column">
          <button
            v-if="showItem && !isAddingCard && role !== 4"
            @click="loginStripeAction"
            class="btn btn-dark mb-1 text-white w-auto"
          >
            <i class="fa fa-key mr-1"></i>Login to Stripe
          </button>
          <button
            v-if="showItem && !isAddingCard && role !== 4"
            @click="addStripeAmount"
            class="btn btn-primary w-auto"
          >
            <i class="fa fa-plus mr-1"></i>Add Amount to Stripe
          </button>
          <p
            class="small alart mt-2 w-100"
            align="right"
            v-if="showItem && !isAddingCard && role !== 4"
          >
            This button is available only for Testing Mode. When we will go live
            , it will be removed. By Clicking this button , $450 will be added
            in your stripe account and then you can Add Money in EASIFI
            Platform.
          </p>
        </div>
      </div>
      <!-- Modal Start-->

      <!-- Withdraw Money -->
      <WithdrawMoney />
      <!-- Withdraw Money -->

      <!-- Alert/MODAL confirmation for Delete -->
      <div
        class="modal fade"
        :class="isEditCard ? 'show' : ''"
        :style="{
          visibility: isEditCard ? 'visible' : '',
          display: isEditCard ? 'block' : '',
          background: isEditCard ? 'rgba(0,0,0,0.5)' : '',
          zIndex: isEditCard ? '2000' : '',
        }"
        id="editCard"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="col-12 pt-2">
              <div class="d-flex mb-3">
                <!-- Header Label -->
                <div class="flex-grow-1">
                  <h5 class="cardTitle">
                    <i class="fa fa-credit-card"></i>
                    <span class="leftPadding font-weight-bold"
                      >Card Information</span
                    >
                  </h5>
                </div>
                <!-- Header Label -->

                <div class="flex-grow-0 text-right" id="cardInfo">
                  <button class="saveBtn" form="editForm">
                    <i class="feather icon-save"></i> Save
                  </button>
                  <button
                    type="button"
                    class="closeBtn"
                    @click="toggleEditCard()"
                  >
                    <i class="feather icon-x"></i>
                  </button>
                </div>
                <!-- Dropdown options -->
              </div>
            </div>
            <div class="modal-body">
              <!-- Information Start -->
              <Form @submit="onEditAction" id="editForm">
                <div class="d-flex" id="cardForm">
                  <div class="d-flex flex-column flex-grow-1 mr-1">
                    <div class="form-group">
                      <label> Card Number </label>
                      <input
                        class="form-control cardNum"
                        type="number"
                        placeholder="Enter Card Number"
                        v-model="card.card_number"
                        @blur="validate('card_number')"
                        @keypress="validate('card_number')"
                      />
                      <p class="form-input-hint" v-if="!!errors.card_number">
                        {{ errors.card_number }}
                      </p>
                    </div>
                    <div class="form-group">
                      <label> Card Holder </label>
                      <input
                        type="text"
                        class="form-control cardNum"
                        placeholder="Enter Card Holder Name"
                        v-model="card.card_holder"
                        @blur="validate('card_holder')"
                        @keypress="validate('card_holder')"
                      />
                      <p class="form-input-hint" v-if="!!errors.card_holder">
                        {{ errors.card_holder }}
                      </p>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <div class="form-group">
                      <label> CVV No</label>
                      <input
                        type="number"
                        class="form-control"
                        placeholder="Enter CVV"
                        v-model="card.cvv"
                        @blur="validate('cvv')"
                        @keypress="validate('cvv')"
                      />
                      <p class="form-input-hint" v-if="!!errors.cvv">
                        {{ errors.cvv }}
                      </p>
                    </div>
                    <div class="form-group">
                      <label> Exp. Date </label>

                      <Datepicker
                        v-model="card.exp_date"
                        monthPicker
                        inputClassName="exp_padding"
                        @cleared="clearDate()"
                        @blur="validate('exp_date')"
                        @selected="validate('exp_date')"
                      />
                      <p class="form-input-hint mt-1" v-if="!!errors.exp_date">
                        {{ errors.exp_date }}
                      </p>
                    </div>
                  </div>
                </div>
              </Form>
              <!-- Information End -->
            </div>
          </div>
        </div>
      </div>
      <!-- Alert END -->
    </div>
  </div>
</template>

<script>
import { Form } from 'vee-validate';
import { object, string } from 'yup';
import AddCard from './addCard.vue';
import AddMoneyToWallet from './addMoney.vue';
import WithdrawMoney from './withdraw.vue';
import paymentAPI from '../../../../../services/payment.API';
import { createToast } from 'mosha-vue-toastify';
import { ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import profileService from '../../../../../services/profile.service';

export default {
  name: 'addPayment',
  components: {
    Form,
    Datepicker,
    AddCard,
    AddMoneyToWallet,
    WithdrawMoney,
  },
  data() {
    const schema = object().shape({
      card_number: string().required('Card Number is required'),
      card_holder: string().required('Card Holder is required'),
      cvv: string().required('CVV is required'),
      exp_date: object().required('Expiry Date is required').nullable(),
    });
    return {
      showItem: false,
      role: '',
      errorMsg: '',
      accountStatus: '',
      schema,
      card: {
        id: '',
        card_number: '',
        card_holder: '',
        cvv: '',
        exp_date: '',
      },
      errors: {
        card_number: '',
        card_holder: '',
        cvv: '',
        exp_date: '',
      },
      cards: [],
      isAddingCard: false,
      isEditCard: false,
      loading: false,
      cardEditDetails: {},
      message: false,

      // form
    };
  },
  methods: {
    // auto amount add to stripe
    addStripeAmount() {
      paymentAPI.addAmountToStripe().then(
        res => {
          if (res.data.success === true) {
            createToast(res.data.message, {
              type: 'success',
              showIcon: true,
              timeout: 2000,
            });
            this.card = {
              id: '',
              card_number: '',
              card_holder: '',
              cvv: '',
              exp_date: '',
            };
            this.errors = {
              card_number: '',
              card_holder: '',
              cvv: '',
              exp_date: '',
            };
          }
        },
        err => {
          if (err.response.data.success === false) {
            createToast(err.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          }
        },
      );
    },
    // login to Stripe
    loginStripeAction() {
      paymentAPI.getStripeUrl().then(
        res => {
          if (res?.data?.data?.url) {
            window.location.href = res.data.data.url;
          } else {
            createToast(res.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          }
        },
        err => {
          if (err.response.data.success === false) {
            createToast(err.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
              duration: 2000,
            });
          }
        },
      );
    },
    // get edit card
    editCard(card) {
      this.isEditCard = true;
      this.cardEditDetails = card;
      this.card = {
        id: card.id,
        card_number: card.card_number,
        card_holder: card.card_holder,
        cvv: card.cvv_no,
      };
      let expMonth = card.expired_date.toString().substr(0, 2) * 1 - 1;
      let expYear = '20' + card.expired_date.toString().substr(-2);
      // console.log(expDate);
      this.card.exp_date = ref({
        month: expMonth, //new Date().getMonth(),
        year: expYear, //new Date().getFullYear(),
      });
    },

    // toggle edit card
    toggleEditCard() {
      this.isEditCard = !this.isEditCard;
      this.cardEditDetails = {};
      this.card = {
        id: '',
        card_number: '',
        card_holder: '',
        cvv: '',
        exp_date: '',
      };
      this.errors = {
        card_number: '',
        card_holder: '',
        cvv: '',
        exp_date: '',
      };
    },

    // clear date
    clearDate() {
      this.card.exp_date = '';
    },

    // validation
    validate(field) {
      this.schema
        .validateAt(field, this.card)
        .then(() => {
          this.errors[field] = '';
        })
        .catch(err => {
          this.errors[field] = err.message;
        });
    },

    // check card
    checkAccountStatus() {
      paymentAPI.getAccountStatus().then(
        response => {
          console.log(response);
          if (response.data.status === 200 && response.data.success === true) {
            this.accountStatus = response.data.account_status;
            this.isAddingCard = response.data.willShowPlusButton;
            this.showItem = true;
            this.message = response.data.message;
            // console.log(this.isAddingCard);
            // console.log(this.message);
          }
        },
        err => {
          if (err.response.data.success === false) {
            this.accountStatus = err.response.data.account_status;
            this.isAddingCard = err.response.data.willShowPlusButton;
            this.message = err.response.data.message;
            createToast(err.response.data.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
      );
    },
  },
  mounted() {
    // check account status
    paymentAPI.getAccountStatus().then(
      response => {
        console.log(response);
        if (response.data.status === 200 && response.data.success === true) {
          this.accountStatus = response.data.account_status;
          this.isAddingCard = response.data.willShowPlusButton;
          this.showItem = true;
          this.message = response.data.message;
          // console.log(this.isAddingCard);
          // console.log(this.message);
        }
      },
      err => {
        if (err.response.data.success === false) {
          this.accountStatus = err.response.data.account_status;
          this.isAddingCard = err.response.data.willShowPlusButton;
          this.message = err.response.data.message;
          createToast(err.response.data.message, {
            type: 'danger',
            position: 'top-right',
            showIcon: true,
          });
        }
      },
    );
    if (this.accountStatus === 'inprogress') {
      setTimeout(() => {
        this.checkAccountStatus();
      }, 3000);
    }

    // role
    profileService.getUser().then(
      res => {
        if (res.data.success === true) {
          this.role = res.role.role_id;
        }
      },
      err => {
        if (err.response.data.success === false) {
          console.log(err.response.data.message);
        }
      },
    );
  },
};
</script>

<style scoped>
@import url('./paymentInfo.css');
p.small.alart {
  text-align: right;
  color: rgb(0, 63, 172);
  word-break: break-word;
}
</style>
