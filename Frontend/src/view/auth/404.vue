<template>
  <div class="auth-page">
    <div class="app-content content blank-page">
      <div class="content-wrapper">
        <div class="content-body">
          <!-- error 404 -->
          <section class="row">
            <div
              class="col-xl-12 col-md-12 col-12 d-flex justify-content-center"
            >
              <div
                class="card auth-card bg-transparent shadow-none rounded-0 mb-0 w-100 border-0"
              >
                <div class="card-content">
                  <div class="card-body text-center">
                    <img
                      src="../../assets/images/pages/404.png"
                      class="img-fluid align-self-center"
                      alt="branding logo"
                    />
                    <h1 class="font-large-2 my-1">404 - Page Not Found!</h1>
                    <p class="p-2">
                      It's looking like you may have taken a wrong turn. Don't
                      worry...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <!-- error 404 end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script type="javascript">
export default {
  name: "NotFound",
}
</script>

<style type="text/css" scoped>
.bg-authentication .card {
  border: none !important;
}

.auth-page .flexbox-container {
  margin: auto 15%;
}

.auth-page .col-lg-6 {
  padding: 30px;
}
/*
.auth-page .login-form {
} */

.auth-page .title {
  padding: 40px 0 10px;
}

.auth-page form input {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}

.auth-page form input:focus {
  border: 2px solid #00e2f2;
  box-shadow: none;
}

.auth-page .login-form input[type='checkbox'] {
  width: 23px;
  height: 23px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
}

.auth-page .login-form > img {
  width: 40%;
}

.auth-page .login-form button {
  width: 100%;
  height: 50px;
  background-color: #00e2f2;
  border-color: #00e2f2;
  border-radius: 10px;
  font-weight: 500;
}

.auth-page .login-form .footer-btn a {
  font-size: 16px;
  font-weight: 600;
  color: #123c3d;
  text-decoration: none;
}

.vs-checkbox-con .vs-checkbox {
  border-radius: 5px;
}

.forget-text {
  text-align: right;
}

.forget-text a {
  font-size: 13px;
  color: #000000;
  text-decoration: none;
  line-height: 2;
}

.sp {
  width: 20px;
  height: 20px;
  clear: both;
  margin: 0px auto;
  margin-left: 20px;
}

/* Spinner Wave */
.sp-wave {
  border-radius: 50%;
  position: absolute;
  opacity: 1;
}

.sp-wave:before,
.sp-wave:after {
  content: '';
  border: 1px #000 solid;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
}

.sp-wave:before {
  transform: scale(1, 1);
  opacity: 1;
  -webkit-animation: spWaveBe 0.6s infinite linear;
  animation: spWaveBe 0.6s infinite linear;
}

.sp-wave:after {
  transform: scale(0, 0);
  opacity: 0;
  -webkit-animation: spWaveAf 0.6s infinite linear;
  animation: spWaveAf 0.6s infinite linear;
}
.blank-page .content-wrapper .flexbox-container {
  /*height: calc(1vh * 80);*/
  height: 100%;
  margin: 10%;
}
@-webkit-keyframes spWaveAf {
  from {
    -webkit-transform: scale(0.5, 0.5);
    opacity: 0;
  }
  to {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
}
@keyframes spWaveAf {
  from {
    transform: scale(0.5, 0.5);
    opacity: 0;
  }
  to {
    transform: scale(1, 1);
    opacity: 1;
  }
}
@-webkit-keyframes spWaveBe {
  from {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
  to {
    -webkit-transform: scale(1.5, 1.5);
    opacity: 0;
  }
}
@keyframes spWaveBe {
  from {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
  to {
    -webkit-transform: scale(1.5, 1.5);
    opacity: 0;
  }
}

@media screen and (max-width: 768px) {
  .auth-page .col-lg-6 {
    padding: 15px;
  }

  .auth-page .flexbox-container {
    margin: auto;
  }

  .auth-page .thum-img {
    padding: 0 5%;
  }

  .blank-page .content-wrapper .flexbox-container {
    /*height: calc(1vh * 80);*/
    height: 100%;
    margin: 10% 5%;
  }

  .login-form {
    text-align: center;
  }

  .auth-page .title {
    padding: 20px 0 10px;
  }
  html body .app-content {
    padding-top: 0px !important;
  }
}
strong.err {
  font-weight: 500;
}
</style>
