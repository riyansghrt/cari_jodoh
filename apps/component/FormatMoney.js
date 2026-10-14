const FormatMoney = {
    commafy(char) {
        let str = char.toString().split('.');
        if (str[0].length >= 4) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
        }
        if (str[1] && str[1].length >= 4) {
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join('.');
    },
    getFormattedMoney: (value, curr) => {
        value = parseInt(value, 10)
      let currency = curr;
      if (!curr) currency = '';
      return currency + ' ' + FormatMoney.commafy(value);
    },
  };
  export default FormatMoney;
  