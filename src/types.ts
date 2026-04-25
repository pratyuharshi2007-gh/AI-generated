/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Point {
  x: number;
  y: number;
}
