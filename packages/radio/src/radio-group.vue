<template>
  <div
    class="el-radio-group"
    role="radiogroup"
    @keydown="handleKeydown"
    @mouseover="inputMouseover"
    @mouseout="inputMouseout"
  >
    <slot></slot>
  </div>
</template>
<script>
  import Emitter from 'element-ui/src/mixins/emitter';

  const keyCode = Object.freeze({
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  });
  export default {
    name: 'ElRadioGroup',

    componentName: 'ElRadioGroup',

    inject: {
      elFormItem: {
        default: ''
      }
    },

    mixins: [Emitter],

    props: {
      value: {},
      size: String,
      fill: String,
      textColor: String,
      disabled: Boolean
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      radioGroupSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },

    created() {
      this.$on('handleChange', value => {
        this.$emit('change', value);
      });
    },
    mounted() {
      // 当radioGroup没有默认选项时，第一个可以选中Tab导航
      const radios = this.$el.querySelectorAll('[type=radio]');
      const firstLabel = this.$el.querySelectorAll('[role=radio]')[0];
      if (![].some.call(radios, radio => radio.checked) && firstLabel) {
        firstLabel.tabIndex = 0;
      }
      // ext-> compare
      this.$nextTick(() => {
        this.dispatch('ElForm', 'compare-change', this);
      });
    },
    methods: {
      handleKeydown(e) { // 左右上下按键 可以在radio组内切换不同选项
        const target = e.target;
        const className = target.nodeName === 'INPUT' ? '[type=radio]' : '[role=radio]';
        const radios = this.$el.querySelectorAll(className);
        const length = radios.length;
        const index = [].indexOf.call(radios, target);
        const roleRadios = this.$el.querySelectorAll('[role=radio]');
        switch (e.keyCode) {
          case keyCode.LEFT:
          case keyCode.UP:
            e.stopPropagation();
            e.preventDefault();
            if (index === 0) {
              roleRadios[length - 1].click();
            } else {
              roleRadios[index - 1].click();
            }
            break;
          case keyCode.RIGHT:
          case keyCode.DOWN:
            if (index === (length - 1)) {
              e.stopPropagation();
              e.preventDefault();
              roleRadios[0].click();
            } else {
              roleRadios[index + 1].click();
            }
            break;
          default:
            break;
        }
      },
      // ext-> 鼠标over时事件
      inputMouseover(e) {
        this.dispatch('ElFormItem', 'el.form.mouseover', [e]);
      },
      // ext-> 鼠标out时事件
      inputMouseout(e) {
        this.dispatch('ElFormItem', 'el.form.mouseout', [e]);
      }
    },
    watch: {
      value(value) {
        this.$emit('change', value); // ext-> change
        this.dispatch('ElFormItem', 'el.form.change', [this.value]);
        this.dispatch('ElForm', 'compare-change', [this]); // ext-> compare
      }
    }
  };
</script>

