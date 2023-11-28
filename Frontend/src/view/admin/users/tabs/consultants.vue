<template>
  <div>
    <table id="datatable4">
      <thead>
        <tr>
          <th class="pic">ID</th>
          <th class="case">Case</th>
          <th class="action">Username</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="TR d-flex justify-content-between"
          v-for="user in consultants.data"
          :key="user.id"
        >
          <td>
            <img
              v-if="!user.profile_image_path"
              class="imgAvatar"
              src="https://i.pinimg.com/736x/b9/cf/b8/b9cfb82fb98e5805d62c07bf8c707330.jpg"
              alt="img"
            />
            <img
              v-if="user.profile_image_path"
              class="imgAvatar"
              :src="baseImg + user.profile_image_path"
              alt="img"
            />
            <router-link :to="'/cpanel/user/' + user.user_id">
              <span>
                <b>{{ user.first_name + ' ' + user.last_name }}</b>
              </span>
            </router-link>
          </td>
          <td class="center">
            <span>Total Case: <b>24</b></span>
          </td>
          <td class="justify_end mr-lg-2">
            <router-link :to="'/messages/' + user.user_id" tag="button">
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
import 'jquery/dist/jquery.min.js';
import 'datatables.net-dt/js/dataTables.dataTables';
import $ from 'jquery';
import userAPI from '../../../../services/user.API';

export default {
  mounted() {
    userAPI.getAllUserAccessList().then(res => {
      if (res.data.data.map(e => e.role_id === 4)) {
        this.consultants = res.data.data.filter(e => e.role_id === 4)[0];
        this.baseImg = this.consultants && this.consultants.imageFolderPath;
        console.log(this.consultants[0]);
        console.log(this.baseImg);
      }
      setTimeout(() => {
        $('#datatable4').DataTable({
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
        });
      });
    });
  },
  data: function () {
    return {
      consultants: [],
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
}
table#datatable4 {
  border-bottom: none;
  border: none;
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
#datatable4 thead {
  display: none;
}
#datatable4 td {
  align-items: center;
  display: flex;
  width: 30%;
}
#datatable4 span {
  color: #131313;
  font-size: 16px;
  /* font-weight: bold; */
  margin-left: 20px;
  text-transform: capitalize;
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
#datatable4 .icon-message-circle {
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
</style>