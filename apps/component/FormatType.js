// const FormatType = text => text?.trim().toLowerCase().replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || '';
const FormatType = text =>
  text?.trim().toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean) // <— hapus elemen kosong
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || '';
export default FormatType

export const searchByName = (query, data) => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    item.name.toLowerCase().includes(lowerQuery)
  );
};

export const searchByNameSector = (query, data) => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    item.sector.toLowerCase().includes(lowerQuery)
  );
};
export const searchByNameCompany = (query, data) => {
  if (!query) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    item.company_name.toLowerCase().includes(lowerQuery)
  );
};