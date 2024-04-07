import React, { useState, useEffect, useRef, memo } from "react";
import Timer from "./timers";
import Scrollbar from "./scrollbar";
import chessMoves from "./chessMoves.json";
function Chess(props) {
  const url = "https://chess-stockfish-16-api.p.rapidapi.com/chess/api";
  const kb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjYiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIuNSAyNXM0LjUtNy41IDMtMTAuNWMwIDAtMS0yLjUtMy0yLjVzLTMgMi41LTMgMi41Yy0xLjUgMyAzIDEwLjUgMyAxMC41IiBmaWxsPSIjMDAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxwYXRoIGQ9Ik0xMS41IDM3YzUuNSAzLjUgMTUuNSAzLjUgMjEgMHYtN3M5LTQuNSA2LTEwLjVjLTQtNi41LTEzLjUtMy41LTE2IDRWMjd2LTMuNWMtMy41LTcuNS0xMy0xMC41LTE2LTQtMyA2IDUgMTAgNSAxMFYzN3oiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMyIDI5LjVzOC41LTQgNi4wMy05LjY1QzM0LjE1IDE0IDI1IDE4IDIyLjUgMjQuNWwuMDEgMi4xLS4wMS0yLjFDMjAgMTggOS45MDYgMTQgNi45OTcgMTkuODVjLTIuNDk3IDUuNjUgNC44NTMgOSA0Ljg1MyA5IiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMTEuNSAzMGM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwbS0yMSAzLjVjNS41LTMgMTUuNS0zIDIxIDAiIHN0cm9rZT0iI2VjZWNlYyIvPjwvZz48L3N2Zz4=";
  const qb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIHN0cm9rZT0ibm9uZSI+PGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMTQiIGN5PSI5IiByPSIyLjc1Ii8+PGNpcmNsZSBjeD0iMjIuNSIgY3k9IjgiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzMSIgY3k9IjkiIHI9IjIuNzUiLz48Y2lyY2xlIGN4PSIzOSIgY3k9IjEyIiByPSIyLjc1Ii8+PC9nPjxwYXRoIGQ9Ik05IDI2YzguNS0xLjUgMjEtMS41IDI3IDBsMi41LTEyLjVMMzEgMjVsLS4zLTE0LjEtNS4yIDEzLjYtMy0xNC41LTMgMTQuNS01LjItMTMuNkwxNCAyNSA2LjUgMTMuNSA5IDI2eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNOSAyNmMwIDIgMS41IDIgMi41IDQgMSAxLjUgMSAxIC41IDMuNS0xLjUgMS0xLjUgMi41LTEuNSAyLjUtMS41IDEuNS41IDIuNS41IDIuNSA2LjUgMSAxNi41IDEgMjMgMCAwIDAgMS41LTEgMC0yLjUgMCAwIC41LTEuNS0xLTIuNS0uNS0yLjUtLjUtMiAuNS0zLjUgMS0yIDIuNS0yIDIuNS00LTguNS0xLjUtMTguNS0xLjUtMjcgMHoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTExIDM4LjVhMzUgMzUgMSAwIDAgMjMgMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTEgMjlhMzUgMzUgMSAwIDEgMjMgMG0tMjEuNSAyLjVoMjBtLTIxIDNhMzUgMzUgMSAwIDAgMjIgMG0tMjMgM2EzNSAzNSAxIDAgMCAyNCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlY2VjZWMiLz48L2c+PC9zdmc+";
  const knb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMiIGZpbGw9IiMwMDAiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjZWNlY2VjIiBzdHJva2U9IiNlY2VjZWMiLz48cGF0aCBkPSJNMjQuNTUgMTAuNGwtLjQ1IDEuNDUuNS4xNWMzLjE1IDEgNS42NSAyLjQ5IDcuOSA2Ljc1UzM1Ljc1IDI5LjA2IDM1LjI1IDM5bC0uMDUuNWgyLjI1bC4wNS0uNWMuNS0xMC4wNi0uODgtMTYuODUtMy4yNS0yMS4zNC0yLjM3LTQuNDktNS43OS02LjY0LTkuMTktNy4xNmwtLjUxLS4xeiIgZmlsbD0iI2VjZWNlYyIgc3Ryb2tlPSJub25lIi8+PC9nPjwvc3ZnPg==";
  const bb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiMwMDAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2U9IiNlY2VjZWMiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48L2c+PC9zdmc+";
  const rb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy41LTdsMS41LTIuNWgxN2wxLjUgMi41aC0yMHptLS41IDR2LTRoMjF2NEgxMnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTE0IDI5LjV2LTEzaDE3djEzSDE0eiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTQgMTYuNUwxMSAxNGgyM2wtMyAyLjVIMTR6TTExIDE0VjloNHYyaDVWOWg1djJoNVY5aDR2NUgxMXoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTEyIDM1LjVoMjFtLTIwLTRoMTltLTE4LTJoMTdtLTE3LTEzaDE3TTExIDE0aDIzIiBmaWxsPSJub25lIiBzdHJva2U9IiNlY2VjZWMiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4=";
  const pb =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgOWMtMi4yMSAwLTQgMS43OS00IDQgMCAuODkuMjkgMS43MS43OCAyLjM4QzE3LjMzIDE2LjUgMTYgMTguNTkgMTYgMjFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzLTMgMS4wNi03LjQxIDUuNTUtNy40MSAxMy40N2gyM2MwLTcuOTItNC40MS0xMi40MS03LjQxLTEzLjQ3IDEuNDctMS4xOSAyLjQxLTMgMi40MS01LjAzIDAtMi40MS0xLjMzLTQuNS0zLjI4LTUuNjIuNDktLjY3Ljc4LTEuNDkuNzgtMi4zOCAwLTIuMjEtMS43OS00LTQtNHoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==";
  const kw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMi41IDExLjYzVjZNMjAgOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTIyLjUgMjVzNC41LTcuNSAzLTEwLjVjMCAwLTEtMi41LTMtMi41cy0zIDIuNS0zIDIuNWMtMS41IDMgMyAxMC41IDMgMTAuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMTEuNSAzN2M1LjUgMy41IDE1LjUgMy41IDIxIDB2LTdzOS00LjUgNi0xMC41Yy00LTYuNS0xMy41LTMuNS0xNiA0VjI3di0zLjVjLTMuNS03LjUtMTMtMTAuNS0xNi00LTMgNiA1IDEwIDUgMTBWMzd6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTExLjUgMzBjNS41LTMgMTUuNS0zIDIxIDBtLTIxIDMuNWM1LjUtMyAxNS41LTMgMjEgMG0tMjEgMy41YzUuNS0zIDE1LjUtMyAyMSAwIi8+PC9nPjwvc3ZnPg==";
  const qw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDEyYTIgMiAwIDEgMS00IDAgMiAyIDAgMSAxIDQgMHptMTYuNS00LjVhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAwek00MSAxMmEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTE2IDguNWEyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDB6TTMzIDlhMiAyIDAgMSAxLTQgMCAyIDIgMCAxIDEgNCAweiIvPjxwYXRoIGQ9Ik05IDI2YzguNS0xLjUgMjEtMS41IDI3IDBsMi0xMi03IDExVjExbC01LjUgMTMuNS0zLTE1LTMgMTUtNS41LTE0VjI1TDcgMTRsMiAxMnoiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTkgMjZjMCAyIDEuNSAyIDIuNSA0IDEgMS41IDEgMSAuNSAzLjUtMS41IDEtMS41IDIuNS0xLjUgMi41LTEuNSAxLjUuNSAyLjUuNSAyLjUgNi41IDEgMTYuNSAxIDIzIDAgMCAwIDEuNS0xIDAtMi41IDAgMCAuNS0xLjUtMS0yLjUtLjUtMi41LS41LTIgLjUtMy41IDEtMiAyLjUtMiAyLjUtNC04LjUtMS41LTE4LjUtMS41LTI3IDB6IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0xMS41IDMwYzMuNS0xIDE4LjUtMSAyMiAwTTEyIDMzLjVjNi0xIDE1LTEgMjEgMCIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4=";
  const knw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMiAxMGMxMC41IDEgMTYuNSA4IDE2IDI5SDE1YzAtOSAxMC02LjUgOC0yMSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNCAxOGMuMzggMi45MS01LjU1IDcuMzctOCA5LTMgMi0yLjgyIDQuMzQtNSA0LTEuMDQyLS45NCAxLjQxLTMuMDQgMC0zLTEgMCAuMTkgMS4yMy0xIDItMSAwLTQuMDAzIDEtNC00IDAtMiA2LTEyIDYtMTJzMS44OS0xLjkgMi0zLjVjLS43My0uOTk0LS41LTItLjUtMyAxLTEgMyAyLjUgMyAyLjVoMnMuNzgtMS45OTIgMi41LTNjMSAwIDEgMyAxIDMiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNOS41IDI1LjVhLjUuNSAwIDEgMS0xIDAgLjUuNSAwIDEgMSAxIDB6bTUuNDMzLTkuNzVhLjUgMS41IDMwIDEgMS0uODY2LS41LjUgMS41IDMwIDEgMSAuODY2LjV6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==";
  const bw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNOSAzNmMzLjM5LS45NyAxMC4xMS40MyAxMy41LTIgMy4zOSAyLjQzIDEwLjExIDEuMDMgMTMuNSAyIDAgMCAxLjY1LjU0IDMgMi0uNjguOTctMS42NS45OS0zIC41LTMuMzktLjk3LTEwLjExLjQ2LTEzLjUtMS0zLjM5IDEuNDYtMTAuMTEuMDMtMTMuNSAxLTEuMzU0LjQ5LTIuMzIzLjQ3LTMtLjUgMS4zNTQtMS45NCAzLTIgMy0yeiIvPjxwYXRoIGQ9Ik0xNSAzMmMyLjUgMi41IDEyLjUgMi41IDE1IDAgLjUtMS41IDAtMiAwLTIgMC0yLjUtMi41LTQtMi41LTQgNS41LTEuNSA2LTExLjUtNS0xNS41LTExIDQtMTAuNSAxNC01IDE1LjUgMCAwLTIuNSAxLjUtMi41IDQgMCAwLS41LjUgMCAyeiIvPjxwYXRoIGQ9Ik0yNSA4YTIuNSAyLjUgMCAxIDEtNSAwIDIuNSAyLjUgMCAxIDEgNSAweiIvPjwvZz48cGF0aCBkPSJNMTcuNSAyNmgxME0xNSAzMGgxNW0tNy41LTE0LjV2NU0yMCAxOGg1IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvc3ZnPg==";
  const rw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDM5aDI3di0zSDl2M3ptMy0zdi00aDIxdjRIMTJ6bS0xLTIyVjloNHYyaDVWOWg1djJoNVY5aDR2NSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzQgMTRsLTMgM0gxNGwtMy0zIi8+PHBhdGggZD0iTTMxIDE3djEyLjVIMTRWMTciIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTMxIDI5LjVsMS41IDIuNWgtMjBsMS41LTIuNSIvPjxwYXRoIGQ9Ik0xMSAxNGgyMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L3N2Zz4=";
  const pw =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NSIgaGVpZ2h0PSI0NSI+PHBhdGggZD0iTTIyLjUgOWMtMi4yMSAwLTQgMS43OS00IDQgMCAuODkuMjkgMS43MS43OCAyLjM4QzE3LjMzIDE2LjUgMTYgMTguNTkgMTYgMjFjMCAyLjAzLjk0IDMuODQgMi40MSA1LjAzLTMgMS4wNi03LjQxIDUuNTUtNy40MSAxMy40N2gyM2MwLTcuOTItNC40MS0xMi40MS03LjQxLTEzLjQ3IDEuNDctMS4xOSAyLjQxLTMgMi40MS01LjAzIDAtMi40MS0xLjMzLTQuNS0zLjI4LTUuNjIuNDktLjY3Ljc4LTEuNDkuNzgtMi4zOCAwLTIuMjEtMS43OS00LTQtNHoiIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==";
  const svgContainerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [turn, setTurn] = useState(0);
  const [victoire, setVictoire] = useState("none")
  const [board, setBoard] = useState([
    { type: "rook", pos: { x: 0, y: 0 }, color: "black", hasMoved: false },
    { type: "knight", pos: { x: 1, y: 0 }, color: "black", hasMoved: false },
    { type: "bishop", pos: { x: 2, y: 0 }, color: "black", hasMoved: false },
    { type: "queen", pos: { x: 3, y: 0 }, color: "black", hasMoved: false },
    { type: "king", pos: { x: 4, y: 0 }, color: "black", hasMoved: false },
    { type: "bishop", pos: { x: 5, y: 0 }, color: "black", hasMoved: false },
    { type: "knight", pos: { x: 6, y: 0 }, color: "black", hasMoved: false },
    { type: "rook", pos: { x: 7, y: 0 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 0, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 1, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 2, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 3, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 4, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 5, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 6, y: 1 }, color: "black", hasMoved: false },
    { type: "pawn", pos: { x: 7, y: 1 }, color: "black", hasMoved: false },
    { type: "empty", pos: { x: 0, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 1, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 2, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 3, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 4, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 5, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 6, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 7, y: 2 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 0, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 1, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 2, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 3, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 4, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 5, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 6, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 7, y: 3 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 0, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 1, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 2, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 3, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 4, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 5, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 6, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 7, y: 4 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 0, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 1, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 2, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 3, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 4, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 5, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 6, y: 5 }, color: null, hasMoved: false },
    { type: "empty", pos: { x: 7, y: 5 }, color: null, hasMoved: false },
    { type: "pawn", pos: { x: 0, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 1, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 2, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 3, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 4, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 5, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 6, y: 6 }, color: "white", hasMoved: false },
    { type: "pawn", pos: { x: 7, y: 6 }, color: "white", hasMoved: false },
    { type: "rook", pos: { x: 0, y: 7 }, color: "white", hasMoved: false },
    { type: "knight", pos: { x: 1, y: 7 }, color: "white", hasMoved: false },
    { type: "bishop", pos: { x: 2, y: 7 }, color: "white", hasMoved: false },
    { type: "queen", pos: { x: 3, y: 7 }, color: "white", hasMoved: false },
    { type: "king", pos: { x: 4, y: 7 }, color: "white", hasMoved: false },
    { type: "bishop", pos: { x: 5, y: 7 }, color: "white", hasMoved: false },
    { type: "knight", pos: { x: 6, y: 7 }, color: "white", hasMoved: false },
    { type: "rook", pos: { x: 7, y: 7 }, color: "white", hasMoved: false },
    {
      type: "placeholder",
      pos: { x: -1, y: -1 },
      color: "placeholder",
      hasMoved: false
    }
  ]);
  const [pinned, setPinned] = useState({black: false, white: false})
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState([]);
  const [selected, setSelected] = useState({
    x: -1,
    y: -1,
    type: "pawn",
    color: "blank"
  });
  const [aimedPos, setAim] = useState({ x: -1, y: -1 });
  const xAxis = [
    { value: "a", key: 0 },
    { value: "b", key: 1 },
    { value: "c", key: 2 },
    { value: "d", key: 3 },
    { value: "e", key: 4 },
    { value: "f", key: 5 },
    { value: "g", key: 6 },
    { value: "h", key: 7 }
  ];
  const BoardToFEN = board => {
    //console.log(board);
    if (board === undefined) return "";
    let response = "";
    let voidSquare = 0;
    board.forEach((e, index) => {
      //console.log(voidSquare)
      const isSeperator = index => !(index % 8) && index < 63;
      if (isSeperator(index) && index > 0) {
        response += "/";
      }
      if (index > 63) return;
      if (e.color === null) {
        voidSquare++;
        if (voidSquare === 8 || isSeperator(index + 1)) {
          response += voidSquare.toString();
          voidSquare = 0;
        }
        return;
      }
      if (voidSquare > 0) {
        response += voidSquare.toString();
      }
      let isBlack = e.color === "black";
      let piece;
      switch (e.type) {
        case "knight":
          isBlack ? (piece = "n") : (piece = "N");
          break;
        case "bishop":
          isBlack ? (piece = "b") : (piece = "B");
          break;
        case "king":
          isBlack ? (piece = "k") : (piece = "K");
          break;
        case "queen":
          isBlack ? (piece = "q") : (piece = "Q");
          break;
        case "rook":
          isBlack ? (piece = "r") : (piece = "R");
          break;
        case "pawn":
          isBlack ? (piece = "p") : (piece = "P");
          break;
        default:
          break;
      }
      response += piece;
      voidSquare = 0;
    });
    return response;
  };
  const getMoves = (x, y) => {
    let piece = getPiece(x, y);
    let Allmoves = [{ x: -1, y: -1 }];
    if (piece.type === "placeholder") return Allmoves;
    switch (piece.type) {
      case "knight":
        Allmoves = addknightMoves(selected.x, selected.y);
        break;
      case "bishop":
        Allmoves = addBishopMoves(selected.x, selected.y);
        break;
      case "king":
        Allmoves = addKingMoves(selected.x, selected.y);
        break;
      case "queen":
        Allmoves = addBishopMoves(selected.x, selected.y);
        Allmoves = Allmoves.concat(addRookMoves(selected.x, selected.y));
        break;
      case "rook":
        Allmoves = addRookMoves(selected.x, selected.y);
        break;
      case "pawn":
        Allmoves = addPawnMoves(selected.x, selected.y);
        break;
    }
    //if (pinned)
      //Allmoves.filter(e => !checkPin(getSimulateBoard(board, selected.x, selected.y, e.x, e.y), selected.color))
    return Allmoves;
  };

  const getPieceType = letter => {
    switch (letter) {
      case "K":
        return "king";
      case "Q":
        return "queen";
      case "N":
        return "knight";
      case "B":
        return "bishop";
      case "R":
        return "rook";
      default:
        return "pawn";
    }
  };
  useEffect(() => {
    return;
    if (history.length != 0) return;
    let Object = JSON.parse(JSON.stringify(chessMoves));
    ////console.log(chessMoves)
    Object.forEach(e => {
      let subObject = { color: e.color, log: e.log };
      //console.log(e);
      history.unshift(subObject);
    });
    let currentTurn = 0;
    let currentboard = board;
    let x;
    let y;
    let xAxis = [
      { value: "a", key: 0 },
      { value: "b", key: 1 },
      { value: "c", key: 2 },
      { value: "d", key: 3 },
      { value: "e", key: 4 },
      { value: "f", key: 5 },
      { value: "g", key: 6 },
      { value: "h", key: 7 }
    ];
    let reverseHistory = history.reverse();
    //console.log(history);
    history.reverse().forEach(element => {
      let piece;

      if (element.log.length === 0) {
        //console.log("Error lol");
        return;
      }
      let size = element.log.length > 4 ? 1 : 0;
      x = xAxis.find(e => e.value == element.log[size]).key;
      y = element.log[size + 1] - 1;
      let selectpos = { x: x, y: y };
      piece = getPiece(x, y);
      //console.log(piece);
      let moves = getMoves(x, y);

      //console.log(currentTurn, element.log, element.log.length);

      x = xAxis.find(e => e.value == element.log[element.log.length - 2]).key;
      y = element.log[element.log.length - 1] - 1;
      let aimpos = { x: x, y: y };
      if (
        element.color === piece.color &&
        moves.filter(e => e.x === aimpos.x && e.y === aimpos.y)
      ) {
        let aimIndex = aimpos.y * 8 + aimpos.x;
        let selectIndex = selectpos.y * 8 + selectpos.x;
        //console.log("aim", aimpos);
        //console.log("select", selectpos);
        currentboard[aimIndex].type = piece.type;
        currentboard[aimIndex].color = piece.color;
        currentboard[aimIndex].hasMoved = true;
        currentboard[selectIndex].type = "blank";
        currentboard[selectIndex].color = null;
        currentboard[selectIndex].hasMoved = false;
      } else {
        //console.log("Other Error lol");
        return;
      }
      currentTurn++;
    });
    setTurn(currentTurn);
    setBoard(prev => currentboard);
  }, []);
  useEffect(() => {
    const updateContainerSize = () => {
      const container = svgContainerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        setContainerSize(prev => ({
          width: containerRect.width,
          height: containerRect.height
        }));
      }
    };
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => {
      window.removeEventListener("resize", updateContainerSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const addknightMoves = (x, y) => {
    let kMoves = [];
    kMoves.push({ x: x + 1, y: y + 2 });
    kMoves.push({ x: x + 2, y: y + 1 });
    kMoves.push({ x: x + 1, y: y - 2 });
    kMoves.push({ x: x + 2, y: y - 1 });
    kMoves.push({ x: x - 1, y: y + 2 });
    kMoves.push({ x: x - 2, y: y + 1 });
    kMoves.push({ x: x - 1, y: y - 2 });
    kMoves.push({ x: x - 2, y: y - 1 });
    return kMoves.filter(
      e =>
        !(e.x < 0 || e.y < 0 || e.x > 7 || e.y > 7) &&
        getPiece(e.x, e.y).color !== selected.color
    );
  };
  const addBishopMoves = (x, y) => {
    let bMoves = [];
    for (let i = -7; i < 8; i++) {
      bMoves.push({ x: x + i, y: y + i });
      bMoves.push({ x: x + i, y: y - i });
    }
    return bMoves.filter(
      e =>
        !(e.x < 0 || e.y < 0 || e.x > 7 || e.y > 7) &&
        getPiece(e.x, e.y).color !== selected.color &&
        legalmove(e.x, e.y)
    );
  };
  const addRookMoves = (x, y) => {
    let rMoves = [];
    for (let i = -7; i < 8; i++) {
      rMoves.push({ x: x + i, y: y });
      rMoves.push({ x: x, y: y + i });
    }
    return rMoves.filter(
      e =>
        !(e.x < 0 || e.y < 0 || e.x > 7 || e.y > 7) &&
        getPiece(e.x, e.y).color !== selected.color &&
        legalmove(e.x, e.y)
    );
  };
  const addKingMoves = (x, y) => {
    let kMoves = [];
    //diago
    kMoves.push({ x: x + 1, y: y + 1 });
    kMoves.push({ x: x + 1, y: y - 1 });
    kMoves.push({ x: x - 1, y: y + 1 });
    kMoves.push({ x: x - 1, y: y - 1 });
    //lignes
    kMoves.push({ x: x, y: y + 1 });
    kMoves.push({ x: x + 1, y: y });
    kMoves.push({ x: x, y: y - 1 });
    kMoves.push({ x: x - 1, y: y });
    return kMoves.filter(
      e =>
        !(e.x < 0 || e.y < 0 || e.x > 7 || e.y > 7) &&
        getPiece(e.x, e.y).color !== selected.color &&
        legalmove(e.x, e.y)
    );
  };
  const getPiece = (x, y) => {
    ////console.log(x, y, board[(y * 8) + x])
    if (x < 0 || y < 0 || x > 7 || y > 7) return board[64];
    return board[y * 8 + x];
  };
  const addPawnMoves = (x, y) => {
    let pMoves = [];
    let fMove = !getPiece(selected.x, selected.y).hasMoved;
    const direction = selected.color === "black" ? 1 : -1;
    pMoves.push({ x: x, y: y + direction * 1 });
    if (fMove) pMoves.push({ x: x, y: y + direction * 2 });
    let piece1 = getPiece(x + 1, y + 1 * direction);
    let piece2 = getPiece(x - 1, y + 1 * direction);
    pMoves = pMoves.filter(e => getPiece(e.x, e.y).color == null);
    if (piece1.color !== null && piece1.color !== selected.color)
      pMoves.push({ x: x + 1, y: y + direction * 1 });
    if (piece2.color !== null && piece2.color !== selected.color)
      pMoves.push({ x: x - 1, y: y + direction * 1 });
    return pMoves.filter(
      e =>
        !(e.x < 0 || e.y < 0 || e.x > 7 || e.y > 7) &&
        getPiece(e.x, e.y).color !== selected.color &&
        legalmove(e.x, e.y)
    );
  };
  const checkPin = (board, targetColor) => {
    let response = false;
    board.map((e, index) => {
      if (response) return;
      let color = e.color
      if (color === targetColor || color === null) return;
      let currentMove = getMoves(e.pos.x, e.pos.y);
      currentMove.map((e, index) => {
        //console.log("moves:", index, e);
        const piece = getPiece(e.x, e.y);
        if (piece.type === "king" && color !== piece.color) {
          response = true;
        }
      })
    });
    return response;
  }
  const copyArray = (array) =>{
    let cpyArray = [];
    for (let index = 0; index < array.length; index++) {
      cpyArray[index] = array[index];
    }
    return cpyArray;
  }
  const getSimulateBoard = (board, selectx, selecty, aimx, aimy) => {
    let simulation = copyArray(board)
    let aimIndex = aimy * 8 + aimx;
    let selectedIndex = selecty * 8 + selectx;
    let selectpiece = getPiece(selectx, selecty)
    console.log(selectx, selecty, "sected =", selectpiece)
    console.log("heya", simulation, simulation[aimIndex], simulation[selectedIndex])
    simulation[aimIndex].type = selectpiece.type;
    simulation[aimIndex].color = selectpiece.color;
    simulation[aimIndex].hasMoved = true;
    simulation[selectedIndex].type = "empty";
    simulation[selectedIndex].color = null;
    simulation[selectedIndex].hasMoved = false;
    return simulation;
  }
  useEffect(
    () => {

    },
    [moves]
  );
  useEffect(
    () => {
      // //console.log("selected", selected.color, selected.type, selected.x, selected.y)
      setMoves(() => {
        return getMoves(selected.x, selected.y);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [selected]
  );

  const renderSquare = (x, y, color) => {
    const squareSize = containerSize.height * 0.8 / 8;
    return (
      <rect
        key={`${x}-${y}`}
        x={x * squareSize}
        y={y * squareSize}
        width={squareSize}
        height={squareSize}
        fill={color}
      />
    );
  };
  const renderPiece = (type, color, x, y, ratio) => {
    let piece = "";
    if (color == null) return;
    ////console.log("rendering piece", type, color, x, y, ratio)
    switch (type) {
      case "knight":
        color === "black" ? (piece = knb) : (piece = knw);
        break;
      case "bishop":
        color === "black" ? (piece = bb) : (piece = bw);
        break;
      case "king":
        color === "black" ? (piece = kb) : (piece = kw);
        break;
      case "queen":
        color === "black" ? (piece = qb) : (piece = qw);
        break;
      case "rook":
        color === "black" ? (piece = rb) : (piece = rw);
        break;
      case "pawn":
        color === "black" ? (piece = pb) : (piece = pw);
        break;
      default:
        break;
    }
    if ((turn % 2 && color === "black") || (!(turn % 2) && color === "white"))
      return (
        <image
          onClick={() =>
            setSelected(prev => ({ x: x, y: y, type: type, color: color }))}
          x={x * ratio}
          y={y * ratio}
          width={ratio}
          height={ratio}
          xlinkHref={piece}
        />
      );
    else
      return (
        <image
          x={x * ratio}
          y={y * ratio}
          width={ratio}
          height={ratio}
          xlinkHref={piece}
          style={{ pointerEvents: "none" }}
        />
      );
  };
  const legalmove = (aimedPosx, aimedPosy) => {
    let aimIndex = aimedPosy * 8 + aimedPosx;
    let selectedIndex = selected.y * 8 + selected.x;
    if (
      aimIndex > 63 ||
      selectedIndex > 63 ||
      aimIndex < 0 ||
      selectedIndex < 0
    )
      return false;
    if (board[aimIndex].color === board[selectedIndex].color) return false;
    ////console.log("pass the forst tests")
    if (aimedPosx === selected.x || aimedPosy === selected.y) {
      //straight movements
      let xdiff = aimedPosx - selected.x;
      let ydiff = aimedPosy - selected.y;
      let direction = (xdiff + ydiff) / Math.abs(xdiff + ydiff);
      ////console.log("direction =", direction, " diff = ", xdiff + ydiff, "starting piece: ", getPiece(selected.x, selected.y))
      let isRow = xdiff;
      for (let i = 1; i < Math.abs(xdiff + ydiff); i++) {
        //isRow ? //console.log("ROW", selected.x, selected.y + (i * direction)) : //console.log("COL", selected.x + (i * direction), selected.y)
        if (
          (isRow &&
            getPiece(selected.x + i * direction, selected.y).color !== null) ||
          (!isRow &&
            getPiece(selected.x, selected.y + i * direction).color !== null)
        ) {
          // isRow ? //console.log(i, "ROW :", getPiece(selected.x, selected.y + (i * direction))) : //console.log(i, "COL: ", getPiece(selected.x + (i * direction), selected.y))
          return false;
        }
      }
    } else if (
      Math.abs(aimedPosx - selected.x) === Math.abs(aimedPosy - selected.y)
    ) {
      //diagonals movements
      ////console.log("diag")
      let xdiff = (aimedPosx - selected.x) / Math.abs(selected.x - aimedPosx);
      let ydiff = (aimedPosy - selected.y) / Math.abs(selected.y - aimedPosy);
      for (let i = 1; i < Math.abs(selected.x - aimedPosx); i++) {
        ////console.log(selected.x + (i * xdiff), selected.y + (i * ydiff))
        if (
          getPiece(selected.x + i * xdiff, selected.y + i * ydiff).color !==
          null
        ) {
          ////console.log(i, "DIAG", getPiece(selected.x + (i * xdiff), selected.y + (i * ydiff)))
          return false;
        }
      }
    }

    return true;
  };
  useEffect(
    () => {
      if (!(turn % 2)) return;
      async function fetchData() {
        let FEN = BoardToFEN(board);
        ////console.log(FEN);
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key":
              "175cfbd7f4mshf6a36262f18ce40p118a25jsnf0ca0aa5056f",
            "X-RapidAPI-Host": "chess-stockfish-16-api.p.rapidapi.com"
          },
          body: new URLSearchParams({
            fen: FEN
          })
        };

        try {
          const response = await fetch(url, options);
          const result = await response.json();
          console.log(result);
          let move = result.bestmove;
          let selectx = xAxis.find(e => e.value == move[0]).key;
          let selecty = 8 - move[1];
          let aimx = xAxis.find(e => e.value == move[2]).key;
          let aimy = 8 - move[3];
          let piece = getPiece(selectx, selecty);
          // //console.log(piece)
          setSelected(prev => ({
            x: piece.pos.x,
            y: piece.pos.y,
            type: piece.type,
            color: piece.color
          }));
          setAim(prev => ({ x: aimx, y: aimy }));
        } catch (error) {
          //console.error(error);
        }
      }
      fetchData();
    },
    [board]
  );

  useEffect(
    () => {
      //console.log(selected, "will become ", aimedPos)
      if (getPiece(aimedPos.x, aimedPos.y).type === "placeholder") return;
      setBoard(() => {
        let tmp = [...board];
        let aimIndex = aimedPos.y * 8 + aimedPos.x;
        let selectedIndex = selected.y * 8 + selected.x;
        ////console.log("selected", tmp[selectedIndex].pos, "aim", tmp[aimIndex].pos)
        tmp[aimIndex].type = selected.type;
        tmp[aimIndex].color = selected.color;
        tmp[aimIndex].hasMoved = true;
        tmp[selectedIndex].type = "empty";
        tmp[selectedIndex].color = null;
        tmp[selectedIndex].hasMoved = false;
        return tmp;
      });
      setMoves([]);
      setTurn(prev => prev + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [aimedPos]
  );
  useEffect(
    () => {
      if (selected.x < 0) return;
      setHistory(prev => {
        let log = [...history];
        let chatlog = "";
        let xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
        let yAxis = ["8", "7", "6", "5", "4", "3", "2", "1"];
        switch (selected.type) {
          case "king":
            chatlog = "K";
            break;
          case "queen":
            chatlog = "Q";
            break;
          case "rook":
            chatlog = "R";
            break;
          case "bishop":
            chatlog = "B";
            break;
          case "knight":
            chatlog = "N";
            break;
          default:
            break;
        }
        chatlog += xAxis[selected.x] + yAxis[selected.y];
        chatlog += xAxis[aimedPos.x] + yAxis[aimedPos.y];
        let play = { color: selected.color, log: chatlog };
        log.unshift(play);
        let targetColor = selected.color === "white" ? "black" : "white"
        if (!checkPin(board, targetColor)) {
          targetColor === "black" ? setPinned(prev => ({...prev, black: false})) : setPinned(prev => ({...prev, white: false}));    
          return log;
        }
        else
          targetColor === "black" ? setPinned(prev => ({...prev, black: true})) : setPinned(prev => ({...prev, white: true}));
        console.log(targetColor, "king is pinned :",targetColor === "black" ? pinned.black : pinned.white);
        let canUnpin = false;
        //foreach pieces of the opposite color of selected, get the possible moves, check foreach of those moves if the king would still be pinned if the player did this move.
        //If no moves are possible then the player looses
        board.map(e => {
          if (e.color === null || e.color !== selected.color) return;
          let Currentmoves = getMoves(e.pos.x, e.pos.y);
          Currentmoves.map(f => {
          let simulation = getSimulateBoard(board, e.pos.x, e.pos.y, f.x, f.y);
          if (!checkPin(simulation, targetColor)) {canUnpin = true}
            
          })
        })
        if (!canUnpin)
          setVictoire(selected.color);
        return log;
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [turn]
  );
  const renderMoves = (x, y, ratio) => {
    let isReachable = false;
    moves.map(e => {
      if (e.x === x && e.y === y) isReachable = true;
    });
    return isReachable
      ? <React.Fragment>
        <circle
          cx={x * ratio + ratio / 2}
          cy={y * ratio + ratio / 2}
          r={ratio / 8}
          fill="grey"
        />
        <rect
          onClick={() => setAim(prev => ({ x: x, y: y }))}
          x={x * ratio}
          y={y * ratio}
          width={ratio}
          height={ratio}
          fill="transparent"
        />
      </React.Fragment>
      : <circle cx="0" cy="0" r="0" />;
  };
  const renderPieces = () => {
    const colors = ["#FFCE9E", "#D18B47"];
    return board.map((e, index) => {
      return (
        <React.Fragment key={index}>
          {renderSquare(e.pos.x, e.pos.y, colors[(e.pos.x + e.pos.y) % 2])}
          {renderPiece(
            e.type,
            e.color,
            e.pos.x,
            e.pos.y,
            containerSize.height * 0.8 / 8
          )}
          {renderMoves(e.pos.x, e.pos.y, containerSize.height * 0.8 / 8)}
        </React.Fragment>
      );
    });
  };

  useEffect(() => { }, [history]);
  const renderElem = e => {
    ////console.log(e)
    let color = e.color;
    return (
      <div style={{ border: "solid white 1px", color: "white" }}>
        {color} : {e.log}
      </div>
    );
  };
  const Historic = () => {
    if (history.length === 0) return null;
    return history.map((e, index) => {
      return (
        <React.Fragment key={index}>
          {renderElem(e)}
        </React.Fragment>
      );
    });
  };
  //systeme de pin du roi, roque, en passant, condition de victoire, system de memo des moves et systeme de play de moves auto si memo move
  //fenetre de param
  if (victoire !== "none")
    return <div>{victoire} won !</div>
  else
  {
    return (
      <div
        ref={svgContainerRef}
        style={{
          width: "70vw",
          height: "70vh",
          position: "relative",
          backgroundColor: "transparent",
          opacity: 1,
          paddingBottom: "10 vh",
          flexDirection: "row"
        }}
      >
        <svg
          width={containerSize.height * 0.8}
          height={containerSize.height * 0.8}
          style={{ border: "solid black 2px", boxShadow: "5px 5px 5px black" }}
        >
          {renderPieces()}
        </svg>
        <div
          style={{
            border: "solid black 2px",
            maxHeight: "10vh",
            background: "linear-gradient(50deg, magenta, blue)",
            flexDirection: "column",
            width: "100%"
          }}
        >
          <Scrollbar>
            {Historic()}
          </Scrollbar>
        </div>
      </div>
    );
  }
  
}

export default Chess;
