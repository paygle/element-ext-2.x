<template>
  <div class="cell el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
    <slot></slot>
    <!-- <label :for="labelFor" class="el-form-item__label" v-bind:style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{label + form.labelSuffix}}</slot>
    </label>
    <div class="el-form-item__content" v-bind:style="contentStyle">
      <slot></slot>
      <transition name="el-zoom-in-top">
        <div
          v-if="validateState === 'error' && showMessage && form.showMessage"
          class="el-form-item__error"
          :class="{
            'el-form-item__error--inline': typeof inlineMessage === 'boolean'
              ? inlineMessage
              : (elForm && elForm.inlineMessage || false)
          }"
        >
          {{validateMessage}}
        </div>
      </transition>
    </div> -->
  </div>
</template>
<script>
  import AsyncValidator from 'async-validator';
  import emitter from 'element-ui/src/mixins/emitter';
  // import objectAssign from 'element-ui/src/utils/merge';
  import { noop, TypeOf, compatDateStr } from 'element-ui/src/utils/util';

  export default {
    name: 'ElTableItem',

    componentName: 'ElFormItem',

    mixins: [emitter],

    provide() {
      return {
        elFormItem: this
      };
    },

    inject: ['elForm'],

    props: {
      // label: String,
      // labelWidth: String,
      value: {},
      prop: Object, // 包含 { $index, row, column, store, _self }
      property: String,
      required: {
        type: Boolean,
        default: undefined
      },
      ruler: Object, // 表格表单规则集
      // error: String,
      // validateStatus: String,
      // for: String,
      // inlineMessage: {
      //   type: [String, Boolean],
      //   default: ''
      // },
      // showMessage: {
      //   type: Boolean,
      //   default: true
      // },
      size: String
    },
    watch: {
      // error: {
      //   immediate: true,
      //   handler(value) {
      //     this.validateMessage = value;
      //     this.validateState = value ? 'error' : '';
      //   }
      // },
      // validateStatus(value) {
      //   this.validateState = value;
      // }
    },
    computed: {
      rules() {
        return this.ruler ? this.ruler[this.prop.column.property] : undefined; // 获取当前属性的校验规则
      },
      // labelFor() {
      //   return this.for || this.prop;
      // },
      // labelStyle() {
      //   const ret = {};
      //   if (this.form.labelPosition === 'top') return ret;
      //   const labelWidth = this.labelWidth || this.form.labelWidth;
      //   if (labelWidth) {
      //     ret.width = labelWidth;
      //   }
      //   return ret;
      // },
      // contentStyle() {
      //   const ret = {};
      //   const label = this.label;
      //   if (this.form.labelPosition === 'top' || this.form.inline) return ret;
      //   if (!label && !this.labelWidth && this.isNested) return ret;
      //   const labelWidth = this.labelWidth || this.form.labelWidth;
      //   if (labelWidth) {
      //     ret.marginLeft = labelWidth;
      //   }
      //   return ret;
      // },
      // form() {
      //   let parent = this.$parent;
      //   let parentName = parent.$options.componentName;
      //   while (parentName !== 'ElFormTable') { // 扩展修改
      //     if (parentName === 'ElTableItem') { // 扩展修改
      //       this.isNested = true;
      //     }
      //     parent = parent.$parent;
      //     parentName = parent.$options.componentName;
      //   }
      //   return parent;
      // },

      isRequired() {
        let rules = this.rules;
        let isRequired = false;

        if (rules && rules.length) {
          rules.every(rule => {
            if (rule.required) {
              isRequired = true;
              return false;
            }
            return true;
          });
        }
        return isRequired;
      },

      _formSize() {
        return this.elForm.size;
      },
      elFormItemSize() {
        return this.size || this._formSize;
      },
      sizeClass() {
        return (this.$ELEMENT || {}).size || this.elFormItemSize;
      }
    },
    data() {
      return {
        validateState: '',
        validateMessage: '',
        validateDisabled: false,
        validator: {}
        // isNested: false
      };
    },
    methods: {
      // 扩展-> 获取类型数值
      getTypeOfVal(value, rules) {

        let typevalue = '', type, cdate;

        if (TypeOf(rules) === 'Array') {
          for (let i = 0; i < rules.length; i++) {
            type = rules[i].type ? rules[i].type : 'string';
            if (TypeOf(rules[i]) === 'Object' && rules[i]['type'] === 'date' && TypeOf(value) === 'String') {
              cdate = new Date(compatDateStr(value));
            }
          }
        } else if (TypeOf(rules) === 'Object' && rules.type === 'date' && TypeOf(value) === 'String') {
          type = rules.type ? rules.type : 'string';
          cdate = new Date(compatDateStr(value));
        }

        if (TypeOf(value) === 'Date') {
          typevalue = value;
        } else if (TypeOf(cdate) === 'Date' && !isNaN(cdate.getTime())) {
          typevalue = cdate;
        } else {
          typevalue = value;
        }

        // 类型分配
        switch (type) {

          case 'string':
          case 'email':
          case 'url':
            typevalue = String(value);
            break;

          case 'number':
          case 'integer':
            typevalue = isNaN(value) ? value : Number(value);
            break;

          case 'float':
            typevalue = isNaN(value) ? value : parseFloat(value);
            break;

          case 'boolean':
            typevalue = Boolean(value);
            break;
        }

        return typevalue;
      },

      validate(trigger, callback = noop) {
        this.validateDisabled = false;
        // const rules = this.getFilteredRule(trigger);
        // if ((!rules || rules.length === 0) && this.required === undefined) {
        //   callback();
        //   return true;
        // }

        // this.validateState = 'validating';

        // const descriptor = {};
        // if (rules && rules.length > 0) {
        //   rules.forEach(rule => {
        //     delete rule.trigger;
        //   });
        // }
        // descriptor[this.prop] = rules;

        // const validator = new AsyncValidator(descriptor);
        // const model = {};

        // model[column.property] = this.getTypeOfVal(this.value, rule);
        // validator.validate(model, { firstFields: true }, (errors, fields) => {
        //   this.validateState = !errors ? 'success' : 'error';
        //   this.validateMessage = errors ? errors[0].message : '';

        //   callback(this.validateMessage);
        // });

        // const regxNumber = /^\d*\.?\d*$/g;
        const {$index, row, column, store} = this.prop;

        // 验证样式设置
        this.$nextTick(()=> {
          let rowIdx, store = this.prop.store;
          // 触发外部校验
          if (typeof store.table.validTrigger === 'function') {
            rowIdx = this.property.replace('row', '').replace(/[a-z]+[a-z0-9]*$/ig, '');
            store.table.validTrigger.call(null, store.states.data[rowIdx], this.property.replace(`row${rowIdx}`, ''));
          }
        });

        if (TypeOf(this.value) === 'Array') return; // 类型为数组时不校验

        if (this.rules) { // 存在规则才进行校验
          this.validateState = 'validating';
          let descriptor = {}, model = {};
          descriptor[column.property] = this.rules;
          let validator = new AsyncValidator(descriptor);

          model[column.property] = this.getTypeOfVal(this.value, this.rules);
          validator.validate(model, { firstFields: true, row: row }, (errors, fields) => {
            this.validateState = !errors ? 'success' : 'error';
            this.validateMessage = errors ? errors[0].message : '';
            callback(errors);
          });
        }

        if (column.property) {
          if (this.validateState !== 'error') {
            store.commit('disErrCount', `row${$index + column.property}`);
          } else {
            store.commit('setErrCount', `row${$index + column.property}`);
          }
        }
        this.dispatch('ElFormTable', 'err-change');
      },
      clearValidate() {
        this.validateState = '';
        this.validateMessage = '';
        this.validateDisabled = false;
      },
      resetField() {
        let { row, column } = this.prop;
        this.validateState = '';
        this.validateMessage = '';

        if (Array.isArray(this.value)) {
          this.validateDisabled = true;
          row[column.property] = [].concat(this.initialValue);
        } else {
          this.validateDisabled = true;
          row[column.property] = this.initialValue;
        }
      },
      onFieldBlur() {
        this.validate('blur');
      },
      onFieldChange() {
        if (this.validateDisabled) {
          this.validateDisabled = false;
          return;
        }

        this.validate('change');
      }
    },
    mounted() {

      if (this.prop.column.type === 'input') {
        this.dispatch('ElFormTable', 'el.form.addField', [this]); // 扩展修改

        let initialValue = this.value;
        if (Array.isArray(initialValue)) {
          initialValue = [].concat(initialValue);
        }
        Object.defineProperty(this, 'initialValue', {
          value: initialValue
        });

        if (this.rules && this.rules.length || this.isRequired) {
          this.$on('el.form.blur', this.onFieldBlur);
          this.$on('el.form.change', this.onFieldChange);
        }
      }
    },
    beforeDestroy() {
      this.dispatch('ElFormTable', 'el.form.removeField', [this]); // 扩展修改
    }
  };
</script>
