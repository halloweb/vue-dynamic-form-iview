import string from './string'
import number from './number'
import percent from './percent'
import select from './select'
import radioGroup from './radio'
import checkbox from './checkbox'
import switchs from './switch'
import date from './date'
import time from './time'
import selectStep from './selectStep'
import color from './color'
import stringList from './stringList'
import keyValue from './keyValue'
import list from './list'
import dragValue from './dragValue'
/*
TODO 类型计划
[v] string
[v] number
[v] text
[v] percent

[v] select
[ ] selctList
[v] selectMulti
[v] selectStep(下拉框,联动)
[v] radio
[v] radioGroup(button形态)
[v] checkbox
[v] checkList
[v] switch

[v] date
[v] time
[v] dateRange
[v] timeRange
[v] year
[v] month

[ ] stringList
[ ] numberRange

[ ] keyValue
[v] json

[ ] list
[ ] listRelate //关联表用于展示
[ ] form
[ ] group 分组

[v] file
[v] image

*/

export default {
  string,
  number,
  text: string,
  percent,
  select,
  selectMulti: select,
  radioGroup,
  checkbox,
  checkList: checkbox,
  switch: switchs,
  date,
  time,
  selectStep,
  color,
  stringList,
  keyValue,
  list,
  dragValue
}
