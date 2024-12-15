export const calculateTotalDuration = (items) => {
    const totalDuration = items.reduce((acc, item) => acc + item.duration, 0);
    const minutes = Math.floor(totalDuration / 60000);
    const seconds = Math.floor((totalDuration % 60000) / 1000);
    return `${minutes} phút ${seconds < 10 ? "0" : ""}${seconds} giây`;
  };