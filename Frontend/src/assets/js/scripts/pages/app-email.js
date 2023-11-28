//  Notifications & messages scrollable

$(function () {
  "use strict";

  var Font = Quill.import('formats/font');
  Font.whitelist = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'];
  Quill.register(Font, true);

  // Email left Sidebar
  if ($('.sidebar-menu-list').length > 0) {
    var sidebar_menu_list = new PerfectScrollbar(".sidebar-menu-list");
  }

  // User list scroll
  if ($('.emails-user-list').length > 0) {
    var users_list = new PerfectScrollbar(".emails-user-list");
  }

  // Email detail section
  if ($('.emails-scroll-area').length > 0) {
    var users_list = new PerfectScrollbar(".emails-scroll-area");
  }

  // Modal dialog scroll
  if ($('.modal-dialog-scrollable .modal-body').length > 0) {
    var sidebar_menu_list = new PerfectScrollbar(".modal-dialog-scrollable .modal-body");
  }

  // Compose Modal - Reset Input Value on Click compose btn
  $('.compose-btn .btn').on('click', function (e) {
      // all input forms
      $(".modal .modal-body input").val("");
      // quill editor content
      var quill_editor = $(".modal .modal-body .ql-editor");
      quill_editor[0].innerHTML = "";
      // file input content
      var file_input = $(".modal .modal-body .custom-file .custom-file-label");
      file_input[0].innerHTML = "";
  });

  // Main menu toggle should hide app menu
  $('.menu-toggle').on('click', function (e) {
    $('.app-content .sidebar-left').removeClass('show');
    $('.app-content .app-content-overlay').removeClass('show');
  });

  // On sidebar close click
  $(".emails-application .sidebar-close-icon").on('click', function () {
    $('.sidebar-left').removeClass('show');
    $('.app-content-overlay').removeClass('show');
  });

  // Email sidebar toggle
  $('.sidebar-toggle').on('click', function (e) {
    e.stopPropagation();
    $('.app-content .sidebar-left').toggleClass('show');
    $('.app-content .app-content-overlay').addClass('show');
  });
  $('.app-content .app-content-overlay').on('click', function (e) {
    $('.app-content .sidebar-left').removeClass('show');
    $('.app-content .app-content-overlay').removeClass('show');
  });

  // Email Right sidebar toggle
  $('.emails-app-list .emails-user-list li').on('click', function (e) {
    $('.app-content .emails-app-details').toggleClass('show');
  });

  // Add class active on click of sidebar list
  $(".emails-application .list-group-messages a").on('click', function () {
    if ($('.emails-application .list-group-messages a').hasClass('active')) {
      $('.emails-application .list-group-messages a').removeClass('active');
    }
    $(this).addClass("active");
  });

  // Email detail view back button click
  $('.go-back').on('click', function (e) {
    e.stopPropagation();
    $('.app-content .emails-app-details').removeClass('show');
  });

  // For app sidebar on small screen
  if ($(window).width() > 768) {
    if ($('.app-content .app-content-overlay').hasClass('show')) {
      $('.app-content .app-content-overlay').removeClass('show');
    }
  }
  // Favorite star click
  $(".emails-application .favorite i").on("click", function (e) {
    $(this).parent('.favorite').toggleClass("warning");
    e.stopPropagation();
  });

  // On checkbox click stop propogation
  $(".emails-user-list .vs-checkbox-con input").on("click", function (e) {
    e.stopPropagation();
  });

  // Select all checkbox
  $(document).on("click", ".emails-app-list .selectAll input", function () {
    $(".user-action .vs-checkbox-con input").prop('checked', this.checked);
  });

  // Delete Mail from list
  $(".emails-application .mail-delete").on("click", function () {
    $(".emails-application .user-action .vs-checkbox-con input:checked").closest("li").remove();
    $(".emails-application .selectAll input").prop('checked', "");
  });

  // Mark mail unread
  $(".emails-application .mail-unread").on("click", function () {
    $(".emails-application .user-action .vs-checkbox-con input:checked").closest("li").removeClass("mail-read");
  });

  // Filter
  $(".emails-app-list #emails-search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    if (value != "") {
      $(".emails-user-list .users-list-wrapper li").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
      var tbl_row = $(".emails-user-list .users-list-wrapper li:visible").length; //here tbl_test is table name

      //Check if table has row or not
      if (tbl_row == 0) {
        $('.emails-user-list .no-results').addClass('show');
      }
      else {
        if ($('.emails-user-list .no-results').hasClass('show')) {
          $('.emails-user-list .no-results').removeClass('show');
        }
      }
    }
    else {
      // If filter box is empty
      $(".emails-user-list .users-list-wrapper li").show();
      if ($('.emails-user-list .no-results').hasClass('show')) {
        $('.emails-user-list .no-results').removeClass('show');
      }
    }
  });

  // Email compose Editor

  var emailEditor = new Quill('#emails-container .editor', {
    bounds: '#emails-container .editor',
    modules: {
      'formula': true,
      'syntax': true,
      'toolbar': [
        ['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'code-block',
          {
            'header': '1'
          }, {
            'header': '2'
          }, {
            'list': 'ordered'
          }, {
            'list': 'bullet'
          }],
        [{
          'font': []
        }]
      ],
    },
    placeholder: 'Message',
    theme: 'snow'
  });

  var editors = [emailEditor];

});

$(window).on("resize", function () {
  // remove show classes from sidebar and overlay if size is > 992
  if ($(window).width() > 768) {
    if ($('.app-content .app-content-overlay').hasClass('show')) {
      $('.app-content .sidebar-left').removeClass('show');
      $('.app-content .app-content-overlay').removeClass('show');
    }
  }
});

