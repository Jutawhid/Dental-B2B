/*=========================================================================================
    File Name: user-settings.js
    Description: User Settings jQuery Plugin Intialization
    --------------------------------------------------------------------------------------
    Item Name:  Vuejs, HTML & Laravel Admin Dashboard
    Author: TAWHID

==========================================================================================*/

// profile picture upload
Dropzone.options.profilePicUpload = {
  paramName: "file", // The name that will be used to transfer the file
  maxFiles: 1,
  init: function () {
    this.on("maxfilesexceeded", function (file) {
      this.removeAllFiles();
      this.addFile(file);
    });
  }
};
