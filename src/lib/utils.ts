import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import hirestime from "hirestime";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatInt(n: any): any {
  return Number.isNaN(n) ? "?" : `${Math.round(n)}`;
}
const getNow = hirestime();

async function pingServer(): Promise<number> {
  try {
    const t0 = getNow();

    await fetch("https://testbed-ndn-rg.stei.itb.ac.id/stream/ping");
    const timeMs = getNow() - t0;

    return timeMs;
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
