export type WeatherScene = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';
export type WeatherTimeOfDay = 'day' | 'dusk' | 'night';

const WEATHER_SCENES: Record<number, WeatherScene> = {
  0: 'clear',
  1: 'clear',
  2: 'cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'rain',
  53: 'rain',
  55: 'rain',
  56: 'rain',
  57: 'rain',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'rain',
  67: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'storm',
  96: 'storm',
  99: 'storm'
};

export function normalizeWeatherCode(code: number): WeatherScene {
  return WEATHER_SCENES[code] ?? 'cloudy';
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
  now = new Date()
): WeatherTimeOfDay {
  const current = getClockMinutes(now, timeZone);
  const sunriseMinutes = getWeatherTimeMinutes(sunrise);
  const sunsetMinutes = getWeatherTimeMinutes(sunset);

  if (sunriseMinutes === null || sunsetMinutes === null) {
    return current >= 17 * 60 && current < 19 * 60 ? 'dusk' : current >= 7 * 60 && current < 19 * 60 ? 'day' : 'night';
  }

  if (Math.abs(current - sunriseMinutes) <= 75 || Math.abs(current - sunsetMinutes) <= 75) {
    return 'dusk';
  }
  return current > sunriseMinutes && current < sunsetMinutes ? 'day' : 'night';
}
