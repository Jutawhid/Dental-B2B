<template>
  <div>
    <table id="techDatatable">
      <thead>
        <tr>
          <th class="id">Image</th>
          <th class="name">Name</th>
          <th class="name">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="TR d-flex flex-wrap"
          v-for="tech in techs.data"
          :key="tech.id"
        >
          <td class="img">
            <img
              v-if="!tech.profile_image"
              class="imgAvatar"
              src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
              alt="img"
            />
            <img
              v-if="tech.profile_image"
              class="imgAvatar"
              :src="baseImg + '/' + tech.profile_image"
              alt="img"
            />
          </td>
          <td class="name mt-lg-1">
            <div class="d-flex col-sm-12">
              <router-link :to="'/cpanel/user/' + tech.user_id">
                <span
                  ><b>{{ tech.name }}</b>
                </span>
              </router-link>
              <star-ratings
                starSize="25"
                :id="'L' + tech.id"
                :showControl="false"
                v-model="rating"
                :numberOfStars="5"
                controlSize="0"
                :step="0.5"
                disableClick="true"
              />
              <!-- </div> -->
            </div>
            <div class="d-flex flex-wrap col-12">
              <span class="serviceDiv">Aligner Fabrication</span>
              <span class="serviceDiv">Case Monitoring</span>
              <span class="serviceDiv">Case Advisor / Concierge</span>
            </div>
          </td>
          <td class="col-lg-5 d-flex justify_end">
            <router-link :to="'/messages/' + tech.user_id" tag="button">
              <div class="chatIcon">
                <i class="feather icon-message-circle"></i>
              </div>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
 
<script>
import $ from 'jquery';
import Vue3StarRatings from 'vue3-star-ratings';
import userAPI from '../../../../services/user.API';

export default {
  name: 'TechCompanies',
  components: {
    'star-ratings': Vue3StarRatings,
  },
  mounted() {
    userAPI.getAllUserAccessList().then(res => {
      if (res.data.data.map(e => e.role_id === 6)) {
        this.techs = res.data.data.filter(e => e.role_id === 6)[0];
        this.baseImg = this.techs && this.techs.imageFolderPath;
      }
      setTimeout(() => {
        $('#techDatatable').DataTable({
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
          ],
          pageLength: 5,
          info: false,
          language: {
            paginate: {
              next: '<i class="fa fa-angle-right  btn-primary btn-sm"></i>',
              previous:
                '<i class="fa fa-angle-left btn btn-primary btn-sm"></i>',
              last: '<i class="fa fa-angle-double-right  btn-primary btn-sm"></i>',
              first:
                '<i class="fa fa-angle-double-left  btn-primary btn-sm"></i>',
            },
          },
          targets: 'no-sort',
          bSort: false,
          order: [],
          bFilter: false,
          bInfo: false,
          bLengthChange: false,
        });
      });
    });
  },

  data: function () {
    return {
      techs: [],
      rating: 2.5,
      baseImg: '',
    };
  },
};
</script>

<style scoped>
tr.TR.odd,
tr.TR.even {
  background: #ffffff;
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 9px;
  margin: 15px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
}
@media screen and (min-width: 1200px) {
  tr.TR.odd,
  tr.TR.even {
    max-height: 130px;
  }
}

td {
  justify-content: center;
}
table#techDatatable {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 80px;
  height: 80px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
#techDatatable thead {
  display: none;
}
#techDatatable td {
  align-items: center;
  /* display: flex; */
  /* width: 30%; */
}
#techDatatable span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  /* margin-left: 20px; */
}
.chatIcon {
  background: #123c3d;
  border-radius: 50%;
  color: white;
  height: 35px;
  width: 35px;
  cursor: pointer;
}
td.justify_end {
  justify-content: end;
}
td.center {
  justify-content: center;
}
#techDatatable .icon-message-circle {
  content: '\e890';
  font-size: 20px;
  margin-top: 6px;
  position: absolute;
  margin-left: 8px;
}
.chatIcon:hover {
  background: #ffd700;
  color: #123c3d;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #ffd700;
  border-color: #184b4c;
  background-color: #bebebe;
}
.custom-switch .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #123c3d;
}
.dataTables_wrapper .dataTables_filter input:focus-visible {
  outline: none;
}

.dataTables_wrapper .dataTables_paginate .paginate_button.current,
.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover {
  color: #333 !important;
  border: 1px solid #979797;
  background-color: white;
  background: linear-gradient(to bottom, #e11313 0%, #901c1c 100%);
}
tr.img {
  width: 10% !important;
}
/* td.name{
	text-align: left !important; 
	 width: 77%; 
	 margin-top: -25px; 
} */
td.action {
  float: right;
  width: auto;
}
.vue3-star-ratings__wrapper {
  display: block;
  margin: 0;
  text-align: center;
  /* margin-top: -25px; */
  margin-left: 15px !important;
  padding: 0 !important;
  /* position: absolute; */
  /* left: 130px; */
}
#techDatatable span {
  color: #131313;
  font-size: 20px;
  /* margin-left: 20px; */
}

.stars .stars-outer .stars svg {
  display: flex;
  height: 10px !important;
}
.stars-inner svg {
  height: 10px !important;
}

#techDatatable .name .serviceDiv {
  color: #000000;
  text-transform: capitalize;
  background: #e2e2e2;
  border-radius: 10px;
  padding: 10px 20px;
  margin: 25px 10px 15px 0;
  font-size: 12px;
  font-weight: bold;
}
.img.sorting_1 {
  align-items: center;
  display: flex;
}
.TR.d-flex.flex-wrap {
  align-items: center;
}
.d-flex.flex-wrap.col-12 {
  margin-top: -15px;
}
svg {
  height: 12px !important;
}
</style>