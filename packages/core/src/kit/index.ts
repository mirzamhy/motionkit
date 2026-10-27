// Reusable assets and atmosphere shared by scene-mode films.
export { defineAsset, type AssetType, type MotionKitAsset } from './assets';
export { ATMOSPHERE_PRESETS, getAtmosphere, type AtmospherePreset } from './atmosphere';
export { AtmosphereLayer } from './atmosphere-layer';

/** frames → seconds helpers */
export const sec = (frames: number, fps = 60) => frames / fps;
export const frames = (seconds: number, fps = 60) => Math.round(seconds * fps);
