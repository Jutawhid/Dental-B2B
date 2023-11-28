<template>
  <div
    class="TextInput"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <label :for="name">{{ label }}</label>
    <input
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p class="help-message" v-show="errorMessage || meta.valid">
      {{ errorMessage || successMessage }}
    </p>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  name: 'TextInput',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    successMessage: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // we don't provide any rules here because we are using form-level validation
    // https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(props.name, undefined, {
      initialValue: props.value,
    });

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
    };
  },
};
</script>

<style scoped>
.TextInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  background: #ffffff ;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  padding: 15px 10px;
  outline: none;
  width: 100%;
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
}

input:focus {
  border: 1px solid #d9d9d9;
}

.help-message {
  /* position: absolute; */
  /* bottom: calc(-1.5 * 1.5em); */
  /* left: 5px; */
  /* margin: 0; */
  font-size: 14px;
  margin: 10px 5px;
}

.TextInput.has-error input {
  background-color: var(--error-bg-color);
  color: #ea5455;
  border-color: #ea5455;
}

.TextInput.has-error input:focus {
  border-color: #ea5455;
}

.TextInput.has-error .help-message {
  color: #ea5455;
}

.TextInput.success input {
  background-color: var(--success-bg-color);
  color: #123c3d;
  border-color: #1f9d57;
}

.TextInput.success input:focus {
  border-color: #1f9d57;
}

.TextInput.success .help-message {
  color: #1f9d57;
}
</style>
