<template>
  <div>
    <!-- Start -->
    <div class="about-tab">
      <div class="row">
        <div class="col-lg-12" v-if="isEditProfile === true">
          <editLabProfile />
        </div>
        <div class="col-lg-12" v-if="isEditProfile === false">
          <viewInformation :user='user'/>
        </div>
        <!-- <div class="col-lg-3">
          <div class="row">
            <div class="col-12 text-right" v-if="isEditProfile === false">
              <a
                v-if="isEditProfile === false"
                class="
                  btn btn-edit
                  mr-0 mr-sm-1
                  mb-1 mb-sm-0
                  waves-effect waves-light
                "
                @click="EditActionTrue()"
              >
                <i class="feather icon-edit-1 mr-50"></i>Edit
              </a>
            </div>
            <div class="col-12 text-right" v-if="isEditProfile === true">
              <button
                type="submit"
                class="text-right btn btn-edit mb-2"
                form="saveUpdatedProfile"
              >
                <i class="fa fa-save"></i> Save
              </button>
              <button
                type="submit"
                class="text-right btn btn-dark mb-2"
                @click="EditActionFalse()"
              >
                <i class="fa fa-undo"></i> Cancel
              </button>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <!---End -->
  </div>
</template>

<script type="javascript">
import editLabProfile from "./editProfile.vue";
import viewInformation from "./viewInformation.vue";

export default {
  components: {
    editLabProfile,
    viewInformation,
  },
  data() {
    return {
      // user: {},
      isEditProfile: false,
    };
  },
  methods: {
    EditActionTrue() {
      this.isEditProfile = true;
    },
    EditActionFalse() {
      this.isEditProfile = false;
    },
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style type="text/css" scoped></style>
