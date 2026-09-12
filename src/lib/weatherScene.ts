export type WeatherScene = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';
export type WeatherTimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export interface NormalizedWeather {
  scene: WeatherScene;
  label: string;
}

const WEATHER_CODES: Record<number, NormalizedWeather> = {
  0: { scene: 'clear', label: 'Clear' },
  1: { scene: 'clear', label: 'Mainly clear' },
  2: { scene: 'cloudy', label: 'Partly cloudy' },
  3: { scene: 'cloudy', label: 'Cloudy' },
  45: { scene: 'fog', label: 'Fog' },
  48: { scene: 'fog', label: 'Icy fog' },
  51: { scene: 'rain', label: 'Light drizzle' },
  53: { scene: 'rain', label: 'Drizzle' },
  55: { scene: 'rain', label: 'Heavy drizzle' },
  56: { scene: 'rain', label: 'Freezing drizzle' },
  57: { scene: 'rain', label: 'Freezing drizzle' },
  61: { scene: 'rain', label: 'Light rain' },
  63: { scene: 'rain', label: 'Rain' },
  65: { scene: 'rain', label: 'Heavy rain' },
  66: { scene: 'rain', label: 'Freezing rain' },
  67: { scene: 'rain', label: 'Freezing rain' },
  71: { scene: 'snow', label: 'Light snow' },
  73: { scene: 'snow', label: 'Snow' },
  75: { scene: 'snow', label: 'Heavy snow' },
  77: { scene: 'snow', label: 'Snow grains' },
  80: { scene: 'rain', label: 'Light showers' },
  81: { scene: 'rain', label: 'Showers' },
  82: { scene: 'rain', label: 'Heavy showers' },
  85: { scene: 'snow', label: 'Snow showers' },
  86: { scene: 'snow', label: 'Heavy snow' },
  95: { scene: 'storm', label: 'Thunderstorm' },
  96: { scene: 'storm', label: 'Storm + hail' },
  99: { scene: 'storm', label: 'Heavy storm' }
};

export function normalizeWeather(code: number): NormalizedWeather {
  return WEATHER_CODES[code] ?? { scene: 'cloudy', label: 'Unknown' };
}

function getClockMinutes(now: Date, timeZone?: string): number {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? now.getHours());
    const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? now.getMinutes());
    return hour * 60 + minute;
  } catch (_) {
    return now.getHours() * 60 + now.getMinutes();
  }
}

function getWeatherTimeMinutes(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/T(\d{2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function getWeatherTimeOfDay(
  sunrise?: string,
  sunset?: string,
  timeZone?: string,
  providerIsDay?: boolean,
  now = new Date()
): WeatherTimeOfDay {
  const current = getClockMinutes(now, timeZone);
  const sunriseMinutes = getWeatherTimeMinutes(sunrise);
  const sunsetMinutes = getWeatherTimeMinutes(sunset);

  if (sunriseMinutes === null || sunsetMinutes === null) {
    if (current >= 6 * 60 && current < 8 * 60) return 'dawn';
    if (current >= 17 * 60 && current < 19 * 60) return 'dusk';
    if (providerIsDay !== undefined) return providerIsDay ? 'day' : 'night';
    return current >= 8 * 60 && current < 19 * 60 ? 'day' : 'night';
  }

  if (current >= sunriseMinutes - 75 && current <= sunriseMinutes + 45) return 'dawn';
  if (current >= sunsetMinutes - 75 && current <= sunsetMinutes + 45) return 'dusk';
  return current > sunriseMinutes && current < sunsetMinutes ? 'day' : 'night';
}
