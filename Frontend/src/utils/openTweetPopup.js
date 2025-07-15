export const openTweetPopup = (url, onClose) => {
  const width = 600;
  const height = 500;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  const popup = window.open(
    url,
    'TwitterPopup',
    `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`
  );

  const interval = setInterval(() => {
    if (popup?.closed) {
      clearInterval(interval);
      onClose();
    }
  }, 500);
};
