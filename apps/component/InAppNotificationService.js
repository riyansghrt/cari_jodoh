let notificationRef = null;

export const setInAppNotificationRef = ref => {
  notificationRef = ref;
};

export const showInAppNotification = notification => {
  notificationRef?.show?.(notification);
};

export const hideInAppNotification = () => {
  notificationRef?.hide?.();
};
