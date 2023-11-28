<template>
  <Form>
    <div v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs" />
    </div>
    <button>Submit</button>
  </Form>
</template>
<script>
import { Form, Field } from "vee-validate";
export default {
  name: "DynamicForm",
  components: {
    Form,
    Field,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
};
</script>
