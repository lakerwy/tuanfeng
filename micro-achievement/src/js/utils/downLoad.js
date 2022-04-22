export const downloadFile = (url, filename) => {
  console.log(url, filename);
  const link = document.createElement("a");
  const body = document.querySelector("body");
  fetch(url)
    .then(res => res.blob())
    .then(blob => {
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      // fix Firefox
      link.style.display = "none";
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    });
};
