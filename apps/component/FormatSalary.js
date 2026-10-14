const formatSalary = (val) => {
    if (!val) return '';
  
    if (val >= 1000000) {
      return `${val / 1000000}jt`;
    } else if (val >= 1000) {
      return `${val / 1000}rb`;
    } else {
      return val.toString();
    }
  };
  
  const formatSalaryRange = (min, max) => {
    if (min && max) return `${formatSalary(min)} - ${formatSalary(max)}`;
    if (min) return `${formatSalary(min)}`;
    if (max) return `${formatSalary(max)}`;
    return '';
  };

  export default formatSalaryRange;