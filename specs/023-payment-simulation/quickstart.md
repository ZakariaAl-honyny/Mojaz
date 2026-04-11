# Quickstart Guide

## What this feature does
Simulates the payment steps required to progress through the application lifecycle in Mojaz. No real money or external payment gateway is involved; a UX delay is put in place.

## How to test/run
1. Seed the `FeeStructures` table with values for each `FeeType` and `CategoryId`.
2. As an applicant, progress an application to a point that requires payment (e.g. initial submission, booking an exam).
3. The UI will show the exact fee fetched from the API (`/initiate`).
4. Click "Pay" -> UI waits 2 seconds -> calls (`/confirm` with `isSuccessful: true`).
5. Transaction status updates to Paid, and application automatically progresses to next gate.
6. Check Dashboard -> Payments History to see the transaction status and download the receipt.
