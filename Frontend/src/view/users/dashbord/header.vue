<template>

</template>

<script>
    import axios from 'axios'
    export default {
        async created() {
            const response = await axios.get("userprofile/view", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            this.user = response.data.data[0];
            if (this.user) {
                this.role = this.user.role_id;
            }
        },
        data() {
            return {
                user: {},
                role: null,
            };
        },
    };
</script>

<style type="text/css" scoped>
</style>