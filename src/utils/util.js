const hasOwnProperty = Object.prototype.hasOwnProperty;

export function noop() {};

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
};

function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key];
  }
  return to;
};

export function toObject(arr) {
  var res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
};

export const getValueByPath = function(object, prop) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;
    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
};

export const generateId = function() {
  return Math.floor(Math.random() * 10000);
};

export const valueEquals = (a, b) => {
  // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

/**
 * @author liuxp
 * 扩展-> 数据对象类型判断
 * 支持返回类型：String、 Number、Boolean、Array、Object、Function、Date、Math...
 */
export const TypeOf = (o) => {
  let type = typeof o !== 'undefined' ? Object.prototype.toString.call(o) : undefined;
  if (type) {
    type = String(type).replace(/object\s+\w+/, function(rep) {
      return rep.replace(/object\s+/, '');
    }).replace(/[\[\]]*/g, '');
  }
  return type;
};

// 扩展-> 自定义转换日期格式为斜杠 YYYY/MM/DD/ HH:MM:SS 兼容格式
export const compatDateStr = function(date) {
  function getZerov(v) { return v < 10 ? '0' + parseInt(v, 10) : v; }
  if (typeof date === 'string') {
    let t = date.split(':');
    let dt = new Date(), Y = dt.getFullYear(), M = dt.getMonth() + 1, D = dt.getDate();
    if (/^\d{1,2}(:\d{1,2}){0,2}$/.test(date)) {
      if (t.length === 1) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0]) + ':00:00';
      } else if (t.length === 2) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0]) + ':' + getZerov(t[1]) + ':00';
      } else if (t.length === 3) {
        return Y + '/' + M + '/' + D + ' ' + getZerov(t[0]) + ':' + getZerov(t[1]) + ':' + getZerov(t[2]);
      } else {
        return dt;
      }
    } else {
      return String(date).replace(/\-/g, '/');
    }
  } else {
    return date;
  }
};
