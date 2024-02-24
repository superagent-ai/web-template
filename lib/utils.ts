import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  TbFileTypePdf,
  TbFileTypeDocx,
  TbFileTypeXls,
  TbFile,
} from "react-icons/tb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformStockData(data: any) {
  const timeSeries = data["Time Series (Daily)"];
  const dataArray = [];

  for (const date in timeSeries) {
    if (timeSeries.hasOwnProperty(date)) {
      const dataEntry = timeSeries[date];
      dataArray.unshift({
        date: date,
        open: parseFloat(dataEntry["1. open"]),
        high: parseFloat(dataEntry["2. high"]),
        low: parseFloat(dataEntry["3. low"]),
        close: parseFloat(dataEntry["4. close"]),
        volume: parseFloat(dataEntry["5. volume"]),
      });
    }
  }

  return dataArray;
}

export function parseJsonFromString(str: string) {
  try {
    // Replace leading and trailing single quotes with double quotes
    let correctedStr = str
      .replace(/^\[\'|\'\]$/g, '["')
      .replace(/\'\]$/g, '"]');
    // Replace key-value single quotes with double quotes, taking care not to replace escaped single quotes within string values
    correctedStr = correctedStr.replace(/\'(?!\\)(.*?)(?<!\\)\'/g, (match) => {
      return match.replace(/'/g, '"');
    });
    correctedStr = correctedStr.replace(/True/g, "true");
    correctedStr = correctedStr.replace(/False/g, "false");
    return JSON.parse(correctedStr);
  } catch (e) {
    console.log("Failed to parse JSON, returning []:", e);
    return [];
  }
}

export function getIconAndColor(url: string) {
  let icon, color;
  const extension = url.split(".").pop();

  switch (extension) {
    case "pdf":
      icon = TbFileTypePdf;
      color = "text-red-600";
      break;
    case "docx":
      icon = TbFileTypeDocx;
      color = "text-blue-600";
      break;
    case "xlsx":
      icon = TbFileTypeXls;
      color = "text-green-600";
      break;
    default:
      icon = TbFile;
      color = "text-gray-500";
  }

  return { icon, color };
}
