<template>
  <div class="col-lg-4">
    <div class="addCard">
      <div class="maxHeight">
        <button
          class="btn btn-primary addCardBtn"
          @click.prevent="addCard"
          title="Add Stripe Account"
        >
          <i class="fa fa-plus" v-if="!loading"></i>
          <span class="loading" v-if="loading"></span> Add Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// import { Form } from 'vee-validate';
import { object, string } from 'yup';
import paymentAPI from '../../../../../services/payment.API';
import { createToast } from 'mosha-vue-toastify';
import { ref } from 'vue';
// import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
  components: {
    // Form,
    // Datepicker,
  },
  setup() {
    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    console.log(month);
    return {
      month,
    };
  },
  data() {
    const schema = object().shape({
      card_number: string().required('Card Number is required'),
      card_holder: string().required('Card Holder is required'),
      cvv: string().required('CVV is required'),
      exp_date: object().required('Expiry Date is required'),
    });
    // const month = ref({
    //   month: new Date().getMonth(),
    //   year: new Date().getFullYear(),
    // });
    return {
      schema,
      card: {
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
      isAddingCard: false,
      loading: false,
    };
  },
  methods: {
    // ADD CARD
    addCard() {
      this.loading = true;
      paymentAPI.addStripeAccount().then(
        res => {
          if (res.data.data.url) {
            let url = res?.data?.data?.url;
            if (url) {
              window.location.href = url;
            }
          }
          // createToast(res.data.message, {
          //   type: 'success',
          //   position: 'top-right',
          //   showIcon: true,
          //   duration: 2000,
          // });
          this.loading = false;
        },
        err => {
          if (err.response.data.success === false) {
            this.loading = false;
            createToast(err?.response?.data?.message, {
              type: 'danger',
              position: 'top-right',
              showIcon: true,
            });
          }
        },
      );
    },
    // adding card toggle
    toggleAddingCard() {
      this.isAddingCard
        ? (this.isAddingCard = false)
        : (this.isAddingCard = true);
    },
    // clear state
    clearState() {
      // toggle MODAL
      this.toggleAddingCard();

      // clear state
      this.card = {
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
    // clear state
    clearInputData() {
      // clear state
      this.card = {
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
    onSubmit() {
      console.log(this.card);

      if (this.card.card_number === '') {
        this.errors.card_number = 'Card Number is required';
      }
      if (this.card.card_holder === '') {
        this.errors.card_holder = 'Card Holder is required';
      }
      if (this.card.cvv === '') {
        this.errors.cvv = 'CVV is required';
      }
      if (this.card.exp_date === '') {
        this.errors.exp_date = 'Expired Date is required';
      }
      // if matches all terms -> submit form
      if (
        this.card.card_number &&
        this.card.card_holder &&
        this.card.cvv &&
        this.card.exp_date
      ) {
        let userData = {
          card_number: this.card.card_number,
          card_holder: this.card.card_holder,
          cvv_no: this.card.cvv,
          expired_date:
            this.card.exp_date.month < 10
              ? '0' +
                (this.card.exp_date.month + 1).toString() +
                this.card.exp_date.year.toString().substr(-2)
              : (this.card.exp_date.month + 1).toString() +
                this.card.exp_date.year.toString().substr(-2),
        };
        console.log(userData.expired_date);
        // add card info to database
        paymentAPI.addCard(userData).then(
          response => {
            if (response.data.success === true) {
              createToast(response.data.message, {
                type: 'success',
                showIcon: true,
                position: 'top-right',
              });
              // toggle modal
              this.toggleAddingCard();

              // clear input data
              this.clearInputData();

              // get card list
              this.getCards();
            } else {
              createToast(response.data.message, {
                type: 'danger',
                showIcon: true,
                position: 'top-right',
              });
            }
          },
          err => {
            createToast(err.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
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
  },
  // mounted() {
  //   console.log(this.getCards);
  // },
  props: {
    getCards: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
#addCard .modal-content {
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  box-shadow: 0px 20px 30px #00000066;
  border-radius: 20px;
  padding: 15px;
}
#addCard .saveBtn {
  background: #ffd700;
  border: 1px solid #ffd700;
  border-radius: 10px;
  color: black;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 15px;
  margin-right: 10px;
}
#addCard .closeBtn {
  background: #123c3d;
  border: 1px solid #123c3d;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 10px 15px;
}
#saveForm p.form-input-hint {
  background: transparent;
  border: none;
  font-size: 12px;
  margin: -20px 5px 10px;
  color: red;
  font-weight: 400;
}

.dp__input_icon_pad {
  height: 45px !important;
}
.dp__select {
  color: #0d191b !important;
}
#saveForm .form-control {
  height: 36px;
  margin-bottom: 20px;
}

.loading::after {
  top: 42%;
  left: 25%;
}
</style>
