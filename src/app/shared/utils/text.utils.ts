export function cleanInvisible(text: string): string {
  return text.replace(/[\s​ ‌‍﻿]/g, '');
}
