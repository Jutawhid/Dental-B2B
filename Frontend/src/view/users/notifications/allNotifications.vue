<template>
  <div>
    <!-- Container Fluid-->
    <div class="app-content content">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="row">
          <div class="col-12 col-sm-12">
            <h3 class="text-bold-700 mb-0 headerTXT">Notifications</h3>
          </div>
          <div class="col-12">
            <hr />
          </div>
        </div>

        <!-- Body Part -->
        <div class="row text-center" id="seenUnseen">
          <!-- data table / case list -->
          <div class="col-lg-12" v-if="this.notificationLists?.length > 0">
            <table id="datatable">
              <thead>
                <tr class="d-flex justify-content-between">
                  <!-- <th>#</th> -->
                  <th>Title</th>
                  <th class="text-lg-right mr-lg-5">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="d-flex justify-content-between"
                  v-for="item in this.notificationLists"
                  :key="item.id"
                >
                <td
                    class="primary media-heading text-left"
                    :class="item.is_seen === 0 ? '' : 'seen'"
                  >
                    <a
                      :href="item.url"
                      :class="item.is_seen === 0 ? 'font-weight-bold' : ''"
                    >
                      {{ item.title }}
                    </a>
                  </td>

                  <td class="justify_end">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      v-if="item.is_seen === 0"
                      @click="markAsRead(item.id)"
                    >
                      Mark as Read
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- loader starts-->
          <div class="col-xl-12" v-show="this.notificationLists?.length == 0">
            <div class="row">
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
              <div class="col-xl-12">
                <div class="placeholder wave">
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                  <div class="line"><br /></div>
                </div>
              </div>
            </div>
          </div>
          <!-- loader ends-->
        </div>

        <!-- Body END -->
      </div>
    </div>
    <!---Container Fluid-->
  </div>
</template>

<script>
import $ from 'jquery';
import notificationList from '../../../services/user.API';
export default {
  name: 'AllNotifications',
  data() {
    return {
      notificationList: [],
    };
  },
  mounted() {
    this.$store.dispatch('notification/notiList');
    // this.getNotificationList();
    console.log(this.notificationLists);
    // this.notificationList = this.notificationLists;
    if (this.notificationLists.length > 0) {
      setTimeout(() => {
        $('#datatable').DataTable({
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5, 10, 25, 50, 'All'],
          ],
          pageLength: 10,
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
          // targets: 'no-sort',
          bSort: false,
          bInfo: true,
          bLengthChange: false,
          // searching: false,
        });
      });
    }
  },
  computed: {
    notificationLists() {
      return this.$store.state.notification.notifications;
    },
  },
  methods: {
    markAsRead(id) {
      notificationList.seenNotification(id).then(
        res => {
          if (res.data.status == 200) {
            this.$store.dispatch('notification/notiList');
            this.$store.dispatch('notification/notiCount');
          }
          console.log(res);
        },
        error => {
          console.log(error);
        },
      );
    },
  },
};
</script>

<style scoped>
.badge {
  padding: 10px 15px;
}
tbody a:hover {
  color: #123c3d;
  text-decoration: none;
}
table.dataTable thead th,
table.dataTable thead td,
table.dataTable tfoot th,
table.dataTable tfoot td {
  font-size: 1.2rem;
}
div.dataTables_wrapper div.dataTables_filter {
  display: none;
}
thead,
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  display: inline-block;
  width: 100%;
}

thead td {
  width: 100%;
}
thead tr {
  border-radius: 0px;
  border-bottom: 2px solid #123c3d;
  box-shadow: none;
  background-color: transparent;
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: #000;
}
#datatable th {
  text-align: inherit;
  width: 33%;
  display: inline-block;
  padding: 5px 25px;
  font-size: 12px;
}
/* #dataTable2 td span {

  font-size: 14px;
} */
tr {
  cursor: pointer;
}
table.dataTable tbody tr:hover {
  background-color: #e3e3e3;
}
tr,
a.TR.d-flex.justify-content-between {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px;
  margin: 5px 0;
  /* display: flex;
  flex-wrap: wrap; */
  width: 100%;
  padding: 0.2rem 1rem;
}
table#caseTables {
  border-bottom: none;
  border: none;
  width: 100%;
}
img.imgAvatar {
  width: 50px;
  height: 50px;
  border-radius: 9px;
  /* padding: 5px; */
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
}
/* #caseTable thead { */
/* display: none; */
/* } */
a.TR.d-flex.justify-content-between td,
td {
  border-radius: 20px;
  align-items: center;
  display: flex;
  /* width: 100%; */
  padding: 5px 25px;
}
span {
  color: #131313;
  font-size: 14px;
  /* font-weight: bold; */
  margin-left: 20px;
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
.icon-message-circle {
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
/* *********************************** */
.placeholder {
  margin: 15px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  background-color: #e3e3e3;
  border-radius: 20px;
}
.placeholder.pulse div {
  animation: pulse 1s infinite ease-in-out;
  -webkit-animation: pulse 1s infinite ease-in-out;
}
.placeholder.wave div {
  animation: wave 1s infinite linear forwards;
  -webkit-animation: wave 1s infinite linear forwards;
  background: #f6f7f8;
  background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
  background-size: 800px 104px;
}
.placeholder div {
  background: #e8e8e8;
}
.placeholder .square {
  float: left;
  width: 30px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .rectangle {
  float: left;
  width: 40px;
  height: 30px;
  margin: 0 0 10px;
}
.placeholder .line {
  height: 12px;
  margin: 25px auto;
  width: 10%;
}
.placeholder .circle {
  float: left;
  width: 40px;
  height: 40px;
  margin: 0 15px 10px 0;
  border-radius: 40px;
}

@keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@-webkit-keyframes pulse {
  0% {
    background-color: rgba(165, 165, 165, 0.1);
  }
  50% {
    background-color: rgba(165, 165, 165, 0.8);
  }
  100% {
    background-color: rgba(165, 165, 165, 0.1);
  }
}
@keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
@-webkit-keyframes wave {
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
}
#td.primary.media-heading.seen {
  color: #5e606e !important;
}
</style>
