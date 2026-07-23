// 中国所有省份信息
const provinces = [
  // 23个省
  { id: '11', name: '北京市', shortName: '京', pinyin: 'Beijing', type: '直辖市' },
  { id: '12', name: '天津市', shortName: '津', pinyin: 'Tianjin', type: '直辖市' },
  { id: '13', name: '河北省', shortName: '冀', pinyin: 'Hebei', type: '省' },
  { id: '14', name: '山西省', shortName: '晋', pinyin: 'Shanxi', type: '省' },
  { id: '15', name: '内蒙古自治区', shortName: '内蒙古', pinyin: 'Neimenggu', type: '自治区' },
  { id: '21', name: '辽宁省', shortName: '辽', pinyin: 'Liaoning', type: '省' },
  { id: '22', name: '吉林省', shortName: '吉', pinyin: 'Jilin', type: '省' },
  { id: '23', name: '黑龙江省', shortName: '黑', pinyin: 'Heilongjiang', type: '省' },
  { id: '31', name: '上海市', shortName: '沪', pinyin: 'Shanghai', type: '直辖市' },
  { id: '32', name: '江苏省', shortName: '苏', pinyin: 'Jiangsu', type: '省' },
  { id: '33', name: '浙江省', shortName: '浙', pinyin: 'Zhejiang', type: '省' },
  { id: '34', name: '安徽省', shortName: '皖', pinyin: 'Anhui', type: '省' },
  { id: '35', name: '福建省', shortName: '闽', pinyin: 'Fujian', type: '省' },
  { id: '36', name: '江西省', shortName: '赣', pinyin: 'Jiangxi', type: '省' },
  { id: '37', name: '山东省', shortName: '鲁', pinyin: 'Shandong', type: '省' },
  { id: '41', name: '河南省', shortName: '豫', pinyin: 'Henan', type: '省' },
  { id: '42', name: '湖北省', shortName: '鄂', pinyin: 'Hubei', type: '省' },
  { id: '43', name: '湖南省', shortName: '湘', pinyin: 'Hunan', type: '省' },
  { id: '44', name: '广东省', shortName: '粤', pinyin: 'Guangdong', type: '省' },
  { id: '45', name: '广西壮族自治区', shortName: '桂', pinyin: 'Guangxi', type: '自治区' },
  { id: '46', name: '海南省', shortName: '琼', pinyin: 'Hainan', type: '省' },
  { id: '50', name: '重庆市', shortName: '渝', pinyin: 'Chongqing', type: '直辖市' },
  { id: '51', name: '四川省', shortName: '川', pinyin: 'Sichuan', type: '省' },
  { id: '52', name: '贵州省', shortName: '黔', pinyin: 'Guizhou', type: '省' },
  { id: '53', name: '云南省', shortName: '滇', pinyin: 'Yunnan', type: '省' },
  { id: '54', name: '西藏自治区', shortName: '藏', pinyin: 'Xizang', type: '自治区' },
  { id: '61', name: '陕西省', shortName: '陕', pinyin: 'Shaanxi', type: '省' },
  { id: '62', name: '甘肃省', shortName: '甘', pinyin: 'Gansu', type: '省' },
  { id: '63', name: '青海省', shortName: '青', pinyin: 'Qinghai', type: '省' },
  { id: '64', name: '宁夏回族自治区', shortName: '宁', pinyin: 'Ningxia', type: '自治区' },
  { id: '65', name: '新疆维吾尔自治区', shortName: '新', pinyin: 'Xinjiang', type: '自治区' },
  { id: '71', name: '台湾省', shortName: '台', pinyin: 'Taiwan', type: '省' },
  { id: '81', name: '香港特别行政区', shortName: '港', pinyin: 'Hongkong', type: '特别行政区' },
  { id: '82', name: '澳门特别行政区', shortName: '澳', pinyin: 'Macau', type: '特别行政区' }
];

// 获取所有省份
export function getAllProvinces() {
  return provinces;
}

// 根据ID获取省份信息
export function getProvinceById(id) {
  return provinces.find(province => province.id === id);
}

// 根据名称获取省份信息
export function getProvinceByName(name) {
  return provinces.find(province => province.name === name);
}

// 根据类型获取省份信息（如：省、直辖市、自治区、特别行政区）
export function getProvincesByType(type) {
  return provinces.filter(province => province.type === type);
}

// 获取所有省份的名称列表
export function getProvinceNames() {
  return provinces.map(province => province.name);
}

// 导出省份数组作为默认导出
export default provinces;