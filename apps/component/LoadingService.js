let loadingRef = null;

export const setLoadingRef = (ref) => {
  loadingRef = ref;
};

export const showLoading = () => {
  loadingRef?.show?.();
};

export const hideLoading = () => {
  loadingRef?.hide?.();
};