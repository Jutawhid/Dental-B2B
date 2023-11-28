<template>
  <!-- Alert/MODAL confirmation for Delete -->
  <div
    class="modal fade"
    :class="isWithdrawMoney ? 'show' : ''"
    :style="{
      visibility: isWithdrawMoney ? 'visible' : '',
      display: isWithdrawMoney ? 'block' : '',
      background: isWithdrawMoney ? 'rgba(0,0,0,0.5)' : '',
      zIndex: isWithdrawMoney ? '2000' : '',
    }"
    id="addMoney"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="col-12 text-center">
          <span class="headerTxt">Add Money To Wallet</span>
          <i
            class="fa fa-times"
            data-bs-dismiss="modal"
            @click="closeModal"
          ></i>
        </div>

        <hr />
        <div class="modal-body">
          <!-- Information Start -->
          <Form @submit="onSubmit" id="saveForm2">
            <!-- Amount -->
            <p>Amount</p>
            <div class="d-flex flex-wrap justify-content-center">
              <input
                class="form-control"
                type="number"
                placeholder="Enter Card Number"
                v-model="card.amount"
                @blur="validate('amount')"
                @keypress="validate('amount')"
              />
            </div>
            <p class="form-input-hint" v-if="!!errors.amount">
              {{ errors.amount }}
            </p>
            <!-- Source -->
            <p class="mt-1 mb-0">Source</p>
            <!-- <i class="feather icon-check"></i> -->

            <div class="d-flex flex-wrap justify-content-center" id="cardShow">
              <div class="plans m-1" v-for="item in 1" :key="item">
                <label class="plan complete-plan" for="complete">
                  <input
                    type="radio"
                    value="2"
                    v-model="paymentType"
                    @change="paymentTypeChange"
                    readonly
                  />
                  <div class="plan-content">
                    <img loading="lazy" src="./wallet.svg" alt="icon" />
                    <div class="plan-details">
                      <span>Stripe Account</span>
                    </div>
                  </div></label
                >
              </div>
            </div>
            <p class="form-input-hint" v-if="!!errors.card_id">
              {{ errors.card_id }}
            </p>
            <!-- Add Money -->
          </Form>
          <div class="d-flex justify-content-center">
            <button class="addMoney" form="saveForm2">Add Money</button>
          </div>
          <!-- Information End -->
        </div>
      </div>
    </div>
  </div>
  <!-- Alert END -->
</template>

<script>
import { Form } from 'vee-validate';
import { object, string } from 'yup';
import paymentAPI from '../../../../../services/payment.API';
import { createToast } from 'mosha-vue-toastify';
import profileService from '../../../../../services/profile.service';

export default {
  components: {
    Form,
  },
  data() {
    const schema = object().shape({
      amount: string().required('Please enter amount'),
    });

    return {
      schema,
      card: {
        amount: '',
      },
      errors: {
        amount: '',
      },
      paymentType: '2',
      balance: 0,
      isWithdrawMoney: false,
      cards: [],
      role: '',
    };
  },
  methods: {
    // toggle modal
    toggleModal() {
      this.isWithdrawMoney
        ? (this.isWithdrawMoney = false)
        : (this.isWithdrawMoney = true);
    },
    // close Modal
    closeModal() {
      this.isWithdrawMoney = false;
      this.clearForm();
    },
    // form submit
    onSubmit() {
      if (this.card.amount === '') {
        this.errors.amount = 'Please enter amount';
      }
      // if matches all terms -> submit form
      if (this.card.amount) {
        let userData = {
          // card_id: this.card.card_id,
          amount: this.card.amount,
        };
        // console.log(userData);
        // add money to card
        paymentAPI.addStripeMoneyToWallet(userData).then(
          response => {
            if (response.data.success === true) {
              createToast(response.data.message, {
                type: 'success',
                showIcon: true,
                position: 'top-right',
                timeout: 2000,
              });
              // add card balance
              this.getWalletInfo();

              // close modal
              this.closeModal();
            } else {
              createToast(response.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
                timeout: 2000,
              });
            }
          },
          err => {
            createToast(err.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              timeout: 2000,
            });
          },
        );
      }
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
    // clear state
    clearForm() {
      this.card = { amount: '' };
    },

    // wallet info
    getWalletInfo() {
      paymentAPI.getWalletInfo().then(response => {
        if (response?.data?.data?.balance) {
          this.balance = response.data.data.balance;
        }
      });
    },
  },
  mounted() {
    // role
    profileService.getUser().then(response => {
      this.role = response.role.role_id;
    });
    // get wallet info
    this.getWalletInfo();
  },
};
</script>

<style scoped>
#cardShow i.fa {
  font-size: 25px;
  margin-bottom: 5px;
}
#addMoney .modal-content {
  background: #fff;
  border: 1px solid #fff;
  box-shadow: 0px 20px 30px #00000066;
  border-radius: 20px;
  padding: 20px 0;
}
#addMoney .headerTxt {
  color: #000000;
  font-weight: 600;
  font-size: 16px;
}
#addMoney .modal-body p {
  color: #123c3d;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}
#addMoney input {
  width: 190px;
}
#addMoney .addMoney {
  background: #ffd700;
  border: 1px solid #ffd700;
  border-radius: 10px;
  color: black;
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  margin-top: 10px;
  min-width: 190px;
}
#addMoney .closeBtn {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 15px;
}
#addMoney .selectedCard {
  background: #e5e5e5;
  border: 3px solid #1492e6;
  border-radius: 10px;
  color: #123c3d;
  font-size: 12px;
  font-weight: 600;
  padding: 20px 0;
  min-width: 190px;
}
#addMoney label {
  width: 100%;
  margin-top: 10px;
  font-weight: 600;
  font-size: 12px;
  color: #123c3d;
}
.justify-right {
  justify-content: right !important;
  display: flex !important;
}
#addMoney i.feather.icon-check {
  background: #1492e6;
  border-radius: 50%;
  padding: 3px 4px;
  font-size: 8px;
  color: white;
  margin-top: -15px;
  height: 15px;
  width: 15px;
  margin-right: 5px;
}
#addMoney p.form-input-hint {
  background: transparent;
  border: none;
  font-size: 12px;
  margin: 0px 5px 10px;
  color: red;
  font-weight: 400;
}
#cardShow .plan-content {
  border: 4px solid #1492e6;
  background: #eaf1fe;
  padding: 17px 20px;
  min-width: 185px;
}
#cardShow .plans {
  background-color: transparent;
}
#cardShow input[type='radio'] {
  height: 0;
}
#addMoney i.fa.fa-times {
  position: absolute;
  right: 20px;
  font-size: 15px;
  cursor: pointer;
}
</style>
