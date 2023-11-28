<template>
  <div class="row">
    <div class="col-lg-12">
      <table
        class="table tableBorder"
        id="fileTbl"
        v-if="this.deletedFileList.length > 0"
      >
        <thead>
          <tr>
            <th class="tableHeader" align="center">Case ID</th>
            <th class="tableHeader" align="center">File Name</th>
            <th class="tableHeader" align="center">Uploaded By</th>
            <!-- <th class="tableHeader" align="center">Deleted By</th> -->
            <th class="tableHeader" align="center" width="150px">
              Deleted Date
            </th>
            <th class="tableHeader" align="center">Actions</th>
          </tr>
        </thead>
        <tbody class="mx-lg-2">
          <tr v-for="(item, index) in deletedFileList" :key="index">
            <td class="normalFont" align="center" aria-label="Case ID">
              <!-- <router-link :to="'/case/' + item.case_id"> -->
              <span class="blueFont">{{ item.case_id }}</span>
              <!-- </router-link> -->
            </td>
            <td class="normalFont" align="center" aria-label="File Name">
              {{ item.file_name.split('_').join(' ') }}
            </td>
            <td
              class="normalFont text-capitalize"
              align="center"
              aria-label="Uploaded By"
            >
              {{ item.uploaded_by_name }}
            </td>
            <!-- <td class="normalFont text-capitalize" align="center">
              {{ item.deleted_by_name }}
            </td> -->
            <td class="normalFont" align="center" aria-label="Deleted Date">
              {{ moment(item.created_at).format('MMM Do YY') }}
            </td>
            <td class="normalFont" align="center" aria-label="Action">
              <button
                class="btn-download mr-1"
                @click="downloadFile(item.id, item.file_name)"
              >
                <img src="../../../../assets/images/icons/download.svg" />
                Download
              </button>
              <button class="btn-restore btn-md" @click="restoreFile(item.id)">
                <img src="../../../../assets/images/icons/restore.svg" />
                Restore
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="mt-1 alert alert-info" v-else>Sorry, No data found.</p>
    </div>
  </div>
</template>

<script>
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import trashAPI from '../../../../services/trash.API';
import { createToast } from 'mosha-vue-toastify';
import moment from 'moment';

