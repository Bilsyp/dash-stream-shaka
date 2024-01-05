import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatInt(n: any): any {
  return Number.isNaN(n) ? "?" : `${Math.round(n)}`;
}
async function pingServer(): Promise<number> {
  try {
    const startTime = new Date().getTime();

    await fetch("https://testbed-ndn-rg.stei.itb.ac.id/stream/ping");
    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;

    return responseTime;
  } catch (error) {
    return NaN;
  }
}

export async function measureRTTAndRTO() {
  try {
    const responseTime = await pingServer();
    const rto = calculateRTO(responseTime);
    const result = {
      rto,
      rtt: responseTime,
    };
    return result;
  } catch (error: any | unknown) {
    return NaN;
  }
}
function calculateRTO(rtt: number) {
  const constant = 2;
  return rtt * constant;
}
