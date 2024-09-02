import express from 'express'
import App from './src/utils/App.js';
import { config } from 'dotenv'
// ========================= App init ==========================================



config({ path: "./secret.env" })
App(express)