export default {
  mounted() {
    trashAPI.getTrashList().then(
      response => {
        // console.log(response);
        if (response.data.data) {
          response.data.data.map(e => {
            if (e.type === 'Case File') {
              this.deletedFileList = e.data.length > 0 ? e.data : [];
              this.BasePath = e.folder;
            }
            // if (this.deletedFileList) {
            setTimeout(() => {
              $('#fileTbl').DataTable({
                lengthMenu: [
                  [10, 25, 50, -1],
                  [10, 25, 50, 'All'],
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
                targets: 'no-sort',
                bSort: false,
                order: [],
                bFilter: true,
                bInfo: false,
                bLengthChange: false,
                bDestroy: true,
              });
            });
            // console.log(this.deletedFileList);
            // }
          });
        }
      },
      error => {
        if (error.response.data.success === false) {
          createToast(error.response.data.message, {
            type: 'danger',
            showIcon: true,
            position: 'top-right',
            duration: 2000,
          });
        }
      },
    );
  },
  data: function () {
    return {
      deletedFileList: [],
      BasePath: '',
    };
  },
  created() {
    this.moment = moment;
  },
  methods: {
    // download File
    downloadFile(id, file_name) {
      trashAPI.downloadTrashFile(id).then(
        response => {
          if (response.data.type === 'application/json') {
            createToast('File Not Found', {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              timeout: 2000,
            });
          } else {
            const blob = new Blob([response.data], {
              type: 'application/stl',
            });
            // create a link to download the file
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            // set file name
            link.setAttribute('download', file_name);
            document.body.appendChild(link);
            // download file
            link.click();
            URL.revokeObjectURL(link.href);
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          }
        },
      );
    },
    // restore File
    restoreFile(id) {
      trashAPI.restoreTrashFile(id).then(
        response => {
          // console.log(response);
          if (response.data.success === true) {
            createToast(response.data.message, {
              type: 'success',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
            this.deletedFileList = this.deletedFileList.filter(
              e => e.id !== id,
            );
          } else {
            createToast(response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          }
        },
        error => {
          if (error.response.data.success === false) {
            createToast(error.response.data.message, {
              type: 'danger',
              showIcon: true,
              position: 'top-right',
              duration: 2000,
            });
          }
        },
      );
    },
  },
};
</script>
<style scoped>
#user-profile .nav.nav-tabs {
  margin: 0 0 0 20px !important;
  border: none;
}
span.badge {
  padding: 8px 10px;
  font-size: 11px;
}
table.dataTable thead tr {
  background-color: #ffffff;
  padding-top: 50px;
  padding-bottom: 30px;
}
.tableBorder {
  padding-top: 20px !important;
  padding: 10px 0;
  background: #ffffff;
  border: 1px solid #bebebe;
  border-radius: 15px;
  opacity: 1;
}
.tableHeader {
  font: normal normal bold 13px/20px Poppins;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  /* min-width: 150px; */
}
.blueFont {
  font-size: 13px;
  color: #1492e6;
  font-weight: 600;
}
.normalFont {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0px;
  color: #000000;
  border: none;
  border-top: 1px solid #b9b3b3 !important;
  padding: 15px 0;
}
table.dataTable thead th,
table.dataTable thead td {
  border-bottom: none !important;
  text-align: center;
}
/* tr {
  height: 80px;
} */
table.dataTable thead .sorting:before,
table.dataTable thead .sorting_asc:before,
table.dataTable thead .sorting_desc:before {
  display: none;
}
table.dataTable thead .sorting:after,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc:after {
  font-family: 'feather';
  content: '\e842';
  font-size: 1rem;
  margin-left: 5px;
}
table.dataTable thead .sorting {
  /* display: none !important; */
  background-image: none !important;
}
th.tableHeader.sorting {
  text-align: center;
  padding-bottom: 20px;
}
/* Right Side Filter */
.filterContainer {
  background: #b9d0d2;
  border-radius: 10px;
  width: 20.5%;
  padding: 20px 30px;
  margin: 0px 0px;
  height: 90%;
  position: fixed;
  top: 75px;
}
.filterContainer p {
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  padding: 15px 0 0 0;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
/* .filter select.form-control:not([multiple="multiple"]){

} */
#service,
#status {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .box {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  padding: 5px 20px;
  width: 100%;
  margin-bottom: 10px;
  font-weight: normal;
}
.filterContainer .box label {
  font-size: 12px;
  letter-spacing: 0px;
  color: #000000;
  font-family: 'Poppins';
}
.resetBtn {
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal normal 13px/20px Poppins;
  color: #ff0000;
  text-transform: uppercase;
  border: 1px solid #fff;
}
.applyBtn {
  background: #123c3d;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 10px;
  margin: 5px;
  padding: 5px 15px;
  font: normal normal medium 13px/20px Poppins;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: uppercase;
  border: 1px solid #123c3d;
}
input#search .form-control:focus {
  border-color: #c9d3d4 !important;
}
.filter input {
  background: #f0f1f1;
  border-radius: 10px;
  height: auto;
  margin-bottom: 10px;
}
.filterContainer .filterPart label {
  margin: 5px;
  font-weight: normal !important;
  width: 100% !important;
}
.filterContainer label {
  color: black;
  font-weight: bold;
}
i.feather.icon-filter {
  color: black;
  font-weight: bold;
}
tr {
  border-color: inherit;
  border-style: solid;
  border-width: 0;
  border-top: 1px solid gray;
  border-bottom: none;
}
table.dataTable.no-footer {
  border-bottom: 1px solid #bfbebe;
}
table.dataTable {
  margin-top: 0px !important;
}
@media only screen and (max-width: 1050px) {
  .filterContainer {
    display: none;
  }
}

span.small {
  color: #414141;
}
/*  */

table {
  width: 100%;
}

table thead tr h1,
table thead tr h2,
table thead tr .h1,
table thead tr .h2,
table thead tr h3,
table thead tr .h3,
table thead tr h4,
table thead tr .h4 {
  color: #151515;
}
table thead tr a {
  color: #0075b0;
}
table thead tr a:hover,
table thead tr a:focus {
  color: white;
}
table tbody tr:nth-of-type(even) {
  background: #e5ecec;
}
table td,
table th {
  /* padding: 8px 14px !important;
  text-align: right; */
  font-size: 0.9rem;
}
table td a,
table th a {
  font-weight: bold;
  color: #00918a !important;
}
table td a:hover,
table th a:hover,
table td a:focus,
table th a:focus {
  color: white !important;
}
table th {
  font-weight: 700;
  font-size: 0.8rem;
  line-height: 1.4;
  font-family: 'Gotham SSm A', 'Gotham SSm B', Helvetica, sans-serif;
  text-transform: uppercase;
  margin: 0;
  max-width: 800px;
  line-height: inherit;
  color: #151515;
}
table th.PrimaryFont {
  text-transform: none;
}

@media only screen and (max-width: 599px) {
  table td,
  table th {
    padding: 8px 14px !important;
    text-align: right;
    font-size: 0.9rem;
  }
  table th {
    display: none;
  }
  table td {
    position: relative;
    display: block;
    padding-left: 110px;
  }
  table td:before {
    position: absolute;
    top: 8px;
    left: 10px;
    display: block;
    content: attr(aria-label) ': ';
    font-weight: 700;
  }
  table tbody tr {
    padding: 20px 0;
    display: block;
  }
  table:nth-of-type(odd) {
    background: #f3f3f3;
  }
}

body {
  padding: 20px;
}
table {
  border-collapse: collapse;
}
</style>
