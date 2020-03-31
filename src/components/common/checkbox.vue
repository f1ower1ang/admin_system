<template>
  <div class="checkbox">
    <input type="checkbox" :value="label" :name="name" :id="uniqueId">
    <label :for="uniqueId">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'checkbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    uniqueId() {
      return this.label + Math.random().toString().substring(2, 8)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .checkbox
    display flex
    align-items center
    input
      display block
      text-align center
      vertical-align middle
      transition all .2s
      visibility hidden
      &:checked
        color #fff
        background $color-theme
    label
      position relative
      padding-left 5px
      display block
      transition all .2s
      flex 1
      &:before
        top 50%
        transform translateY(-50%)
        position absolute
        right 100%
        width: .8em;
        height: .8em;
        content: '\a0'
        border 1px solid $color-text
        line-height: .8;
        transition all .2s
    input:checked+label
      color $color-theme
      &:before
        border-color $color-theme
        color #fff
        content: '\2713';
        background: $color-theme;
</style>
