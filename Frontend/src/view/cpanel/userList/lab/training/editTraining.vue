<template>
    <div>
        <!-- Container Fluid-->

        <div class="app-content content">
            <div class="content-overlay"></div>
            <div class="header-navbar-shadow"></div>
            <div class="content-wrapper">
                <div class="row">
                    <div class="col-lg-6">
                       <div class="card p-5">
                           <div class="content-body">
                               <h1 class="text-bold-700 mb-3 text-center">Edit Training </h1>
                               <form class="user" @submit.prevent="saveTrainings" enctype="multipart/form-data">

                                   <label for="training_name">Training name</label>
                                   <input type="hidden" class="form-control mb-3" v-model="trainings.id">
                                   <input type="text" class="form-control mb-3" v-model="trainings.name" id="training_name">

                                   <label for="training_detail">Training Detail</label>
                                   <textarea class="form-control detail" v-model="trainings.details" id="training_detail"></textarea>

                                   <div>
                                       <input type="file" class="custom-file-input" id="customFile"
                                              @change="onFileSelected">


                                       <label class="custom-file-label mb-3" for="customFile">Choose file</label>

                                       <img :src="trainings.file_path" style="height: 40px; width: 40px;">
                                   </div>

                                   <!--<button class="btn btn-edit mr-0 waves-effect waves-light btn-cancel"
                                           v-on:click="cancelTrainings(training)">
                                       <i class="feather icon-x mr-50"></i>Cancel
                                   </button>-->

                                   <button class="btn btn-edit mr-0 waves-effect waves-light btn-cancel" type="submit">
                                       <i class="feather icon-check mr-50"></i>Update
                                   </button>
                               </form>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>


        <!---Container Fluid-->
    </div>
</template>

<script type="javascript">
    // import Notification from "../../../../Helpers/Notification";
    // import axios from '../axios'
    // import User from '../../../../Helpers/User'

    export default {
        // async created() {
        //     if (!User.loggedIn()) {
        //         this.$router.push({name: 'login'})
        //     }
        //     this.editTraining()

        // },
        data(){
            return {
                trainings: [
                    {
                        id:'',
                        name:'',
                        file_path:'',
                        newphoto:'',
                        details:''
                    }
                ],
                error: []
            }
        },
        methods: {
            editTraining(){
                let id = this.$route.params.id;

                axios.get('trainings/edit-training/'+id, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((response) => {
                    this.trainings = response.data.value[0];
                    console.log(response.data.value[0])
                });



            },

            saveTrainings(){
                // Object.assign(trainings, this._originalTrainings);

                axios
                    .patch(
                        "trainings/update-training",
                        {
                            id: this.trainings.id,
                            name: this.trainings.name,
                            file: this.trainings.file_path,
                            details: this.trainings.details
                        },
                        {
                            headers: {
                                Authorization: "Bearer " + localStorage.getItem("token"),
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.status === "false") {
                            this.$swal({
                                icon: "error",
                                title: "Failed to update, Please Try again !",
                            });
                            this.errors = response.data.validation_error
                        } else {
                            this.$swal({
                                icon: "success",
                                title: "Successfully Updated !",
                            });

                            this.trainings.edit = false;

                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },
            onFileSelected(event){
                let file = event.target.file[0];
                if(file.size > 1048770){
                    Notification.image_validation();
                }else{
                    let reader = new FileReader();
                    reader.onload = event => {
                        this.trainings.newphoto = event.target.result;
                        console.log(event.target.result)
                    };
                    reader.readAsDataURL(file)
                }
            },
        }
    }
</script>

<style type="text/css">

    .custom-file-label {
        width: 300px;
        margin-right: 40px;
        position: relative;
    }
    @media only screen and (min-width: 992px) {

    }

    @media only screen and (max-width: 992px) {

    }

    @media only screen and (max-width: 991px) and (min-width: 768px) {

    }

</style>