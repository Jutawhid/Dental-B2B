<template>
  <div>
    <!-- Start -->
    <p class="alert alert-info" v-if="userData.service?.length == 0">
      No Service Available
    </p>
    <div
      :key="service.id"
      v-for="service in userData.service"
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
            <p class="card-text my-2" v-show="!service.edit">
              {{ service.description }}
            </p>

            <span class="btn btn-with-price">
              {{ 'US $ ' + service.price }}
            </span>
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
      userData: {},
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
    if (this.user_details) {
      this.userData = this.user_details;
    }
  },
  props: ['user_details'],
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
  color: #123c3d !important;
  font-weight: 800;
  cursor: auto;
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
