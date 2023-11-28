<template>
  <div class="inv-body">
    <!-- header title/logo -->
    <div class="inv-header">
      <span class="inv-title">Invoice No.</span>
      <img
        src="../../../../../assets/images/logo/easyfi__logo.png"
        alt="logo"
        style="width: 100px !important"
      />
    </div>
    <!-- table -->
    <div class="mh">
      <table class="inv-tbl my-2">
        <thead>
          <tr>
            <th>
              <span class="inv-title">Service No.</span>
            </th>
            <th>
              <span class="inv-title">Details</span>
            </th>
            <th>
              <span class="inv-title">Quantity</span>
            </th>
            <th>
              <span class="inv-title">Total</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="index in 2" :key="index">
            <td>
              <span class="inv-title">D-002</span>
            </td>
            <td>
              <span class="inv-title">Service 1</span>
            </td>
            <td>
              <span class="inv-title">10</span>
            </td>
            <td>
              <span class="inv-title">$ 250</span>
            </td>
          </tr>
          <tr class="final">
            <td>
              <span class="inv-title">Note:</span>
              <span class="inv-title"> 2</span>
            </td>
            <td></td>
            <td>
              <span class="inv-title">Total: </span>
              <span class="inv-title"> 02</span>
            </td>
            <td>
              <span class="inv-title">Total: </span>
              <span class="inv-title"> $ 250</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- header title/logo -->
    <div class="inv-header final">
      <div class="d-flex col-12">
        <p class="col-4">Signed By</p>
        <p class="col-4">Signed By</p>
        <p class="col-4">Signed By</p>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
export default {};
</script>
<style type="text/css" scoped>
.inv-body {
  min-width: 300px;
  min-height: 600px;
  background: #ffffff;
  box-shadow: 0px 3px 6px #00000069;
  padding: 25px;
}
.inv-header {
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #efefef;
  border: 1px solid #efefef;
  padding: 15px;
}
.inv-title {
  color: #071c1d;
  font-size: 14px;
  font-weight: 500;
}
.inv-tbl {
  width: 100%;
  /* border: 1px solid #ded8d8; */
  /* height: 300px; */
}
.inv-tbl th,
.inv-tbl td {
  border: 1px solid #ded8d8;
  padding: 5px;
}
.inv-tbl tr.final td {
  border: 1px solid transparent;
  text-align: left;
}
.inv-tbl thead .inv-title {
  color: #071c1d;
  font-size: 14px;
  font-weight: 500;
}
tbody tr.final .inv-title {
  font-size: 12px;
  font-weight: 500;
}
.mh {
  height: 300px;
  overflow-y: auto;
}
.inv-header.final {
  position: absolute;
  bottom: 25px;
  width: 92%;
}
</style>
