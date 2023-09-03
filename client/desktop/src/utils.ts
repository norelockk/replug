export const validateUrl = (v: string) => /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(v) ||
  /^[0-9a-fA-F:]+(:\d+)?$/.test(v) ||
  /^([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?$/i.test(v);