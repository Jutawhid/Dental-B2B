<template>
  <div>
    <p class="alert alert-info" v-if="serviceDetails?.length == 0">
      No Service Available
    </p>
    <!-- Start -->
    <div
      :key="service.id"
      v-for="service in serviceDetails"
      class="services-wrapper"
    >
      <h5 class="font-weight-bolder" style="opacity: 0.5"></h5>
      <div class="card mt-3 my-1">
        <div class="card-content">
          <div class="card-body py-0 px-2">
            <div class="d-flex service-card-title">
              <h2 class="font-weight-bolder">
                {{ service.name }}
              </h2>
            </div>
            <p class="card-text my-2">
              {{ service.description }}
            </p>
            <span href="#" class="btn btn-with-price">{{
              '$ ' + service.price
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!---End -->
  </div>
</template>

<script type="javascript">
export default {
  name: 'servicesDetals',
  async created() {},
  data() {
    return {
      services: [
        {
          name: 'Treatment Planning Software',
          detail:
            'Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod tempor\n' +
            'incididunt ut labore et dolore magna aliqua. Ut enim\n' +
            'ad minim veniam. Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod tempor\n' +
            'incididunt ut labore et dolore magna aliqua. Ut enim\n' +
            'ad minim veniam. Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod',
          price: 'US $ 500',
          edit: false,
        },
        {
          name: 'Aligner Fabrication\n',
          detail:
            'Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod tempor\n' +
            'incididunt ut labore et dolore magna aliqua. Ut enim\n' +
            'ad minim veniam. Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod tempor\n' +
            'incididunt ut labore et dolore magna aliqua. Ut enim\n' +
            'ad minim veniam. Lorem ipsum dolor sit amet,\n' +
            'consectetur adipiscing elit, sed do eiusmod',
          price: 'US $ 1500',
          edit: false,
        },
      ],
    };
  },
  computed: {
    services2: function () {
      var _services = [];
      for (var i = 0, services; (services = this.services[i]); i++) {
        services.edit = false;
        _services.push(services);
      }
      return _services;
    },
  },
  methods: {
    editServices: function (services) {
      this._originalServices = Object.assign({}, services);
      services.edit = true;
    },

    cancelServices: function (services) {
      Object.assign(services, this._originalServices);
      services.edit = false;
    },

    saveServices: function (services) {
      // Object.assign(services, this._originalServices);
      services.edit = false;
    },
  },
  mounted() {
    console.log(this.serviceDetails);
  },
  props: ['serviceDetails'],
};
</script>

<style type="text/css" scoped>
.services-wrapper {
}
.services-wrapper .name {
  font-size: 1.74rem;
  font-weight: bolder;
  opacity: 0.7;
  width: 70%;
  margin: 0px 30px 30px 0px;
}
.services-wrapper .detail {
  min-height: 150px;
  margin-bottom: 30px;
  font-size: 16px;
  color: #123c3d;
  font-weight: 400;
}
.services-wrapper .price {
  width: 20%;
  background: #e5eaea;
  font-size: 20px;
  color: #123c3d;
  font-weight: 600;
  opacity: 0.7;
}
.btn-cancel {
  margin: 0 10px 30px !important;
  padding: 10px 20px;
}
.btn-edit {
  background: #ffd700;
  color: #000000;
  font-weight: 600;
  font-family: 'Poppins';
  box-shadow: 0px 3px 6px #00000029;
  float: right;
}
.btn-with-price {
  background-color: #f2f2f2;
  color: #123c3d;
  font-weight: 800;
}
.add-new {
  background-color: #00e2f2;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 800;
  margin-top: 15px;
}
</style>
