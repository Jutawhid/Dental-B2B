<template>
  <div class="col-12">
    <div class="card">
      <div class="row card-body">
        <div class="col-12">
          <div class="row">
            <div class="col-lg-6">
              <h4 class="font-weight-bolder">Basic Information</h4>
              <div class="row ml-0">
                <div class="col-12 left-border">
                  <div class="tab-info-group">
                    <div class="label">Name</div>
                    <div class="detail text-capitalize">
                      {{ userData.first_name + ' ' + userData.last_name }}
                    </div>
                  </div>
                  <!-- <div class="tab-info-group">
                    <div class="label">User name</div>
                    <div class="detail">{{ userData.user_name }}</div>
                  </div> -->
                  <div class="tab-info-group">
                    <div class="label">Email</div>
                    <div class="detail">{{ userData.email }}</div>
                  </div>

                  <div class="tab-info-group">
                    <div class="label">Phone</div>
                    <div class="detail">{{ userData.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="row ml-0 mt-1">
                <div class="col-12 left-border">
                  <div class="tab-info-group">
                    <div class="label">Fax</div>
                    <div class="detail">{{ userData.fax }}</div>
                  </div>
                  <div class="tab-info-group">
                    <div class="label">Address</div>
                    <div class="detail">{{ userData.address }}</div>
                  </div>
                  <div class="tab-info-group">
                    <div class="label">State, City, Zip Code</div>
                    <div class="detail">
                      {{
                        userData.state_name
                          ? userData.state_name
                          : 'No State available'
                      }}
                      {{ userData.city_name ? ', ' + userData.city_name : '' }}
                      {{ userData.zip_code ? ', ' + userData.zip_code : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
export default {
  name: 'viewInformation',
  mounted() {
    if (this.user_details) {
      this.userData = this.user_details;
    }
  },
  data() {
    return {
      userData: {},
      // userData: {},
      isEditProfile: false,
    };
  },
  methods: {
    EditAction() {
      this.isEditProfile = true;
    },
  },
  props: ['user_details'],
};
</script>

<style type="text/css" scoped></style>
